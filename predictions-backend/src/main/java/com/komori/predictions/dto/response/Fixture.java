package com.komori.predictions.dto.response;

import com.komori.predictions.config.FixtureDetails;
import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Fixture {
    private Integer id;
    private Integer homeId;
    private String homeTeam;
    private Integer awayId;
    private String awayTeam;
    private LocalDateTime date;
    private String competition;
    private String status;
    private String venue;
    private Integer gameweek;
    private Integer homeScore;
    private Integer awayScore;
    private List<Player> homePlayers;
    private List<Player> awayPlayers;

    public Fixture(ExternalFixtureResponse1.Match match) {
        this.id = match.getId();
        this.homeId = match.getHomeTeam().getId();
        this.homeTeam = match.getHomeTeam().getShortName();
        this.awayId = match.getAwayTeam().getId();
        this.awayTeam = match.getAwayTeam().getShortName();
        this.date = match.getUtcDate().toLocalDateTime();
        this.competition = "Premier League";
        this.status = match.getStatus();
        this.venue = FixtureDetails.VENUES.get(match.getHomeTeam().getTla());
        this.gameweek = match.getMatchday();
        this.homeScore = match.getScore().getFullTime().getHome();
        this.awayScore = match.getScore().getFullTime().getAway();
        this.homePlayers = new ArrayList<>();
        this.awayPlayers = new ArrayList<>();
    }
}
