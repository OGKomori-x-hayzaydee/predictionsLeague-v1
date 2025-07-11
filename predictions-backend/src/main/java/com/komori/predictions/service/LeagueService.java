package com.komori.predictions.service;

import com.komori.predictions.dto.LeagueStanding;
import com.komori.predictions.dto.LeagueSummary;
import com.komori.predictions.entity.Publicity;

import java.util.Set;

public interface LeagueService {
    LeagueStanding getLeagueStandings(String uuid);
    LeagueSummary createLeague(String email, String name, Publicity publicity);
    Set<LeagueSummary> getLeaguesForUser(String email);
    String joinPublicLeague(String email, String uuid);
    String joinPrivateLeague(String email, String code);
}
