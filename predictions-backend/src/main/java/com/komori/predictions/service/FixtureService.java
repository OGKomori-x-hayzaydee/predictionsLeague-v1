package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.response.ExternalFixtureResponse;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class FixtureService {
    @Value("${app.fixture-list-base-url}")
    private String fixtureListBaseUrl;
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final HttpHeaders firstApiHeaders;

    @PostConstruct
    @Scheduled(cron = "0 0 0 * * *")
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
    }

    public List<Fixture> getFixtures() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtures == null) {
            throw new RuntimeException("Failed to fetch data from Redis");
        }

        fixtures.forEach(fixture -> {
            List<Player> homePlayers = redisPlayerTemplate.opsForList().range("team:" + FixtureDetails.TEAM_IDS.get(fixture.getHomeTeam()) + ":players", 0, -1);
            List<Player> awayPlayers = redisPlayerTemplate.opsForList().range("team:" + FixtureDetails.TEAM_IDS.get(fixture.getAwayTeam()) + ":players", 0, -1);
            fixture.setHomePlayers(homePlayers);
            fixture.setAwayPlayers(awayPlayers);
        });

        return fixtures;
    }
}
