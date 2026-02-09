package com.komori.predictions.entity;

import com.komori.predictions.entity.id.UserLeagueId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "user_league_table")
@Data
@NoArgsConstructor
public class UserLeagueEntity {
    @EmbeddedId
    private UserLeagueId id;
    @ManyToOne @MapsId("userId") @JoinColumn(name = "user_id")
    private UserEntity user;
    @ManyToOne @MapsId("leagueId") @JoinColumn(name = "league_id")
    private LeagueEntity league;
    private Integer points;
    private Boolean isOwner;
    private Boolean isAdmin;
    @CreationTimestamp
    private Timestamp joinedAt;

    public UserLeagueEntity(UserEntity user, LeagueEntity league, int points, boolean isOwner, boolean isAdmin) {
        this.user = user;
        this.league = league;
        this.points = points;
        this.isOwner = isOwner;
        this.isAdmin = isAdmin;
        this.id = new UserLeagueId(user.getId(), league.getId());
    }
}
