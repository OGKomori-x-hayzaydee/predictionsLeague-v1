package com.komori.predictions.controller;

import com.komori.predictions.dto.LeagueSummary;
import com.komori.predictions.dto.CreateLeagueRequest;
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

    @GetMapping("/{uuid}")
    public ResponseEntity<LeagueSummary> getLeague(@PathVariable String uuid) {
        LeagueSummary league = leagueService.getLeague(uuid);
        return ResponseEntity.ok().body(league);
    }

    @GetMapping
    public ResponseEntity<Set<LeagueSummary>> getLeaguesForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<LeagueSummary> leagues = leagueService.getLeaguesForUser(email);
        return ResponseEntity.ok().body(leagues);
    }

    @PostMapping
    public ResponseEntity<LeagueSummary> createLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @RequestBody CreateLeagueRequest leagueRequest) {
        LeagueSummary newLeague = leagueService.createLeague(email, leagueRequest.getName(), leagueRequest.getPublicity());
        return ResponseEntity.status(HttpStatus.CREATED).body(newLeague);
    }

    @PostMapping("/{uuid}/join")
    public ResponseEntity<String> joinLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @PathVariable String uuid) {
        String leagueName = leagueService.joinLeague(email, uuid);
        return ResponseEntity.ok().body("Successfully joined " + leagueName + " league");
    }
}
