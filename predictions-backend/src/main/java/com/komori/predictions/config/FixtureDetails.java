package com.komori.predictions.config;

import com.komori.predictions.dto.response.ExternalFixtureResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class FixtureDetails {
    @Value("${app.fixture-api-key}")
    private String apiKey;
    private final RestTemplate restTemplate;
    public static int currentMatchday;
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
}
