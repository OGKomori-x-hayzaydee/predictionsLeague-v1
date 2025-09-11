package com.komori.predictions.controller;

import com.komori.predictions.dto.response.LeagueCard;
import com.komori.predictions.dto.response.LeagueStanding;
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

    @GetMapping("/user")
    public ResponseEntity<Set<LeagueCard>> getLeagueCardsForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<LeagueCard> leagues = leagueService.getLeagueCardsForUser(email);
        return ResponseEntity.ok().body(leagues);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @RequestBody CreateLeagueRequest leagueRequest) {
        leagueService.createLeague(email, leagueRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("League created!");
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<LeagueStanding> getLeagueStandings(@PathVariable String uuid) {
        LeagueStanding standings = leagueService.getLeagueStandings(uuid);
        return ResponseEntity.ok().body(standings);
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
