package com.komori.predictions.service;

import com.komori.predictions.dto.enumerated.GameStatus;
import com.komori.predictions.dto.request.GameStatusAndScore;
import com.komori.predictions.dto.request.HomeAndAwayScorers;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.fpl.FixtureDetails;
import com.komori.predictions.dto.response.fpl.Gameweek;
import com.komori.predictions.dto.response.fpl.Squad;
import com.komori.predictions.entity.PlayerEntity;
import com.komori.predictions.entity.TeamEntity;
import com.komori.predictions.repository.PlayerRepository;
import com.komori.predictions.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class APIService {
    @Value("${app.fixture-list-base-url}")
    private String fixtureListBaseUrl;
    @Value("${app.bootstrap-static-url}")
    private String bootstrapStaticUrl;
    private final RestTemplate restTemplate;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public void updateFixtures() {
        List<FixtureDetails> response = getFixturesFromAPI();

        List<Fixture> newFixtures = response.stream()
                .map(fixture -> {
                    TeamEntity home = teamRepository.findByTeamId(fixture.getHomeId());
                    TeamEntity away = teamRepository.findByTeamId(fixture.getAwayId());
                    if (home.getIsBigSixTeam() || away.getIsBigSixTeam()) {
                        return new Fixture(fixture, home, away);
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();

        List<Object> existingFixtureObjects = redisTemplate.opsForList().range("fixtures", 0, -1);

        if (existingFixtureObjects == null || existingFixtureObjects.isEmpty()) {
            redisTemplate.opsForList().rightPushAll("fixtures", newFixtures);
        }
        else {
            List<Fixture> existingFixtures = existingFixtureObjects.stream()
                    .map(obj -> (Fixture) obj)
                    .toList();
            if (!existingFixtures.equals(newFixtures)) {
                redisTemplate.delete("fixtures");
                redisTemplate.opsForList().rightPushAll("fixtures", newFixtures);
            }
        }
    }

    public Map<Long, GameStatusAndScore> getGamesStatus() {
        List<FixtureDetails> response = getFixturesFromAPI();

        return response.stream()
                .collect(Collectors.toMap(FixtureDetails::getId, fixture -> {
                    if (fixture.getFinished()) {
                        return new GameStatusAndScore(GameStatus.FINISHED, fixture.getHomeScore(), fixture.getAwayScore());
                    } else if (fixture.getStarted()) {
                        return new GameStatusAndScore(GameStatus.LIVE, fixture.getHomeScore(), fixture.getAwayScore());
                    } else {
                        return new GameStatusAndScore(GameStatus.TIMED, fixture.getHomeScore(), fixture.getAwayScore());
                    }
                }));
    }

    public HomeAndAwayScorers getGoalScorers(Long fixtureId) {
        List<FixtureDetails> response = getFixturesFromAPI();

        Optional<FixtureDetails> fixtureOptional = response.stream()
                .filter(f -> f.getId().equals(fixtureId))
                .findFirst();

        if (fixtureOptional.isPresent()) {
            List<String> homeScorers = new ArrayList<>();
            List<String> awayScorers = new ArrayList<>();
            FixtureDetails fixture = fixtureOptional.get();
            List<FixtureDetails.Event> events = fixture.getStats().stream()
                    .filter(event -> event.getIdentifier().equals("goals_scored") || event.getIdentifier().equals("own_goals"))
                    .toList();

            Map<Long,String> playerMap = playerRepository.findAllByTeam_TeamIdIn(List.of(fixture.getHomeId(), fixture.getAwayId())).stream()
                    .collect(Collectors.toMap(PlayerEntity::getPlayerId, PlayerEntity::getName));

            for (FixtureDetails.Event event : events) {
                for (FixtureDetails.Event.PlayerAndGoals pg : event.getHome()) {
                    boolean isOwnGoal = "own_goals".equals(event.getIdentifier());
                    String playerName = playerMap.get(pg.getPlayerId());
                    String displayName = (isOwnGoal) ? playerName + " (o.g.)" : playerName;

                    for (int i = 0; i < pg.getGoals(); i++) {
                        if (isOwnGoal) {
                            awayScorers.add(displayName);
                        }
                        else {
                            homeScorers.add(displayName);
                        }
                    }
                }
                for (FixtureDetails.Event.PlayerAndGoals pg : event.getAway()) {
                    boolean isOwnGoal = "own_goals".equals(event.getIdentifier());
                    String playerName = playerMap.get(pg.getPlayerId());
                    String displayName = (isOwnGoal) ? playerName + " (o.g.)" : playerName;

                    for (int i = 0; i < pg.getGoals(); i++) {
                        if (isOwnGoal) {
                            homeScorers.add(displayName);
                        }
                        else {
                            awayScorers.add(displayName);
                        }
                    }
                }
            }

            return new HomeAndAwayScorers(homeScorers, awayScorers);
        } else {
            throw new RuntimeException("Fixture not found for fixture ID " + fixtureId);
        }
    }

    private List<FixtureDetails> getFixturesFromAPI() {
        ResponseEntity<List<FixtureDetails>> responseEntity = restTemplate.exchange(
                fixtureListBaseUrl + getCurrentMatchday(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        List<FixtureDetails> response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError() || response.isEmpty()) {
            throw new RuntimeException("Error fetching fixtures from API");
        }

        return response;
    }

    public int getCurrentMatchday() {
        Object value = redisTemplate.opsForValue().get("currentMatchday");
        if (value instanceof Integer) {
            return (int) value;
        } else if (value instanceof String) {
            return Integer.parseInt((String) value);
        } else {
            log.error("Current matchday not set in Redis. Fetching from API...");
            return getCurrentMatchdayFromAPI();
        }
    }

    private Integer getCurrentMatchdayFromAPI() {
        ResponseEntity<Gameweek> responseEntity = restTemplate.exchange(
                bootstrapStaticUrl,
                HttpMethod.GET,
                null,
                Gameweek.class
        );

        Gameweek response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching current matchday from API");
        }

        int currentMatchday = 1;
        for (Gameweek.IndividualGameweek gw : response.getEvents()) {
            if (gw.getFinished()) {
                currentMatchday++;
            } else {
                break;
            }
        }

        return currentMatchday;
    }

    @Transactional
    public void loadPlayersIntoDatabase() {
        if (playerRepository.count() != 0) {
            return;
        }

        log.info("Players not found. Loading them in...");

        ResponseEntity<Squad> responseEntity = restTemplate.exchange(
                bootstrapStaticUrl,
                HttpMethod.GET,
                null,
                Squad.class
        );

        Squad response = responseEntity.getBody();
        if (response == null || responseEntity.getStatusCode().isError()) {
            throw new RuntimeException("Error fetching players from API");
        }

        List<Squad.Player> players = response.getElements().stream()
                .filter(player -> (player.getElementType() != 1) && (player.getCanSelect()))
                .toList();

        List<PlayerEntity> playerEntities = players.stream()
                .map(player -> {
                    TeamEntity team = teamRepository.findByTeamId(player.getTeam());
                    return new PlayerEntity(player, team);
                })
                .toList();

        playerRepository.saveAll(playerEntities);
    }
}
