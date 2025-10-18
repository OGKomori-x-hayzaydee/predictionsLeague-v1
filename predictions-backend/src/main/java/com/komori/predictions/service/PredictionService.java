package com.komori.predictions.service;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.dto.enumerated.PredictionStatus;
import com.komori.predictions.dto.request.PredictionRequest;
import com.komori.predictions.entity.MatchEntity;
import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.MatchRepository;
import com.komori.predictions.repository.PredictionRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public Set<PredictionEntity> getPredictionsForUser(String email) {
        return predictionRepository.findAllByUser_Email(email);
    }

    public void makePrediction(String email, PredictionRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        PredictionEntity prediction = predictionRepository.findByMatchIdAndUser_Email(request.getMatchId(), email);
        if (prediction == null) {
            predictionRepository.save(new PredictionEntity(user, request));
        } else {
            prediction.setDate(Instant.now());
            prediction.setChips(request.getChips());
            prediction.setHomeScore(request.getHomeScore());
            prediction.setAwayScore(request.getAwayScore());
            prediction.setHomeScorers(request.getHomeScorers());
            prediction.setAwayScorers(request.getAwayScorers());
            predictionRepository.save(prediction);
        }

    }

    @Transactional
    public void updateDatabaseAfterGame(MatchEntity match) {
        List<PredictionEntity> predictions = predictionRepository.findAllByMatchId(match.getMatchId());
        for (PredictionEntity prediction : predictions) {
            int points = getPredictionScore(prediction.getUser().getEmail(), match.getMatchId().intValue());
            boolean correct = isPredictionCorrect(prediction, match);
            prediction.setPoints(points);
            prediction.setCorrect(correct);
            prediction.setStatus(PredictionStatus.COMPLETED);
        }
        predictionRepository.saveAllAndFlush(predictions);
    }

    // Scoring System
    public Integer getPredictionScore(String email, int matchId) {
        MatchEntity match = matchRepository.findByOldFixtureId(matchId);
        PredictionEntity prediction = predictionRepository.findByMatchIdAndUser_Email(match.getOldFixtureId().longValue(), email);

        int points = 0;
        int actualHome = match.getHomeScore();
        int actualAway = match.getAwayScore();
        int predHome = prediction.getHomeScore();
        int predAway = prediction.getAwayScore();
        List<String> actualHomeScorers = match.getHomeScorers();
        List<String> actualAwayScorers = match.getAwayScorers();
        List<String> predHomeScorers = prediction.getHomeScorers();
        List<String> predAwayScorers = prediction.getAwayScorers();
        List<Chip> chips = prediction.getChips();

        // Base points
        boolean correctScoreline = (actualHome == predHome) && (actualAway == predAway);
        boolean correctDraw = (actualHome == actualAway) && (predHome == predAway);
        boolean correctWinner = (Integer.compare(actualHome, actualAway)) == (Integer.compare(predHome, predAway));

        if (correctScoreline && scorersMatchExactly(actualHomeScorers, actualAwayScorers,
                predHomeScorers, predAwayScorers)) {
            points = 15;
        } else if (correctScoreline) {
            points = 10;
        } else if (correctDraw) {
            points = 7;
        } else if (correctWinner) {
            points = 5;
        }

        // Goalscorer points
        int correctScorers = countCorrectScorers(actualHomeScorers, actualAwayScorers, predHomeScorers, predAwayScorers);
        if (chips.contains(Chip.SCORER_FOCUS)) {
            points += 4 * correctScorers;
        } else {
            points += 2 * correctScorers;
        }

        // Goal difference penalty
        int goalDifference = Math.abs((actualHome + actualAway) - (predHome + predAway));
        if (goalDifference > 2) {
            points -= goalDifference - 2;
        }

        // Total
        if (chips.contains(Chip.DOUBLE_DOWN) && chips.contains(Chip.WILDCARD)) {
            return points * 6;
        } else if (chips.contains(Chip.WILDCARD)) {
            return points * 3;
        } else if (chips.contains(Chip.DOUBLE_DOWN)) {
            return points * 2;
        } else {
            return points;
        }
    }

    private boolean scorersMatchExactly(List<String> actualHomeScorers, List<String> actualAwayScorers, List<String> predHomeScorers, List<String> predAwayScorers) {
        if (actualHomeScorers.size() != predHomeScorers.size() || actualAwayScorers.size() != predAwayScorers.size()) {
            return false;
        }

        Map<String, Long> actualHomeMap = actualHomeScorers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        Map<String, Long> actualAwayMap = actualAwayScorers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        Map<String, Long> predHomeMap = predHomeScorers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        Map<String, Long> predAwayMap = actualHomeScorers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        return actualHomeMap.equals(predHomeMap) && actualAwayMap.equals(predAwayMap);
    }

    private int countCorrectScorers(List<String> actualHomeScorers, List<String> actualAwayScorers, List<String> predHomeScorers, List<String> predAwayScorers) {
        List<String> actualScorers = Stream.concat(actualHomeScorers.stream(), actualAwayScorers.stream()).toList();
        List<String> predScorers = Stream.concat(predHomeScorers.stream(), predAwayScorers.stream()).toList();

        Map<String, Long> actualScorerMap = actualScorers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        int totalCount = 0;
        for (String scorer : predScorers) {
            if (actualScorerMap.get(scorer) != null && actualScorerMap.get(scorer) > 0) {
                totalCount++;
                actualScorerMap.put(scorer, actualScorerMap.get(scorer) - 1);
            }
        }

        return totalCount;
    }

    private boolean isPredictionCorrect(PredictionEntity prediction, MatchEntity match) {
        return (Objects.equals(prediction.getHomeScore(), match.getHomeScore())) && (Objects.equals(prediction.getAwayScore(), match.getAwayScore()));
    }
}
