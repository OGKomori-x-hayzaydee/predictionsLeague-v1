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
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixtureSchedulerService {
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final APIService apiService;
    private final PredictionService predictionService;
    private final MatchRepository matchRepository;
    private final ChipService chipService;
    private final MatchdayService matchdayService;
    private final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);
    private final Map<Long, ScheduledFuture<?>> activePollers = new ConcurrentHashMap<>();

    public void scheduleFixturesForTheDay() {
        List<Fixture> fixtures = getFixturesForTheDay();
        if (!fixtures.isEmpty()) {
            Map<Long, GameStatusAndScore> statusMap = apiService.getGamesStatus();

            for (Fixture fixture : fixtures) {
                GameStatusAndScore status = statusMap.get(fixture.getId());
                if (status == null) continue;

                switch (status.getGameStatus()) {
                    case LIVE:
                        if (!activePollers.containsKey(fixture.getId())) {
                            startGoalPolling(fixture);
                        }
                        break;
                    case TIMED:
                        long delayMillis = Duration.between(Instant.now(), fixture.getDate().toInstant()).toMillis();
                        if (delayMillis > 0 && !activePollers.containsKey(fixture.getId())) {
                            scheduledExecutorService.schedule(() -> waitForFixtureToStart(fixture), delayMillis, TimeUnit.MILLISECONDS);
                            log.info("Scheduled {} vs {} at {}.", fixture.getHomeTeam(), fixture.getAwayTeam(), fixture.getDate());
                        }
                        break;
                    default:
                        break;
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
        if (activePollers.containsKey(fixture.getId())) return;

        ScheduledFuture<?> watcher = scheduledExecutorService.scheduleAtFixedRate(() -> {
            Map<Long, GameStatusAndScore> statusMap = apiService.getGamesStatus();
            if (statusMap.get(fixture.getId()).getGameStatus() == GameStatus.LIVE) {
                log.info("{} vs {} is now live!", fixture.getHomeTeam(), fixture.getAwayTeam());
                startGoalPolling(fixture);

                ScheduledFuture<?> future = activePollers.remove(fixture.getId());
                if (future != null) future.cancel(false);
            }
        }, 0, 2, TimeUnit.MINUTES);

        activePollers.put(fixture.getId(), watcher);
    }

    private void startGoalPolling(Fixture fixture) {
        if (activePollers.containsKey(fixture.getId())) {
            log.info("Polling already started for {} vs {}", fixture.getHomeTeam(), fixture.getAwayTeam());
            return;
        }

        log.info("Starting goal polling for fixture {} vs {}", fixture.getHomeTeam(), fixture.getAwayTeam());
        final ScheduledFuture<?>[] pollingTask = new ScheduledFuture<?>[1];

        pollingTask[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            GameStatusAndScore gameStatusAndScore = apiService.getGamesStatus().get(fixture.getId());
            if (gameStatusAndScore.getGameStatus() == GameStatus.FINISHED) {
                // Retrieve goalscorers
                log.info("Retrieving goalscorers...");
                HomeAndAwayScorers scorers = apiService.getGoalScorers(fixture.getId());

                // Update Redis cache
                updateFixtureInRedis(fixture, gameStatusAndScore);

                // Save match to DB
                MatchEntity matchEntity = saveMatchToDB(fixture, gameStatusAndScore, scorers);

                // Update user scores and shii
                log.info("Updating database...");
                try {
                    predictionService.updateDatabaseAfterGame(matchEntity);
                } catch (Exception e) {
                    log.error("Error in updating database", e);
                }

                // Increment current Matchday if appropriate
                incrementMatchdayIfLastFixture(fixture);

                // End the scheduler
                log.info("Ending scheduler for fixture {}", fixture.getId());
                pollingTask[0].cancel(false);
            }
            else if (gameStatusAndScore.getGameStatus() == GameStatus.LIVE) {
                updateFixtureInRedis(fixture, gameStatusAndScore);
            }
        }, 0, 5, TimeUnit.MINUTES);
    }

    private void updateFixtureInRedis(Fixture fixture, GameStatusAndScore gameStatusAndScore) {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        if (fixtures == null) {
            log.warn("Fixtures list not found in redis. Fetching latest fixtures...");
            apiService.updateFixtures();
            return;
        }

        Fixture stored = fixtures.stream()
                .filter(f -> f.getId().equals(fixture.getId()))
                .findFirst()
                .orElse(fixture);

        stored.setHomeScore(gameStatusAndScore.getHomeScore());
        stored.setAwayScore(gameStatusAndScore.getAwayScore());
        stored.setStatus(gameStatusAndScore.getGameStatus());

        // Update only this fixture
        redisFixtureTemplate.opsForList().remove("fixtures", 1, stored);
        redisFixtureTemplate.opsForList().rightPush("fixtures", stored);
    }

    private MatchEntity saveMatchToDB(Fixture fixture, GameStatusAndScore gameStatusAndScore, HomeAndAwayScorers scorers) {
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
       return matchRepository.saveAndFlush(matchEntity);
    }

    private void incrementMatchdayIfLastFixture(Fixture fixture) {
        log.info("Checking current Matchday incrementing...");
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        if (fixtures == null) {
            log.warn("Fixtures list not found in redis. Fetching latest fixtures...");
            apiService.updateFixtures();
            return;
        }

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
    }
}
