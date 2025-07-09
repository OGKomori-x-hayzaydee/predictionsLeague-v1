package com.komori.predictions.service;

import com.komori.predictions.entity.LeagueEntity;

import java.util.Set;

public interface LeagueService {
    void createLeague(String name);
    Set<LeagueEntity> getLeaguesForUser(String email);
}
