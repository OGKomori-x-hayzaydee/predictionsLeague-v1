package com.komori.predictions.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostConstructService {
    private final APIService apiService;
    private final FixtureSchedulerService fixtureSchedulerService;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixturesDaily() {
        log.info("Updating fixtures...");
        apiService.updateFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void scheduleFixturesForTheDayOnStartup() {
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }
}
