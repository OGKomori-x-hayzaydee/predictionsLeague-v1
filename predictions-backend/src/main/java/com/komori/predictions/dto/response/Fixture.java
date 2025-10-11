package com.komori.predictions.dto.response;

import com.komori.predictions.config.FixtureDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Fixture {
    private String id;
    private String homeTeam;
    private String awayTeam;
    private LocalDateTime date;
    private String competition;
    private String status;
    private String venue;
    private Integer gameweek;
    private Integer homeScore;
    private Integer awayScore;

    public Fixture(ExternalFixtureResponse.Match match) {
        this.id = match.getId().toString();
        this.homeTeam = match.getHomeTeam().getShortName();
        this.awayTeam = match.getAwayTeam().getShortName();
        this.date = match.getUtcDate().toLocalDateTime();
        this.competition = "Premier League";
        this.status = match.getStatus();
        this.venue = FixtureDetails.VENUES.get(match.getHomeTeam().getTla());
        this.gameweek = match.getMatchday();
        this.homeScore = match.getScore().getFullTime().getHome();
        this.awayScore = match.getScore().getFullTime().getAway();
    }
}
