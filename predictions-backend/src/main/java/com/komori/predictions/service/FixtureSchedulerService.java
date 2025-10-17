package com.komori.predictions.service;

import com.komori.predictions.dto.response.Fixture;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class FixtureSchedulerService {
    private final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final APIService apiService;

    public void scheduleFixturesForTheDay() {
        List<Fixture> fixtures = getFixturesForTheDay();
        if (!fixtures.isEmpty()) {
            for (Fixture fixture : fixtures) {
                long delayMillis = Duration.between(LocalDateTime.now(), fixture.getDate()).toMillis();
                if (delayMillis < 0) continue;

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
            String status = apiService.getGameStatus(fixture);
            if (status.equalsIgnoreCase("IN_PLAY")) {
                startGoalPolling(fixture);
                watcherHolder[0].cancel(false);
            }
        }, 0, 1, TimeUnit.MINUTES);
    }

    private void startGoalPolling(Fixture fixture) {
        final ScheduledFuture<?>[] pollingTask = new ScheduledFuture<?>[1];

        scheduledExecutorService.scheduleAtFixedRate(() -> {

        }, 0, 2, TimeUnit.MINUTES);
    }
}
