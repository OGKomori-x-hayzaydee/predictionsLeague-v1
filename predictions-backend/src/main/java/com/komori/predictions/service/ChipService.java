package com.komori.predictions.service;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.dto.request.PredictionRequest;
import com.komori.predictions.dto.response.ChipStatus;
import com.komori.predictions.entity.ChipEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.ChipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChipService {
    private final ChipRepository chipRepository;

    public List<ChipStatus.UserChip> getChipStatusForUser(String email) {
        List<ChipEntity> chips = chipRepository.findAllByUser_Email(email);
        return chips.stream()
                .map(ChipStatus.UserChip::new)
                .toList();
    }

    public void createChipsForNewUser(UserEntity newUser) {
        List<ChipEntity> chips = List.of(
                ChipEntity.builder().user(newUser).type(Chip.WILDCARD).seasonUsageCount(0).remainingGameweeks(0).build(),
                ChipEntity.builder().user(newUser).type(Chip.OPPORTUNIST).seasonLimit(2).seasonUsageCount(0).build(),
                ChipEntity.builder().user(newUser).type(Chip.DEFENSE_PLUS_PLUS).seasonUsageCount(0).remainingGameweeks(0).build(),
                ChipEntity.builder().user(newUser).type(Chip.ALL_IN_WEEK).seasonLimit(4).seasonUsageCount(0).build(),
                ChipEntity.builder().user(newUser).type(Chip.SCORER_FOCUS).seasonUsageCount(0).remainingGameweeks(0).build()
        );

        chipRepository.saveAllAndFlush(chips);
    }

    @Transactional
    public void updateChipStatusAfterNewPrediction(String email, PredictionRequest prediction) {
        List<ChipEntity> chips = chipRepository.findAllByUser_Email(email);
        for (ChipEntity entity : chips) {
            if (prediction.getChips().contains(entity.getType())) {
                entity.setLastUsedGameweek(prediction.getGameweek());
                entity.setSeasonUsageCount(entity.getSeasonUsageCount() + 1);
                if (entity.getType() == Chip.WILDCARD) {
                    entity.setRemainingGameweeks(entity.getRemainingGameweeks() + 7);
                }
                else if (entity.getType() == Chip.SCORER_FOCUS || entity.getType() == Chip.DEFENSE_PLUS_PLUS) {
                    entity.setRemainingGameweeks(entity.getRemainingGameweeks() + 5);
                }
            }
        }
        chipRepository.saveAllAndFlush(chips);
    }

    @Transactional
    public void updateAllGameweekCooldowns() {
        chipRepository.decrementGameweeksRemainingForAllUsers();
    }
}
