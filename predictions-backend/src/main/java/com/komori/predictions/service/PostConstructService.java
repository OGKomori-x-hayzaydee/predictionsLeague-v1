package com.komori.predictions.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostConstructService {
    private final APIService apiService;
    private final FixtureSchedulerService fixtureSchedulerService;

    @PostConstruct
    public void updateUpcomingFixturesOnStartup() {
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
        apiService.setCurrentMatchday();
    }

    @PostConstruct
    public void loadPlayersOnStartup() {
        new Thread(apiService::loadMissingPlayers).start();
    }
}
