package com.komori.predictions.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalCompetitionResponse {
    private Integer id;
    private String name;
    private CurrentSeason currentSeason;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CurrentSeason {
        private Integer id;
        private Integer currentMatchday;
    }
}
