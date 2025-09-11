package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueStanding {
    private String leagueId;
    private Set<LeagueMember> standings;

    @Data
    @Builder
    public static class LeagueMember {
        private String id;
        private String username;
        private String displayName;
        private Integer position;
        private Integer points;
        private Integer predictions;
        private Instant joinedAt;
        private Boolean isCurrentUser;
    }
}
