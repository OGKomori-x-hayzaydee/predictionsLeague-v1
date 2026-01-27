package com.komori.predictions.service;

import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
import com.komori.predictions.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixtureService {
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final PlayerRepository playerRepository;
    private final APIService apiService;

    public List<Fixture> getFixtures() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtures == null) {
            apiService.updateUpcomingFixtures();
            fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        }

        if (fixtures == null) {
            throw new RuntimeException("Fixtures not available in redis after API refresh");
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
            players = playerRepository.findAllByTeam_TeamId(teamId)
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
