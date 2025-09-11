package com.komori.predictions.dto.request;

import com.komori.predictions.dto.enumerated.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FinishRegistrationRequest {
    private String email;
    private Team favouriteTeam;
    private String username;
}
