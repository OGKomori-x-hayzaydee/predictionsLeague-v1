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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
                long delayMillis = Duration.between(LocalDateTime.now(), fixture.getDate()).toMillis();
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

        LocalDate today = LocalDate.now();
        return fixtures.stream()
                .filter(fixture -> fixture.getDate().isEqual(today.atStartOfDay()))
                .toList();
    }

    private void watchFixture(Fixture fixture) {
        final ScheduledFuture<?>[] watcherHolder = new ScheduledFuture<?>[1];

        watcherHolder[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            ExternalFixtureResponse1.Match currentMatch = apiService.getGameStatus(fixture);
            if (currentMatch.getStatus().equalsIgnoreCase("IN_PLAY")) {
                Long secondFixtureId = apiService.getSecondFixtureId(fixture);
                if (secondFixtureId == -1) {
                    return;
                }
                startGoalPolling(fixture, secondFixtureId);

                watcherHolder[0].cancel(false);
            }
        }, 0, 1, TimeUnit.MINUTES);
    }

    private void startGoalPolling(Fixture fixture, Long secondFixtureId) {
        final ScheduledFuture<?>[] pollingTask = new ScheduledFuture<?>[1];

        pollingTask[0] = scheduledExecutorService.scheduleAtFixedRate(() -> {
            ExternalFixtureResponse1.Match currentMatch = apiService.getGameStatus(fixture);
            if (currentMatch.getStatus().equalsIgnoreCase("FINISHED")) {
                // Update Redis cache
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
                fixtures.forEach(f -> redisFixtureTemplate.opsForList().rightPush("fixture",f));

                // Retrieve goalscorers
                HomeAndAwayScorers scorers = apiService.getGoalScorers(fixture, secondFixtureId);

                // Save match to DB
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
                predictionService.updateDatabaseAfterGame(matchEntity);

                // Increment current Matchday if appropriate
                boolean allFinished = fixtures.stream()
                        .allMatch(f -> f.getStatus().equalsIgnoreCase("FINISHED"));
                if (allFinished) FixtureDetails.currentMatchday++;
                chipService.updateAllGameweekCooldowns();

                // End the scheduler
                pollingTask[0].cancel(false);
            }
            else if (currentMatch.getStatus().equalsIgnoreCase("PAUSED")) {
                // Update halftime score
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
                fixtures.forEach(f -> redisFixtureTemplate.opsForList().rightPush("fixture",f));
            }
        }, 0, 3, TimeUnit.MINUTES);
    }
}
