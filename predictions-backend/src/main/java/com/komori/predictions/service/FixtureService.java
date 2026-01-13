package com.komori.predictions.service;

import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.dto.response.Player;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.entity.TeamEntity;
import com.komori.predictions.repository.PlayerRepository;
import com.komori.predictions.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixtureService {
    private final RedisTemplate<String, Player> redisPlayerTemplate;
    private final RedisTemplate<String, Fixture> redisFixtureTemplate;
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public List<Fixture> getFixtures() {
        List<Fixture> fixtures = redisFixtureTemplate.opsForList().range("fixtures", 0, -1);
        if (fixtures == null) {
            throw new RuntimeException("Failed to fetch data from Redis");
        }

        fixtures.forEach(fixture -> {
            List<Player> homePlayers = getPlayersForTeam(fixture.getHomeId());
            List<Player> awayPlayers = getPlayersForTeam(fixture.getAwayId());
            fixture.setHomePlayers(homePlayers);
            fixture.setAwayPlayers(awayPlayers);
        });

        return fixtures;
    }

    public void updateFixtureData(List<ExternalFixtureResponse1.Match> matchList) {
        redisFixtureTemplate.delete("fixtures");
        List<Fixture> fixtures = new ArrayList<>();

        matchList.forEach(match -> {
            String homeTeamName = match.getHomeTeam().getShortName();
            String awayTeamName = match.getAwayTeam().getShortName();

            TeamEntity homeTeamEntity = teamRepository.findByName(homeTeamName);
            TeamEntity awayTeamEntity = teamRepository.findByName(awayTeamName);

            if (homeTeamEntity.getIsBigSixTeam() || awayTeamEntity.getIsBigSixTeam()) {
                fixtures.add(new Fixture(match, homeTeamEntity, awayTeamEntity));
            }
        });

        redisFixtureTemplate.opsForList().rightPushAll("fixtures", fixtures);
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
