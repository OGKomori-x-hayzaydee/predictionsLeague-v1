package com.komori.predictions.controller;

import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.service.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/leagues")
@RequiredArgsConstructor
public class LeagueController {
    private final LeagueService leagueService;

    @GetMapping
    public ResponseEntity<Set<LeagueEntity>> getLeaguesForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<LeagueEntity> leagues = leagueService.getLeaguesForUser(email);
        return ResponseEntity.ok().body(leagues);
    }

    @PostMapping
    public ResponseEntity<String> createLeague(String name) {
        leagueService.createLeague(name);
        return ResponseEntity.status(HttpStatus.CREATED).body("New league created");
    }
}
