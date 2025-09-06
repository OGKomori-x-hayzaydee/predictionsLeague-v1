package com.komori.predictions.dto.request;

import com.komori.predictions.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationCallbackRequest {
    private Team favouriteTeam;
    private String username;
}
