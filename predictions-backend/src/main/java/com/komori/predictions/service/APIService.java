package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.*;
import com.komori.predictions.dto.response.api1.ExternalCompetitionResponse;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.dto.response.api2.ExternalFixtureResponse2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class APIService {
    @Value("${app.competition-base-url}")
    private String competitionBaseUrl;
    @Value("${app.fixture-list-base-url}")
    private String fixtureListBaseUrl;
    @Value("${app.fixture-base-url}")
    private String fixtureBaseUrl;
    @Value("${app.external-fixture-base-url}")
    private String externalFixtureBaseUrl;
    @Value("${app.second-api-key}")
    private String secondApiKey;
    private final HttpHeaders firstApiHeaders;
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final RedisTemplate<String, Object> redisGeneralTemplate;

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

        Integer matchday = response.getCurrentSeason().getCurrentMatchday();
        FixtureDetails.currentMatchday = matchday;
        redisGeneralTemplate.opsForValue().set("currentMatchday", matchday);
        log.info("Set current matchday to GW{}", FixtureDetails.currentMatchday);
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

    public List<Fixture> addSecondFixtureIds(List<Fixture> fixtures) {
        LocalDate today = LocalDate.now();
        String date = today.toString();

        ResponseEntity<ExternalFixtureResponse2> responseEntity = restTemplate.exchange(
                externalFixtureBaseUrl + date + "&to=" + date + "&league_id=152&APIkey=" + secondApiKey,
                HttpMethod.GET,
                null,
                ExternalFixtureResponse2.class
        );

        ExternalFixtureResponse2 response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.getDetails().isEmpty()) {
            throw new RuntimeException("Error getting second fixture IDs");
        }

        fixtures.forEach(fixture -> {
            int homeId = fixture.getHomeId();
            int awayId = fixture.getAwayId();

            for (ExternalFixtureResponse2.FixtureDetails details : response.getDetails()) {
                if (details.getMatchHometeamId() == homeId && details.getMatchAwayteamId() == awayId) {
                    fixture.setExternalFixtureId(details.getMatchId());
                    break;
                }
            }
        });

        return fixtures;
    }

    public HomeAndAwayScorers getGoalScorers(Fixture fixture) {
        String date = fixture.getDate().toLocalDate().toString();

        ResponseEntity<ExternalFixtureResponse2> responseEntity = restTemplate.exchange(
                externalFixtureBaseUrl + date + "&to=" + date + "&match_id=" + fixture.getExternalFixtureId() + "&APIkey=" + secondApiKey,
                HttpMethod.GET,
                null,
                ExternalFixtureResponse2.class
        );

        ExternalFixtureResponse2 response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.getDetails().isEmpty()) {
            throw new RuntimeException("Error getting goalscorers for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        ExternalFixtureResponse2.FixtureDetails fixtureDetails = response.getDetails().getFirst();
        List<String> homeScorers = new ArrayList<>();
        List<String> awayScorers = new ArrayList<>();

        for (ExternalFixtureResponse2.FixtureDetails.Goalscorer goalscorer : fixtureDetails.getGoalscorer()) {
            if (goalscorer.getHomeScorer().isEmpty()) {
                awayScorers.add(goalscorer.getAwayScorer());
            } else {
                homeScorers.add(goalscorer.getHomeScorer());
            }
        }

        return new HomeAndAwayScorers(homeScorers, awayScorers);
    }
}
