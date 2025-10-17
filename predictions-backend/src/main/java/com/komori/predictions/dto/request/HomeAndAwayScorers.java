package com.komori.predictions.dto.request;

import java.util.List;

public record HomeAndAwayScorers(List<String> homeScorers, List<String> awayScorers) {
}
