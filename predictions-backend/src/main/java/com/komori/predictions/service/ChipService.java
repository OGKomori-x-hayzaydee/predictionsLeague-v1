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
                ChipEntity.builder().user(newUser).type(Chip.WILDCARD).build(),
                ChipEntity.builder().user(newUser).type(Chip.DEFENSE_PLUS_PLUS).build(),
                ChipEntity.builder().user(newUser).type(Chip.ALL_IN_WEEK).seasonLimit(4).build(),
                ChipEntity.builder().user(newUser).type(Chip.SCORER_FOCUS).build(),
                ChipEntity.builder().user(newUser).type(Chip.DOUBLE_DOWN).build()
        );

        chipRepository.saveAllAndFlush(chips);
    }

    @Transactional
    public void updateChipStatusAfterNewPrediction(String email, PredictionRequest prediction) {
        for (Chip chip : prediction.getChips()) {
            ChipEntity chipEntity = chipRepository.findByUser_EmailAndType(email, chip);

            if (chipEntity.getType() == Chip.ALL_IN_WEEK) {
                Integer lastUsed = chipEntity.getLastUsedGameweek();
                if (lastUsed == null || !lastUsed.equals(prediction.getGameweek())) {
                    chipEntity.setLastUsedGameweek(prediction.getGameweek());
                    chipEntity.setSeasonUsageCount(chipEntity.getSeasonUsageCount() + 1);
                }
            } else {
                chipEntity.setLastUsedGameweek(prediction.getGameweek());
                chipEntity.setSeasonUsageCount(chipEntity.getSeasonUsageCount() + 1);
                if (chipEntity.getType() == Chip.WILDCARD) {
                    chipEntity.setRemainingGameweeks(8);
                } else if (chipEntity.getType() == Chip.SCORER_FOCUS || chipEntity.getType() == Chip.DEFENSE_PLUS_PLUS) {
                    chipEntity.setRemainingGameweeks(6);
                } else if (chipEntity.getType() == Chip.DOUBLE_DOWN) {
                    chipEntity.setRemainingGameweeks(1);
                }
            }

            chipRepository.save(chipEntity);
        }
    }

    @Transactional
    public void updateAllGameweekCooldowns() {
        chipRepository.decrementGameweeksRemainingForAllUsers();
    }
}
