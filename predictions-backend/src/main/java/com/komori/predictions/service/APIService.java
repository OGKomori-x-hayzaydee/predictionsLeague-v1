package com.komori.predictions.service;

import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.*;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.dto.response.api2.FixtureDetails;
import com.komori.predictions.dto.response.api2.MatchEvents;
import com.komori.predictions.dto.response.api2.Squad;
import com.komori.predictions.entity.PlayerEntity;
import com.komori.predictions.entity.TeamEntity;
import com.komori.predictions.repository.PlayerRepository;
import com.komori.predictions.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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
    @Value("${app.squad-list-base-url}")
    private String squadListBaseUrl;
    @Value("${app.events-base-url}")
    private String eventsBaseUrl;
    private final HttpHeaders firstApiHeaders;
    private final HttpHeaders secondApiHeaders;
    private final RestTemplate restTemplate;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
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
        String date = today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String encodedDate = URLEncoder.encode(date, StandardCharsets.UTF_8);
        String url = UriComponentsBuilder.fromUriString(externalFixtureBaseUrl)
                .queryParam("startDate", encodedDate)
                .queryParam("endDate", encodedDate)
                .queryParam("sports", 1)
                .queryParam("showOdds", false)
                .queryParam("onlyMajorGames", true)
                .toUriString();

        HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
        ResponseEntity<FixtureDetails> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                httpEntity,
                FixtureDetails.class
        );

        FixtureDetails response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.getGames().isEmpty()) {
            throw new RuntimeException("Error getting list of second fixture IDs");
        }

        List<FixtureDetails.Game> premGames = response.getGames().stream()
                .filter(game -> game.getCompetitionId() == 7)
                .toList();

        fixtures.forEach(fixture -> {
            int homeId = fixture.getHomeId();
            int awayId = fixture.getAwayId();

            for (FixtureDetails.Game game : premGames) {
                if (game.getHomeCompetitor().getId() == homeId && game.getAwayCompetitor().getId() == awayId) {
                    fixture.setExternalFixtureId(game.getId());
                    break;
                }
            }
        });
    }

    public HomeAndAwayScorers getGoalScorers(Fixture fixture) {
        HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
        String url = UriComponentsBuilder.fromUriString(eventsBaseUrl)
                .queryParam("gameId", fixture.getExternalFixtureId())
                .queryParam("matchupId", fixture.getHomeId() + "-" + fixture.getAwayId() + "-7")
                .toUriString();

        ResponseEntity<MatchEvents> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                httpEntity,
                MatchEvents.class
        );

        MatchEvents response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error getting goalscorers for " + fixture.getHomeTeam() + " vs " + fixture.getAwayTeam());
        }

        List<PlayerEntity> playerEntities = playerRepository.findAllByTeam_TeamIdIn(List.of(fixture.getHomeId(), fixture.getAwayId()));
        Map<Long, String> playerNames = playerEntities.stream()
                .collect(Collectors.toMap(PlayerEntity::getPlayerId, PlayerEntity::getName));

        List<String> homeScorers = new ArrayList<>();
        List<String> awayScorers = new ArrayList<>();

        for (MatchEvents.Game.Event event : response.getGame().getEvents()) {
            String type = event.getEventType().getName();
            if (!type.equals("Goal") && !type.equals("Own Goal")) continue;

            String playerName = playerNames.get(event.getPlayerId());
            if (type.equals("Own Goal")) playerName += " (OG)";

            if (event.getCompetitorId() == fixture.getHomeId().longValue()) {
                homeScorers.add(playerName);
            } else {
                awayScorers.add(playerName);
            }
        }

        return new HomeAndAwayScorers(homeScorers, awayScorers);
    }

//    @EventListener(ApplicationReadyEvent.class)
    public void loadPlayersIntoDatabase() {
        List<TeamEntity> teams = teamRepository.findAll();
        for (TeamEntity teamEntity : teams) {
            int teamId = teamEntity.getTeamId();
            String url = UriComponentsBuilder.fromUriString(squadListBaseUrl)
                    .queryParam("competitors", teamId)
                    .toUriString();

            HttpEntity<Void> httpEntity = new HttpEntity<>(secondApiHeaders);
            ResponseEntity<Squad> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    httpEntity,
                    Squad.class
            );

            Squad response = responseEntity.getBody();
            if (response == null || responseEntity.getStatusCode().isError() || response.getSquads().isEmpty()) {
                throw new RuntimeException("Error loading players for " + teamEntity.getName());
            }

            List<Squad.SquadList.Athlete> athletes = response.getSquads().getFirst().getAthletes();
            List<PlayerEntity> playerEntities = athletes.stream()
                    .filter(athlete -> (athlete.getPosition().getId() != 0) && (athlete.getPosition().getId() != 1)) // filter out Manager and Keeper
                    .map(athlete -> new PlayerEntity(athlete, teamEntity))
                    .toList();

            playerRepository.saveAll(playerEntities);
            log.info("Successfully loaded all {} players", teamEntity.getName());

            try {
                TimeUnit.SECONDS.sleep(10);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
