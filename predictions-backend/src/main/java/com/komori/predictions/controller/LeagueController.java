package com.komori.predictions.controller;

import com.komori.predictions.dto.response.LeagueOverview;
import com.komori.predictions.dto.request.CreateLeagueRequest;
import com.komori.predictions.dto.response.LeagueStanding;
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

    @PostMapping("/create")
    public ResponseEntity<?> createLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @RequestBody CreateLeagueRequest leagueRequest) {
        leagueService.createLeague(email, leagueRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("League created!");
    }

    @GetMapping("/user")
    public ResponseEntity<Set<LeagueOverview>> getLeagueOverviewForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<LeagueOverview> leagues = leagueService.getLeagueOverviewForUser(email);
        return ResponseEntity.ok().body(leagues);
    }

    @GetMapping("/{uuid}/standings")
    public ResponseEntity<LeagueStanding> getLeagueStandings(@CurrentSecurityContext(expression = "authentication?.name") String email, @PathVariable String uuid) {
        LeagueStanding standing = leagueService.getLeagueStanding(email, uuid);
        return ResponseEntity.ok(standing);
    }

    @PostMapping("/{code}/join")
    public ResponseEntity<?> joinLeague(@CurrentSecurityContext(expression = "authentication?.name") String email, @PathVariable String code) {
        leagueService.joinLeague(email, code);
        return ResponseEntity.ok("League joined successfully!");
    }

    @DeleteMapping("{uuid}/delete")
    public ResponseEntity<?> deleteLeague(@PathVariable String uuid) {
        leagueService.deleteLeague(uuid);
        return ResponseEntity.ok("League deleted successfully");
    }
}
