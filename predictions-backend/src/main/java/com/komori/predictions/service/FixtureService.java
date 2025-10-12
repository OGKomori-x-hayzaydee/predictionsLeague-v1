package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.response.ExternalFixtureResponse;
import com.komori.predictions.dto.response.Fixture;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixtureService {
    @Value("${app.fixture-api-key}")
    private String apiKey;
    @Value("${app.fixture-base-url}")
    private String fixtureBaseUrl;
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Fixture> redisTemplate;

    @PostConstruct
    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixtures() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token", apiKey);
        HttpEntity<Void> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<ExternalFixtureResponse> responseEntity = restTemplate.exchange(
                fixtureBaseUrl + FixtureDetails.currentMatchday,
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse.class
        );

        ExternalFixtureResponse response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching API data for fixtures.");
        }

        List<Fixture> fixtures = response.getMatches().stream().map(Fixture::new).toList();
        for (Fixture fixture : fixtures) {
            redisTemplate.opsForList().rightPush("fixtures", fixture);
        }
    }

    public List<Fixture> getFixtures() {
        List<Fixture> fixtures = redisTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtures == null) {
            throw new RuntimeException("Failed to fetch data from Redis");
        }
        List<Fixture> filteredFixtures = new ArrayList<>();
        for (Fixture fixture : fixtures) {
            if (FixtureDetails.BIG_SIX_TEAMS.contains(fixture.getHomeTeam()) || FixtureDetails.BIG_SIX_TEAMS.contains(fixture.getAwayTeam())) {
                filteredFixtures.add(fixture);
            }
        }

        return filteredFixtures;
    }
}
