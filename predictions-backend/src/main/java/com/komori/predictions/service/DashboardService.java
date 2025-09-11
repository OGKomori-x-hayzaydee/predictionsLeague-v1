package com.komori.predictions.service;

import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.dto.response.DashboardEssentials;
import com.komori.predictions.dto.response.DashboardLeagueSummary;
import com.komori.predictions.dto.response.Match;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.entity.UserLeagueEntity;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;

    public DashboardEssentials getDashboardDetails(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return userEntityToDashboardDetails(user);
    }

    public Set<PredictionEntity> getPredictions(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return user.getPredictions();
    }

    public Set<DashboardLeagueSummary> getLeagues(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return Set.copyOf(user.getLeagues().stream()
                .map(UserLeagueEntity::getLeague)
                .map(entity -> entityToSummary(entity, user.getId()))
                .toList());
    }

    public Set<Match> getMatches(@SuppressWarnings("unused") String email) {
        Match firstTestMatch = Match.builder()
                .date(Instant.now())
                .homeTeam(Team.ARSENAL)
                .awayTeam(Team.CHELSEA)
                .gameweek(15)
                .predicted(false)
                .build();

        Match secondTestMatch = Match.builder()
                .date(Instant.now())
                .homeTeam(Team.SPURS)
                .awayTeam(Team.LIVERPOOL)
                .gameweek(15)
                .predicted(true)
                .build();

        return Set.of(firstTestMatch, secondTestMatch);
    }

    private DashboardLeagueSummary entityToSummary(LeagueEntity league, Long userId) {
        int rank = userRepository.findUserRankInLeague(userId, league.getId());
        return DashboardLeagueSummary.builder()
                .name(league.getName())
                .members(league.getUsers().size())
                .userPosition(rank)
                .build();
    }

    private DashboardEssentials userEntityToDashboardDetails(UserEntity user) {
        int globalRank = userRepository.findUserRank(user.getId());
        int totalUsers = userRepository.findAll().size();
        return DashboardEssentials.builder()
                .user(new DashboardEssentials.User(
                        user.getUsername(), user.getProfilePictureUrl(), user.getTotalPoints(), 1, 1
                ))
                .season(new DashboardEssentials.Season(
                        4, 38, "Fri 18:00"
                ))
                .stats(new DashboardEssentials.Stats(
                        new DashboardEssentials.Stats.WeeklyPoints(
                                0,
                                1,
                                14),
                        new DashboardEssentials.Stats.AccuracyRate(
                                60D, 4
                        ),
                        new DashboardEssentials.Stats.AvailableChips(
                                0, "No chips available to use"
                        ),
                        new DashboardEssentials.Stats.GlobalRank(
                                globalRank,
                                (globalRank * 100.0) / totalUsers
                        )
                ))
                .build();
    }
}
