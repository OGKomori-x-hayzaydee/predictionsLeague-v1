package com.komori.predictions.controller;

import com.komori.predictions.dto.response.LeagueStanding;
import com.komori.predictions.dto.response.LeagueSummary;
import com.komori.predictions.dto.request.CreateLeagueRequest;
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
    public ResponseEntity<LeagueStanding> getLeagueStandings(@PathVariable String uuid) {
        LeagueStanding standings = leagueService.getLeagueStandings(uuid);
        return ResponseEntity.ok().body(standings);
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

    @PostMapping("/public/{uuid}/join")
    public ResponseEntity<String> joinPublicLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @PathVariable String uuid) {
        String leagueName = leagueService.joinPublicLeague(email, uuid);
        return ResponseEntity.ok().body("Successfully joined " + leagueName + " league");
    }

    @PostMapping("/private/{code}/join")
    public ResponseEntity<String> joinPrivateLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @PathVariable String code) {
        String leagueName = leagueService.joinPrivateLeague(email, code);
        return ResponseEntity.ok().body("Successfully joined " + leagueName + " league");
    }
}
