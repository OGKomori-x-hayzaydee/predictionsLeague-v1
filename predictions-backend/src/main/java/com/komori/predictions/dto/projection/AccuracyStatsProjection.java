package com.komori.predictions.dto.projection;

public interface AccuracyStatsProjection {
    Integer getTotal();

    Integer getCorrect();

    default Double getAccuracy() {
        return (getTotal() == 0) ? 0.0
                : (getCorrect() * 100.0)/getTotal();
    }
}
