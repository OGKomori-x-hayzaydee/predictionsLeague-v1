package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.*;
import com.komori.predictions.dto.response.api1.ExternalCompetitionResponse;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.dto.response.api2.ExternalEventsResponse;
import com.komori.predictions.dto.response.api2.ExternalFixtureResponse2;
import com.komori.predictions.dto.response.api2.ExternalTeamResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    @Value("${app.events-base-url}")
    private String eventsBaseUrl;
    @Value("${app.live-fixture-base-url}")
    private String liveFixtureBaseUrl;
    private final HttpHeaders firstApiHeaders;
    private final HttpHeaders secondApiHeaders;
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;

    public void updateUpcomingFixtures() {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalFixtureResponse1> responseEntity = restTemplate.exchange(
                fixtureListBaseUrl + FixtureDetails.currentMatchday,
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse1.class
        );

        ExternalFixtureResponse1 response = responseEntity.getBody();
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

    public ExternalFixtureResponse1.Match getGameStatus(Fixture fixture) {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalFixtureResponse1.Match> responseEntity = restTemplate.exchange(
                fixtureBaseUrl + fixture.getId(),
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse1.Match.class
        );

        ExternalFixtureResponse1.Match response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error checking match status for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        return response;
    }

    public Long getSecondFixtureId(Fixture fixture) {
        HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
        ResponseEntity<ExternalFixtureResponse2> responseEntity = restTemplate.exchange(
                liveFixtureBaseUrl + 39,
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse2.class
        );

        ExternalFixtureResponse2 response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error getting secondFixtureId for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        if (response.getResponse().isEmpty()) {
            return -1L;
        }

        for (ExternalFixtureResponse2.FixtureDetails fixtureDetails : response.getResponse()) {
            Integer storedHomeId = FixtureDetails.TEAM_IDS.get(fixture.getHomeTeam());
            Integer retrievedHomeId = fixtureDetails.getTeams().getHomeTeam().getId();
            if (Objects.equals(storedHomeId, retrievedHomeId)) return fixtureDetails.getFixture().getId();
        }

        return -1L;
    }

    public HomeAndAwayScorers getGoalScorers(Fixture fixture, Long fixtureId) {
        HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
        ResponseEntity<ExternalEventsResponse> responseEntity = restTemplate.exchange(
                eventsBaseUrl + fixtureId,
                HttpMethod.GET,
                httpEntity,
                ExternalEventsResponse.class
        );

        ExternalEventsResponse response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error getting goal scorers for fixture " + fixtureId);
        }

        List<String> homeScorers = new ArrayList<>();
        List<String> awayScorers = new ArrayList<>();

        for (ExternalEventsResponse.Goal goal : response.getResponse()) {
            if (Objects.equals(goal.getTeam().getId(), FixtureDetails.TEAM_IDS.get(fixture.getHomeTeam()))) {
                homeScorers.add(goal.getPlayer().getName());
            } else {
                awayScorers.add(goal.getPlayer().getName());
            }
        }

        return new HomeAndAwayScorers(homeScorers, awayScorers);
    }
}
