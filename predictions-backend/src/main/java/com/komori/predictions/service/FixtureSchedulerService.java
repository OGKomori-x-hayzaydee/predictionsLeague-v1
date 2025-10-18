package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.entity.MatchEntity;
import com.komori.predictions.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
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

    public void scheduleFixturesForTheDay() {
        List<Fixture> fixtures = getFixturesForTheDay();
        if (!fixtures.isEmpty()) {
            for (Fixture fixture : fixtures) {
                Instant fixtureInstant = fixture.getDate().toInstant();
                long delayMillis = Duration.between(Instant.now(), fixtureInstant).toMillis();
                if (delayMillis < 0) continue;

                log.info("Scheduled {} vs {} at {}.", fixture.getHomeTeam(), fixture.getAwayTeam(), fixture.getDate());
                scheduledExecutorService.schedule(() -> watchFixture(fixture), delayMillis, TimeUnit.MILLISECONDS);
            }
        }
    }

    private List<Fixture> getFixturesForTheDay() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        while (fixtures == null) {
            fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
        }

        ZoneId zoneId = ZoneId.of("UTC");
        LocalDate today = LocalDate.now(zoneId);

        return fixtures.stream()
                .filter(fixture -> fixture.getDate().atZoneSameInstant(zoneId).toLocalDate().isEqual(today))
                .toList();
    }

    private void watchFixture(Fixture fixture) {
        final ScheduledFuture<?>[] watcherHolder = new ScheduledFuture<?>[1];

        watcherHolder[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            ExternalFixtureResponse1.Match currentMatch = apiService.getGameStatus(fixture);
            if (currentMatch.getStatus().equalsIgnoreCase("IN_PLAY")) {
                log.info("Match is now live! Fetching second fixture ID...");
                Long secondFixtureId = apiService.getSecondFixtureId(fixture);
                if (secondFixtureId == -1) {
                    log.info("Second fixture ID not found for {}, skipping this iteration", fixture.getId());
                    return;
                }
                startGoalPolling(fixture, secondFixtureId);

                watcherHolder[0].cancel(false);
            }
        }, 0, 1, TimeUnit.MINUTES);
    }

    private void startGoalPolling(Fixture fixture, Long secondFixtureId) {
        log.info("Starting goal polling for fixture {}", fixture.getId());
        final ScheduledFuture<?>[] pollingTask = new ScheduledFuture<?>[1];

        pollingTask[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            ExternalFixtureResponse1.Match currentMatch = apiService.getGameStatus(fixture);
            if (currentMatch.getStatus().equalsIgnoreCase("FINISHED")) {
                // Update Redis cache
                log.info("Updating Redis cache...");
                List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                while (fixtures == null) {
                    fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                }

                for (Fixture retrievedFixture : fixtures) {
                    if (Objects.equals(retrievedFixture.getId(), fixture.getId())) {
                        retrievedFixture.setHomeScore(currentMatch.getScore().getFullTime().getHome());
                        retrievedFixture.setAwayScore(currentMatch.getScore().getFullTime().getAway());
                        retrievedFixture.setStatus("FINISHED");
                    }
                }
                redisFixtureTemplate.delete("fixtures");
                fixtures.forEach(f -> redisFixtureTemplate.opsForList().rightPush("fixtures",f));

                // Retrieve goalscorers
                log.info("Retrieving goalscorers...");
                HomeAndAwayScorers scorers = apiService.getGoalScorers(fixture, secondFixtureId);

                // Save match to DB
                log.info("Saving match to DB...");
                MatchEntity matchEntity = MatchEntity.builder()
                        .matchId(secondFixtureId)
                        .oldFixtureId(fixture.getId())
                        .homeScore(currentMatch.getScore().getFullTime().getHome())
                        .awayScore(currentMatch.getScore().getFullTime().getAway())
                        .homeTeam(fixture.getHomeTeam())
                        .awayTeam(fixture.getAwayTeam())
                        .homeScorers(scorers.homeScorers())
                        .awayScorers(scorers.awayScorers())
                        .build();
                matchEntity = matchRepository.saveAndFlush(matchEntity);

                // Update user scores and shii
                log.info("Updating database...");
                predictionService.updateDatabaseAfterGame(matchEntity);

                // Increment current Matchday if appropriate
                log.info("Checking current Matchday incrementing...");
                boolean allFinished = fixtures.stream()
                        .allMatch(f -> f.getStatus().equalsIgnoreCase("FINISHED"));
                if (allFinished) FixtureDetails.currentMatchday++;
                chipService.updateAllGameweekCooldowns();

                // End the scheduler
                log.info("Ending scheduler!");
                pollingTask[0].cancel(false);
            }
            else if (currentMatch.getStatus().equalsIgnoreCase("IN_PLAY")) {
                // Update score
                log.info("Updating live score in redis...");
                List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                while (fixtures == null) {
                    fixtures = redisFixtureTemplate.opsForList().range("fixtures",0,-1);
                }

                for (Fixture retrievedFixture : fixtures) {
                    if (Objects.equals(retrievedFixture.getId(), fixture.getId())) {
                        retrievedFixture.setHomeScore(currentMatch.getScore().getHalfTime().getHome());
                        retrievedFixture.setAwayScore(currentMatch.getScore().getHalfTime().getAway());
                    }
                }
                redisFixtureTemplate.delete("fixtures");
                fixtures.forEach(f -> redisFixtureTemplate.opsForList().rightPush("fixtures",f));
            } else {
                log.info("IN_PLAY and FINISHED statuses not identified. Waiting for next iteration...");
            }
        }, 0, 3, TimeUnit.MINUTES);
    }
}
