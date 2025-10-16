package com.komori.predictions.config;

import com.komori.predictions.dto.response.ExternalFixtureResponse;
import com.komori.predictions.dto.response.ExternalTeamResponse;
import com.komori.predictions.dto.response.Player;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class FixtureDetails {
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    @Value("${app.fixture-api-key}")
    private String apiKey;
    @Value("${app.team-base-url}")
    private String teamBaseUrl;
    private final RestTemplate restTemplate;
    public static int currentMatchday;
    public static final Set<String> BIG_SIX_TEAMS = Set.of(
            "Man City",
            "Man United",
            "Liverpool",
            "Tottenham",
            "Arsenal",
            "Chelsea"
    );
    public static final Map<String, String> VENUES = Map.ofEntries(
            Map.entry("LIV","Anfield"),
            Map.entry("BOU","Vitality Stadium"),
            Map.entry("AVL","Villa Park"),
            Map.entry("NEW","St James' Park"),
            Map.entry("BHA","Amex Stadium"),
            Map.entry("FUL","Craven Cottage"),
            Map.entry("SUN","Stadium of Light"),
            Map.entry("WHU","London Stadium"),
            Map.entry("TOT","Tottenham Hotspur Stadium"),
            Map.entry("BUR","Turf Moor"),
            Map.entry("WOL","Molineux Stadium"),
            Map.entry("MCI","Etihad Stadium"),
            Map.entry("NOT","The City Ground"),
            Map.entry("BRE","Gtech Community Stadium"),
            Map.entry("CHE","Stamford Bridge"),
            Map.entry("CRY","Selhurst Park"),
            Map.entry("MUN","Old Trafford"),
            Map.entry("ARS","Emirates Stadium"),
            Map.entry("LEE","Elland Road"),
            Map.entry("EVE","Hill Dickinson Stadium")
    );
    public static final Map<Integer, String> TEAM_IDS = Map.ofEntries(
            Map.entry(64, "Liverpool"),
            Map.entry(1044, "Bournemouth"),
            Map.entry(58, "Aston Villa"),
            Map.entry(67, "Newcastle"),
            Map.entry(397, "Brighton Hove"),
            Map.entry(63, "Fulham"),
            Map.entry(71, "Sunderland"),
            Map.entry(563, "West Ham"),
            Map.entry(73, "Tottenham"),
            Map.entry(328, "Burnley"),
            Map.entry(76, "Wolverhampton"),
            Map.entry(65, "Man City"),
            Map.entry(351, "Nottingham"),
            Map.entry(402, "Brentford"),
            Map.entry(61, "Chelsea"),
            Map.entry(354, "Crystal Palace"),
            Map.entry(66, "Man United"),
            Map.entry(57, "Arsenal")
    );

    @PostConstruct
    public void setCurrentMatchday() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token", apiKey);
        HttpEntity<Void> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<ExternalFixtureResponse> responseEntity = restTemplate.exchange(
                "https://api.football-data.org/v4/teams/66/matches?status=SCHEDULED&limit=1&competitions=PL",
                HttpMethod.GET,
                httpEntity,
                ExternalFixtureResponse.class
        );

        ExternalFixtureResponse response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching API data for matchday.");
        }

        currentMatchday = response.getMatches().getFirst().getMatchday();
    }

    @PostConstruct
    public void loadPlayers() {
        new Thread(this::loadMissingPlayers).start();
    }

    private void loadMissingPlayers() {
        for (int currentTeam : TEAM_IDS.keySet()) {
            String redisKey = "team:" + currentTeam + ":players";
            if (!redisPlayerTemplate.hasKey(redisKey)) {
                try {
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("X-Auth-Token", apiKey);
                    HttpEntity<Void> httpEntity = new HttpEntity<>(headers);
                    ResponseEntity<ExternalTeamResponse> responseEntity = restTemplate.exchange(
                            teamBaseUrl + currentTeam,
                            HttpMethod.GET,
                            httpEntity,
                            ExternalTeamResponse.class
                    );

                    ExternalTeamResponse response = responseEntity.getBody();
                    if (response == null || responseEntity.getStatusCode().isError()) {
                        throw new RuntimeException("Error fetching API data for team " + TEAM_IDS.get(currentTeam));
                    }

                    for (ExternalTeamResponse.ExternalPlayer player : response.getSquad()) {
                        redisPlayerTemplate.opsForList().rightPush(redisKey, new Player(player));
                    }

                    Thread.sleep(4000);
                } catch (Exception e) {
                    throw new RuntimeException("Error in retrieving teams: ", e);
                }
            }
        }
    }
}
