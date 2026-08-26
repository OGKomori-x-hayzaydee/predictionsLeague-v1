package com.komori.predictions.service;

import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
import com.komori.predictions.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixtureService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final PlayerRepository playerRepository;
    private final APIService apiService;

    public List<Fixture> getFixtures() {
        List<Object> fixtureObjects = redisTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtureObjects == null || fixtureObjects.isEmpty()) {
            apiService.updateFixtures();
            fixtureObjects = redisTemplate.opsForList().range("fixtures", 0, -1);
        }

        if (fixtureObjects == null || fixtureObjects.isEmpty()) {
            log.error("Fixtures not available in redis after API refresh");
            return new ArrayList<>();
        }

        List<Fixture> fixtureList = fixtureObjects.stream().map(obj -> (Fixture) obj).toList();

        fixtureList.forEach(fixture -> {
            List<Player> homePlayers = getPlayersForTeam(fixture.getHomeId());
            List<Player> awayPlayers = getPlayersForTeam(fixture.getAwayId());
            fixture.setHomePlayers(homePlayers);
            fixture.setAwayPlayers(awayPlayers);
        });

        return fixtureList;
    }

    private List<Player> getPlayersForTeam(Integer teamId) {
        String key = "team:" + teamId + ":players";
        List<Object> playerObjects = redisTemplate.opsForList().range(key, 0, -1);
        List<Player> playerList;

        if (playerObjects == null || playerObjects.isEmpty()) {
            playerList = playerRepository.findAllByTeam_TeamId(teamId)
                    .stream()
                    .map(Player::new)
                    .toList();

            if (!playerList.isEmpty()) {
                redisTemplate.opsForList().rightPushAll(key, playerList);
                redisTemplate.expire(key, Duration.ofDays(7));
            }
        } else {
            playerList = playerObjects.stream().map(obj -> (Player) obj).toList();
        }

        return playerList;
    }
}
