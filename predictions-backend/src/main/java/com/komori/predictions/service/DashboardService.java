package com.komori.predictions.service;

import com.komori.predictions.dto.projection.AccuracyStatsProjection;
import com.komori.predictions.dto.response.DashboardEssentials;
import com.komori.predictions.dto.response.DashboardLeagueSummary;
import com.komori.predictions.dto.response.DashboardPredictionSummary;
import com.komori.predictions.dto.response.Match;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.entity.UserLeagueEntity;
import com.komori.predictions.repository.PredictionRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final PredictionRepository predictionRepository;

    public DashboardEssentials getDashboardDetails(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return userEntityToDashboardDetails(user);
    }

    public Set<DashboardPredictionSummary> getPredictions(String email) {
        return predictionRepository.findAllByUser_Email(email).stream()
                .map(DashboardPredictionSummary::new)
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public Set<DashboardLeagueSummary> getLeagues(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return Set.copyOf(user.getLeagues().stream()
                .map(UserLeagueEntity::getLeague)
                .map(entity -> entityToSummary(entity, user.getId()))
                .toList());
    }

    public Set<Match> getMatches(@SuppressWarnings("unused") String email) {
        return new HashSet<>();
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
        int totalUsers = (int) userRepository.count();
        AccuracyStatsProjection accuracyStatsProjection = predictionRepository.getAccuracyStatsByUserId(user.getId());
        return DashboardEssentials.builder()
                .user(new DashboardEssentials.User(
                        user.getUsername(), user.getProfilePictureUrl(), user.getTotalPoints(), predictionRepository.countByUser(user), 0
                ))
                .season(new DashboardEssentials.Season(
                        7, 38, "Fri 18:00"
                ))
                .stats(new DashboardEssentials.Stats(
                        new DashboardEssentials.Stats.WeeklyPoints(
                                0,
                                globalRank,
                                0),
                        new DashboardEssentials.Stats.AccuracyRate(
                                accuracyStatsProjection.getAccuracy(), accuracyStatsProjection.getCorrect()
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
