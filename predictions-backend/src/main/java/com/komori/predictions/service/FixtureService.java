package com.komori.predictions.service;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FixtureService {
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;

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
