package com.komori.predictions.service;

import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.entity.MatchEntity;
import com.komori.predictions.repository.MatchRepository;
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
    private final PredictionService predictionService;
    private final MatchRepository matchRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixturesDaily() {
        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void scheduleFixturesForTheDayOnStartup() {
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();

        // Testing the getGoalscorers method for the Arsenal vs Sunderland game
        Fixture fixture = Fixture.builder()
                .id(538034)
                .externalFixtureId(4452654L)
                .gameweek(25)
                .homeId(15)
                .awayId(106)
                .homeTeam("Wolverhampton")
                .awayTeam("Chelsea")
                .venue("Molineux Stadium")
                .build();

        log.info("Retrieving goalscorers...");
        HomeAndAwayScorers scorers = apiService.getGoalScorers(fixture);

        // Save match to DB
        log.info("Saving match to DB...");
        MatchEntity matchEntity = MatchEntity.builder()
                .matchId(fixture.getExternalFixtureId())
                .oldFixtureId(fixture.getId().longValue())
                .gameweek(fixture.getGameweek())
                .homeScore(1)
                .awayScore(3)
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
    }
}
