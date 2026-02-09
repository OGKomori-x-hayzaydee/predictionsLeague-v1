package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Publicity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeagueOverview {
    private String id;
    private String name;
    private String description;
    private Integer firstGameweek;
    private Integer members;
    private Integer position;
    private Integer points;
    private String joinCode;
    private Boolean isAdmin;
    private Publicity type;
    private Timestamp createdAt;
}
