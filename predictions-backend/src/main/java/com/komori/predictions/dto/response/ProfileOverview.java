package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileOverview {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private Team favouriteTeam;
    private Instant joinedAt;
    private Boolean isVerified;

    public ProfileOverview(UserEntity entity) {
        this.id = entity.getUUID();
        this.username = entity.getUsername();
        this.email = entity.getEmail();
        this.firstName = entity.getFirstName();
        this.lastName = entity.getLastName();
        this.profilePicture = entity.getProfilePictureUrl();
        this.favouriteTeam = entity.getFavouriteTeam();
        this.joinedAt = entity.getCreatedAt().toInstant();
        this.isVerified = entity.getAccountVerified();
    }
}
