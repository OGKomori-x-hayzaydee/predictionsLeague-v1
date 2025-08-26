package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueStanding {
    String leagueName;
    Map<String, Integer> usersAndPoints;
}
