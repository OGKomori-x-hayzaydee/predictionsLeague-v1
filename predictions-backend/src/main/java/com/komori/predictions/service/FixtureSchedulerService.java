package com.komori.predictions.service;

import com.komori.predictions.dto.enumerated.GameStatus;
import com.komori.predictions.dto.request.GameStatusAndScore;
import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.entity.MatchEntity;
import com.komori.predictions.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixtureSchedulerService {
    private final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final APIService apiService;
    private final PredictionService predictionService;
    private final MatchRepository matchRepository;
    private final ChipService chipService;
    private final MatchdayService matchdayService;

    public void scheduleFixturesForTheDay() {
        List<Fixture> fixtures = getFixturesForTheDay();
        if (!fixtures.isEmpty()) {
            Map<Long, GameStatusAndScore> statusMap = apiService.getGamesStatus();

            for (Fixture fixture : fixtures) {
                if (statusMap.get(fixture.getId()).getGameStatus() == GameStatus.LIVE) {
                    startGoalPolling(fixture);
                }
                else if (statusMap.get(fixture.getId()).getGameStatus() == GameStatus.TIMED) {
                    long delayMillis = Duration.between(Instant.now(),
                            fixture.getDate().toInstant()).toMillis();

                    if (delayMillis > 0) {
                        scheduledExecutorService.schedule(() -> waitForFixtureToStart(fixture), delayMillis, TimeUnit.MILLISECONDS);
                        log.info("Scheduled {} vs {} at {}.", fixture.getHomeTeam(), fixture.getAwayTeam(), fixture.getDate());
                    }
                }
            }
        }
    }

    private List<Fixture> getFixturesForTheDay() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        while (fixtures == null) {
            log.warn("Fixtures list not found in redis. Fetching latest fixtures...");
            apiService.updateFixtures();
            fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        }

        ZoneId zoneId = ZoneId.of("UTC");
        LocalDate today = LocalDate.now(zoneId);

        return fixtures.stream()
                .filter(fixture -> fixture.getDate().atZoneSameInstant(zoneId).toLocalDate().isEqual(today))
                .toList();
    }

    private void waitForFixtureToStart(Fixture fixture) {
        final ScheduledFuture<?>[] watcherHolder = new ScheduledFuture<?>[1];

        watcherHolder[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            Map<Long, GameStatusAndScore> statusMap = apiService.getGamesStatus();
            if (statusMap.get(fixture.getId()).getGameStatus() == GameStatus.LIVE) {
                log.info("{} vs {} is now live!", fixture.getHomeTeam(), fixture.getAwayTeam());
                startGoalPolling(fixture);

                watcherHolder[0].cancel(false);
            }
        }, 0, 2, TimeUnit.MINUTES);
    }

    private void startGoalPolling(Fixture fixture) {
        log.info("Starting goal polling for fixture {} vs {}", fixture.getHomeTeam(), fixture.getAwayTeam());
        final ScheduledFuture<?>[] pollingTask = new ScheduledFuture<?>[1];

        pollingTask[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            GameStatusAndScore gameStatusAndScore = apiService.getGamesStatus().get(fixture.getId());
            if (gameStatusAndScore.getGameStatus() == GameStatus.FINISHED) {
                // Retrieve goalscorers
                log.info("Retrieving goalscorers...");
                HomeAndAwayScorers scorers = apiService.getGoalScorers(fixture.getId());

                // Update Redis cache
                log.info("Updating Redis cache...");
                List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                if (fixtures == null) {
                    log.warn("Fixtures list not found in redis. Fetching latest fixtures...");
                    apiService.updateFixtures();
                    return;
                }

                for (Fixture retrievedFixture : fixtures) {
                    if (Objects.equals(retrievedFixture.getId(), fixture.getId())) {
                        retrievedFixture.setHomeScore(gameStatusAndScore.getHomeScore());
                        retrievedFixture.setAwayScore(gameStatusAndScore.getAwayScore());
                        retrievedFixture.setStatus(GameStatus.FINISHED);
                    }
                }
                redisFixtureTemplate.delete("fixtures");
                fixtures.forEach(fix -> redisFixtureTemplate.opsForList().rightPush("fixtures",fix));

                // Save match to DB
                log.info("Saving match to DB...");
                MatchEntity matchEntity = MatchEntity.builder()
                        .matchId(fixture.getId())
                        .gameweek(fixture.getGameweek())
                        .homeScore(gameStatusAndScore.getHomeScore())
                        .awayScore(gameStatusAndScore.getAwayScore())
                        .homeTeam(fixture.getHomeTeam())
                        .awayTeam(fixture.getAwayTeam())
                        .homeScorers(scorers.homeScorers())
                        .awayScorers(scorers.awayScorers())
                        .venue(fixture.getVenue())
                        .build();
                matchEntity = matchRepository.saveAndFlush(matchEntity);

                // Update user scores and shii
                log.info("Updating database...");
                try {
                    predictionService.updateDatabaseAfterGame(matchEntity);
                } catch (Exception e) {
                    log.error("Error in updating database", e);
                }

                // Increment current Matchday if appropriate
                log.info("Checking current Matchday incrementing...");
                boolean isLastFixture = fixtures.stream()
                        .noneMatch(f -> f.getDate().isAfter(fixture.getDate())
                                // tie-breaker by ID
                        || ((f.getDate().isEqual(fixture.getDate())) && f.getId() > fixture.getId()));
                if (isLastFixture) {
                    int newMatchday = matchdayService.getCurrentMatchday() + 1;
                    matchdayService.setCurrentMatchday(newMatchday);
                    chipService.updateAllGameweekCooldowns();
                    apiService.updateFixtures();
                }

                // End the scheduler
                log.info("Ending scheduler for fixture {}", fixture.getId());
                pollingTask[0].cancel(false);
            }
            else if (gameStatusAndScore.getGameStatus() == GameStatus.LIVE) {
                // Update score
                List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                while (fixtures == null) {
                    fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                }

                for (Fixture retrievedFixture : fixtures) {
                    if (Objects.equals(retrievedFixture.getId(), fixture.getId())) {
                        retrievedFixture.setHomeScore(gameStatusAndScore.getHomeScore());
                        retrievedFixture.setAwayScore(gameStatusAndScore.getAwayScore());
                    }
                }
                redisFixtureTemplate.delete("fixtures");
                fixtures.forEach(f -> redisFixtureTemplate.opsForList().rightPush("fixtures",f));
            }
        }, 0, 5, TimeUnit.MINUTES);
    }
}
