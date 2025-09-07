package com.komori.predictions.dto.response;

import com.komori.predictions.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDetails {
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Team favouriteTeam;
    private String profilePicture;
}
