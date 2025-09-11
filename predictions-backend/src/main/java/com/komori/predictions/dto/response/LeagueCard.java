package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeagueCard {
    private String id;
    private String name;
    private String description;
    private Integer memberCount;
    private Integer currentRank;
    private Integer totalPoints;
    private String joinCode;
    private Boolean isOwner;
    private Boolean isAdmin;
    private String status;
    private Timestamp createdAt;
    private Integer gameweek;
    private Instant nextDeadline;
}
