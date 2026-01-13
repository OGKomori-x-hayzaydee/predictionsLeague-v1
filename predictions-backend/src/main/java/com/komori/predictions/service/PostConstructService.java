package com.komori.predictions.service;

import com.komori.predictions.dto.response.Player;
import com.komori.predictions.entity.PlayerEntity;
import com.komori.predictions.entity.TeamEntity;
import com.komori.predictions.repository.PlayerRepository;
import com.komori.predictions.repository.TeamRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostConstructService {
    private final APIService apiService;
    private final FixtureSchedulerService fixtureSchedulerService;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final RedisTemplate<String, Player> redisPlayerTemplate;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateUpcomingFixturesDaily() {
        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }

    @PostConstruct
    public void setCurrentMatchdayOnStartup() {
        // player migration

        List<TeamEntity> teams = teamRepository.findAll();
        List<PlayerEntity> players = new ArrayList<>();
        teams.forEach(teamEntity -> {
            String key = "team:" + teamEntity.getTeamId() + ":players";
            List<Player> playerList = redisPlayerTemplate.opsForList().range(key, 0, -1);
            assert playerList != null;
            playerList.forEach(player -> {
                if (player != null) {
                    PlayerEntity playerEntity = PlayerEntity.builder()
                            .team(teamEntity)
                            .name(player.getName())
                            .position(player.getPosition())
                            .build();

                    players.add(playerEntity);
                }
            });
        });
        playerRepository.saveAll(players);

        log.info("Updating upcoming fixtures...");
        apiService.updateUpcomingFixtures();
        log.info("Scheduling matches for the day...");
        fixtureSchedulerService.scheduleFixturesForTheDay();
    }
}
