package com.komori.predictions.dto.response.fpl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Gameweek {
    private List<IndividualGameweek> events;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IndividualGameweek {
        private Integer id;
        private Boolean finished;
    }
}
