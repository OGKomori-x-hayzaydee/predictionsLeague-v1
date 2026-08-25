package com.komori.predictions.controller;

import com.komori.predictions.dto.request.UserLeagueActionRequest;
import com.komori.predictions.dto.request.UpdateLeagueRequest;
import com.komori.predictions.dto.response.LeagueOverview;
import com.komori.predictions.dto.request.CreateLeagueRequest;
import com.komori.predictions.dto.response.LeaguePredictionSummary;
import com.komori.predictions.dto.response.LeagueStanding;
import com.komori.predictions.service.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/leagues")
@RequiredArgsConstructor
public class LeagueController {
    private final LeagueService leagueService;

    @PostMapping("/create")
    public ResponseEntity<?> createLeague(@CurrentSecurityContext(expression = "authentication?.name") String uuid, @RequestBody CreateLeagueRequest leagueRequest) {
        leagueService.createLeague(uuid, leagueRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("League created!");
    }

    @GetMapping("/user")
    public ResponseEntity<Set<LeagueOverview>> getLeagueOverviewForUser(@CurrentSecurityContext(expression = "authentication?.name") String uuid) {
        Set<LeagueOverview> leagues = leagueService.getLeagueOverviewForUser(uuid);
        return ResponseEntity.ok().body(leagues);
    }

    @GetMapping("/{leagueUUID}/standings")
    public ResponseEntity<LeagueStanding> getLeagueStandings(@CurrentSecurityContext(expression = "authentication?.name") String userUUID, @PathVariable String leagueUUID) {
        LeagueStanding standing = leagueService.getLeagueStanding(userUUID, leagueUUID);
        return ResponseEntity.ok(standing);
    }

    @GetMapping("{leagueUUID}/predictions/{gameweek}")
    public ResponseEntity<List<LeaguePredictionSummary>> getUserPredictions(@PathVariable String leagueUUID, @PathVariable Integer gameweek) {
        List<LeaguePredictionSummary> predictions = leagueService.getLeaguePredictions(leagueUUID, gameweek);
        return ResponseEntity.ok(predictions);
    }

    @PostMapping("/{code}/join")
    public ResponseEntity<?> joinLeague(@CurrentSecurityContext(expression = "authentication?.name") String uuid, @PathVariable String code) {
        leagueService.joinLeague(uuid, code);
        return ResponseEntity.ok("League joined successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateLeague(@RequestBody UpdateLeagueRequest request) {
        leagueService.updateLeague(request);
        return ResponseEntity.ok("League updated successfully!");
    }

    @PutMapping("/add-admin")
    public ResponseEntity<String> makeUserAdmin(@RequestBody UserLeagueActionRequest request) {
        leagueService.makeUserAdmin(request);
        return ResponseEntity.ok("Admins updated successfully!");
    }

    @DeleteMapping("/remove-user")
    public ResponseEntity<String> removeUserFromLeague(@RequestBody UserLeagueActionRequest request) {
        leagueService.removeUserFromLeague(request);
        return ResponseEntity.ok("User removed successfully!");
    }

    @DeleteMapping("{leagueUUID}/delete")
    public ResponseEntity<?> deleteLeague(@PathVariable String leagueUUID) {
        leagueService.deleteLeague(leagueUUID);
        return ResponseEntity.ok("League deleted successfully");
    }
}
