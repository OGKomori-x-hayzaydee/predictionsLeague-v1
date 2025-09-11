package com.komori.predictions.entity;

import com.komori.predictions.entity.id.UserLeagueId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Boolean isOwner;
    private Boolean isAdmin;

    public UserLeagueEntity(UserEntity user, LeagueEntity league, Boolean isOwner, Boolean isAdmin) {
        this.user = user;
        this.league = league;
        this.isOwner = isOwner;
        this.isAdmin = isAdmin;
        this.id = new UserLeagueId(user.getId(), league.getId());
    }
}
