package com.komori.predictions.service;

import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.*;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.dto.response.api2.FixtureDetails;
import com.komori.predictions.entity.TeamEntity;
import com.komori.predictions.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
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
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class APIService {
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
    private final TeamRepository teamRepository;
    private final MatchdayService matchdayService;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;

    public void updateUpcomingFixtures() {
        HttpEntity<Void> httpEntity = new HttpEntity<>(firstApiHeaders);
        ResponseEntity<ExternalFixtureResponse1> responseEntity = restTemplate.exchange(
                fixtureListBaseUrl + matchdayService.getCurrentMatchday(),
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse1.class
        );

        ExternalFixtureResponse1 response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching API data for fixtures.");
        }

        List<ExternalFixtureResponse1.Match> matchList = response.getMatches();
        List<Fixture> newFixtures = matchList.stream()
                .map(match -> {
                    TeamEntity home = teamRepository.findByName(match.getHomeTeam().getShortName());
                    TeamEntity away = teamRepository.findByName(match.getAwayTeam().getShortName());
                    if (home.getIsBigSixTeam() || away.getIsBigSixTeam()) {
                        return new Fixture(match, home, away);
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();

        List<Fixture> existingFixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);

        if (!newFixtures.equals(existingFixtures)) {
            redisFixtureTemplate.delete("fixtures");
            redisFixtureTemplate.opsForList().rightPushAll("fixtures", newFixtures);
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

    public void addSecondFixtureIds(List<Fixture> fixtures) {
        LocalDate today = LocalDate.now();
        String date = today.toString();

        ResponseEntity<List<FixtureDetails>> responseEntity = restTemplate.exchange(
                externalFixtureBaseUrl + date + "&to=" + date + "&league_id=152&APIkey=" + secondApiKey,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        List<FixtureDetails> response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.isEmpty()) {
            throw new RuntimeException("Error getting second fixture IDs");
        }

        fixtures.forEach(fixture -> {
            int homeId = fixture.getHomeId();
            int awayId = fixture.getAwayId();

            for (FixtureDetails details : response) {
                if (details.getMatchHometeamId() == homeId && details.getMatchAwayteamId() == awayId) {
                    fixture.setExternalFixtureId(details.getMatchId());
                    break;
                }
            }
        });
    }

    public HomeAndAwayScorers getGoalScorers(Fixture fixture) {
        String date = fixture.getDate().toLocalDate().toString();

        ResponseEntity<List<FixtureDetails>> responseEntity = restTemplate.exchange(
                externalFixtureBaseUrl + date + "&to=" + date + "&match_id=" + fixture.getExternalFixtureId() + "&APIkey=" + secondApiKey,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        List<FixtureDetails> response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.isEmpty()) {
            throw new RuntimeException("Error getting goalscorers for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        FixtureDetails fixtureDetails = response.getFirst();
        List<String> homeScorers = new ArrayList<>();
        List<String> awayScorers = new ArrayList<>();

        for (FixtureDetails.Goalscorer goalscorer : fixtureDetails.getGoalscorer()) {
            if (goalscorer.getHomeScorer().isEmpty()) {
                awayScorers.add(goalscorer.getAwayScorer());
            } else {
                homeScorers.add(goalscorer.getHomeScorer());
            }
        }

        return new HomeAndAwayScorers(homeScorers, awayScorers);
    }
}
