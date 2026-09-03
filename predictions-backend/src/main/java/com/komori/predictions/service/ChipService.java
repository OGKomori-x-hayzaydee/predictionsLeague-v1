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

    public List<ChipStatus.UserChip> getChipStatusForUser(String uuid) {
        List<ChipEntity> chips = chipRepository.findAllByUser_UUID(uuid);
        return chips.stream()
                .map(ChipStatus.UserChip::new)
                .toList();
    }

    public void createChipsForNewUser(UserEntity newUser) {
        List<ChipEntity> chips = List.of(
                ChipEntity.builder().user(newUser).type(Chip.WILDCARD).build(),
                ChipEntity.builder().user(newUser).type(Chip.DEFENSE_PLUS_PLUS).build(),
                ChipEntity.builder().user(newUser).type(Chip.ALL_IN_WEEK).seasonLimit(Chip.ALL_IN_WEEK.getValue()).build(),
                ChipEntity.builder().user(newUser).type(Chip.SCORER_FOCUS).build(),
                ChipEntity.builder().user(newUser).type(Chip.DOUBLE_DOWN).build()
        );

        chipRepository.saveAllAndFlush(chips);
    }

    @Transactional
    public void updateChipStatusAfterPrediction(String uuid, PredictionRequest prediction, List<Chip> oldChips) {
        List<Chip> chipsToBeUpdated = prediction.getChips().stream()
                .filter(chip -> !oldChips.contains(chip))
                .toList();

        List<Chip> chipsToBeReverted = oldChips.stream()
                .filter(chip -> !prediction.getChips().contains(chip))
                .toList();

        for (Chip chip : chipsToBeUpdated) {
            ChipEntity chipEntity = chipRepository.findByUser_UUIDAndType(uuid, chip);

            chipEntity.setPreviousLastUsedGameweek(chipEntity.getLastUsedGameweek());
            chipEntity.setLastUsedGameweek(prediction.getGameweek());
            chipEntity.setSeasonUsageCount(chipEntity.getSeasonUsageCount() + 1);
            if (chipEntity.getType() != Chip.ALL_IN_WEEK) {
                chipEntity.setRemainingGameweeks(chip.getValue());
            }
            chipRepository.save(chipEntity);
        }

        for (Chip chip : chipsToBeReverted) {
            ChipEntity chipEntity = chipRepository.findByUser_UUIDAndType(uuid, chip);

            // Revert chip
            chipEntity.setLastUsedGameweek(chipEntity.getPreviousLastUsedGameweek());
            chipEntity.setRemainingGameweeks(0);
            chipEntity.setSeasonUsageCount(chipEntity.getSeasonUsageCount() - 1);
            chipRepository.save(chipEntity);
        }
    }

    @Transactional
    public void updateAllGameweekCooldowns() {
        chipRepository.decrementGameweeksRemainingForAllUsers();
    }
}
