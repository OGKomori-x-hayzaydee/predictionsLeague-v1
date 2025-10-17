package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class APIService {
    @Value("${app.squad-list-base-url}")
    private String squadListBaseUrl;
    @Value("${app.competition-base-url}")
    private String competitionBaseUrl;
    @Value("${app.fixture-list-base-url}")
    private String fixtureListBaseUrl;
    @Value("${app.fixture-base-url}")
    private String fixtureBaseUrl;
    private final HttpHeaders firstApiHeaders;
    private final HttpHeaders secondApiHeaders;
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final FixtureSchedulerService fixtureSchedulerService;

    public void updateUpcomingFixtures() {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalFixtureResponse> responseEntity = restTemplate.exchange(
                fixtureListBaseUrl + FixtureDetails.currentMatchday,
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse.class
        );

        ExternalFixtureResponse response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching API data for fixtures.");
        }

        List<Fixture> fixtures = response.getMatches().stream().map(Fixture::new).toList();
        redisFixtureTemplate.delete("fixtures");
        for (Fixture fixture : fixtures) {
            if (FixtureDetails.BIG_SIX_TEAMS.contains(fixture.getHomeTeam()) || FixtureDetails.BIG_SIX_TEAMS.contains(fixture.getAwayTeam())) {
                redisFixtureTemplate.opsForList().rightPush("fixtures", fixture);
            }
        }

        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    public void setCurrentMatchday() {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalCompetitionResponse> responseEntity = restTemplate.exchange(
                competitionBaseUrl + "PL",
                HttpMethod.GET,
                httpEntity,
                ExternalCompetitionResponse.class
        );

        ExternalCompetitionResponse response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error setting current matchday");
        }

        FixtureDetails.currentMatchday = response.getCurrentSeason().getCurrentMatchday();
    }

    public void loadMissingPlayers() {
        for (int currentTeam : FixtureDetails.TEAM_IDS.values()) {
            String redisKey = "team:" + currentTeam + ":players";
            if (!redisPlayerTemplate.hasKey(redisKey)) {
                try {
                    HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
                    ResponseEntity<ExternalTeamResponse> responseEntity = restTemplate.exchange(
                            squadListBaseUrl + currentTeam,
                            HttpMethod.GET,
                            httpEntity,
                            ExternalTeamResponse.class
                    );

                    ExternalTeamResponse response = responseEntity.getBody();
                    if (response == null || responseEntity.getStatusCode().isError()) {
                        throw new RuntimeException("Error fetching API data for team " + currentTeam);
                    }

                    for (ExternalTeamResponse.Squad.Player player : response.getResponse().getFirst().getPlayers()) {
                        if (!player.getPosition().contains("keeper")) {
                            redisPlayerTemplate.opsForList().rightPush(redisKey, new Player(player));
                        }
                    }

                    Thread.sleep(10000);
                } catch (Exception e) {
                    throw new RuntimeException("Error in retrieving teams: ", e);
                }
            }
        }
    }

    public String getGameStatus(Fixture fixture) {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalFixtureResponse.Match> responseEntity = restTemplate.exchange(
                fixtureBaseUrl + fixture.getId(),
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse.Match.class
        );

        ExternalFixtureResponse.Match response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error checking match status for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        return response.getStatus();
    }
}
