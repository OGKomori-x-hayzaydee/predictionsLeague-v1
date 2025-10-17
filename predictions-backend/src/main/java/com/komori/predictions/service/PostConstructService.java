package com.komori.predictions.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostConstructService {
    private final APIService apiService;

    @PostConstruct
    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixturesOnStartup() {
        apiService.updateUpcomingFixtures();
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
