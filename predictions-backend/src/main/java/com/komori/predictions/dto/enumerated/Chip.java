package com.komori.predictions.dto.enumerated;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Chip {
    DOUBLE_DOWN(1),
    WILDCARD(8),
    SCORER_FOCUS(6),
    DEFENSE_PLUS_PLUS(6),
    ALL_IN_WEEK(4);

    private final Integer value;
}
