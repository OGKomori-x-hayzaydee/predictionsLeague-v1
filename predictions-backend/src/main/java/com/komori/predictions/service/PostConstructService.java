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

    @PostConstruct
    public void updateUpcomingFixturesOnStartup() {
        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixturesDaily() {
        apiService.updateUpcomingFixtures();
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @PostConstruct
    public void setCurrentMatchdayOnStartup() {
        log.info("Setting current matchday...");
        apiService.setCurrentMatchday();
    }

    @PostConstruct
    public void loadPlayersOnStartup() {
        new Thread(apiService::loadMissingPlayers).start();
    }
}
