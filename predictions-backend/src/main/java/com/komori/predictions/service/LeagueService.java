package com.komori.predictions.service;

import com.komori.predictions.dto.LeagueSummary;
import com.komori.predictions.entity.Publicity;

import java.util.Set;

public interface LeagueService {
    LeagueSummary createLeague(String email, String name, Publicity publicity);
    Set<LeagueSummary> getLeaguesForUser(String email);
    LeagueSummary getLeague(String uuid);
    String joinLeague(String email, String uuid);
}
