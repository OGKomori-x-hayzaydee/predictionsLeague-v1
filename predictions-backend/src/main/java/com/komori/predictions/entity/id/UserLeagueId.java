package com.komori.predictions.entity.id;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserLeagueId implements Serializable {
    private Long userId;
    private Long leagueId;

    public UserLeagueId() {}

    public UserLeagueId(Long userId, Long leagueId) {
        this.userId = userId;
        this.leagueId = leagueId;
    }

    // Explicit getters/setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getLeagueId() { return leagueId; }
    public void setLeagueId(Long leagueId) { this.leagueId = leagueId; }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserLeagueId that)) return false;
        return userId.equals(that.userId) && leagueId.equals(that.leagueId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, leagueId);
    }
}
