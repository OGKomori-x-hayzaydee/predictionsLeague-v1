package com.komori.predictions.service;

import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
import com.komori.predictions.repository.PlayerRepository;
import com.komori.predictions.repository.TeamRepository;
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
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final PlayerRepository playerRepository;
    private final APIService apiService;
    private final TeamRepository teamRepository;

    public List<Fixture> getFixtures() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtures == null || fixtures.isEmpty()) {
            apiService.updateFixtures();
            fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        }

        if (fixtures == null || fixtures.isEmpty()) {
            log.error("Fixtures not available in redis after API refresh");
            return new ArrayList<>();
        }

        fixtures.forEach(fixture -> {
            List<Player> homePlayers = getPlayersForTeam(fixture.getHomeId());
            List<Player> awayPlayers = getPlayersForTeam(fixture.getAwayId());
            fixture.setHomePlayers(homePlayers);
            fixture.setAwayPlayers(awayPlayers);
        });

        return fixtures;
    }

    private List<Player> getPlayersForTeam(Integer teamId) {
        String key = "team:" + teamId + ":players";
        List<Player> players = redisPlayerTemplate.opsForList().range(key, 0, -1);

        if (players == null || players.isEmpty()) {
            players = playerRepository.findAllByTeam(teamRepository.findByTeamId(teamId))
                    .stream()
                    .map(Player::new)
                    .toList();

            if (!players.isEmpty()) {
                redisPlayerTemplate.opsForList().rightPushAll(key, players);
                redisPlayerTemplate.expire(key, Duration.ofDays(7));
            }
        }

        return players;
    }
}
