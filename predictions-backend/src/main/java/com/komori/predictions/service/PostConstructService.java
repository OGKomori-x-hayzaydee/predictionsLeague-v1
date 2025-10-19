package com.komori.predictions.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        log.info("Setting current matchday...");
        apiService.setCurrentMatchday();
        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @PostConstruct
    public void setCurrentMatchdayOnStartup() {
        log.info("Setting current matchday...");
        apiService.setCurrentMatchday();
        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @PostConstruct
    public void loadPlayersOnStartup() {
        new Thread(apiService::loadMissingPlayers).start();
    }
}
