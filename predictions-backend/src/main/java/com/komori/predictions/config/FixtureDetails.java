package com.komori.predictions.config;

import com.komori.predictions.dto.response.ExternalCompetitionResponse;
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
    @Value("${app.squad-list-base-url}")
    private String squadListBaseUrl;
    @Value("${app.competition-base-url}")
    private String competitionBaseUrl;
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final HttpHeaders secondApiHeaders;
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
    public static final Map<String, Integer> TEAM_IDS = Map.ofEntries(
            Map.entry("Liverpool", 40),
            Map.entry("Bournemouth", 35),
            Map.entry("Aston Villa", 66),
            Map.entry("Newcastle", 34),
            Map.entry("Brighton Hove", 51),
            Map.entry("Fulham", 36),
            Map.entry("Sunderland", 746),
            Map.entry("West Ham", 48),
            Map.entry("Tottenham", 47),
            Map.entry("Burnley", 44),
            Map.entry("Wolverhampton", 39),
            Map.entry("Man City", 50),
            Map.entry("Nottingham", 65),
            Map.entry("Brentford", 16),
            Map.entry("Chelsea", 49),
            Map.entry("Crystal Palace", 52),
            Map.entry("Man United", 33),
            Map.entry("Arsenal", 42),
            Map.entry("Leeds", 63),
            Map.entry("Everton", 45)
    );

    @PostConstruct
    public void setCurrentMatchday() {
        HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
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

        currentMatchday = response.getCurrentSeason().getCurrentMatchday();
    }

    @PostConstruct
    public void loadPlayers() {
        new Thread(this::loadMissingPlayers).start();
    }

    private void loadMissingPlayers() {
        for (int currentTeam : TEAM_IDS.values()) {
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
}
