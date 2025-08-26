package com.komori.predictions.dto.request;

import com.komori.predictions.entity.Team;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
// Represents data coming into the API
public class RegistrationRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Team favouriteTeam;
}
