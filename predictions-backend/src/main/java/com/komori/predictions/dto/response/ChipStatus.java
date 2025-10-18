package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.entity.ChipEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChipStatus {
    public List<UserChip> chips;

    @Data
    @AllArgsConstructor
    public static class UserChip {
        private Chip chipId;
        private Boolean available;
        private String reason;
        private Integer remainingGameweeks;
        private Integer seasonUsageCount;
        private Integer seasonLimit;
        private Integer lastUsedGameweek;

        public UserChip(ChipEntity entity) {
            this.chipId = entity.getType();
            this.available = isChipAvailable(entity);
            this.reason = getReason(entity);
            this.remainingGameweeks = entity.getRemainingGameweeks();
            this.seasonUsageCount = entity.getSeasonUsageCount();
            this.seasonLimit = entity.getSeasonLimit();
            this.lastUsedGameweek = entity.getLastUsedGameweek();
        }

        private boolean isChipAvailable(ChipEntity entity) {
            if (entity.getType() == Chip.ALL_IN_WEEK || entity.getType() == Chip.OPPORTUNIST) {
                return Objects.equals(entity.getSeasonUsageCount(), entity.getSeasonLimit());
            }

            return entity.getRemainingGameweeks() == 0;
        }

        private String getReason(ChipEntity entity) {
            if (isChipAvailable(entity)) {
                return "Available";
            }

            if (entity.getType() == Chip.ALL_IN_WEEK || entity.getType() == Chip.OPPORTUNIST) {
                return "Season limit reached";
            }

            return "On cooldown";
        }
    }
}
