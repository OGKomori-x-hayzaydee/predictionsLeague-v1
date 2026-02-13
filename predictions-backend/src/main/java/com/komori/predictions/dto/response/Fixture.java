package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.GameStatus;
import com.komori.predictions.dto.response.fpl.FixtureDetails;
import com.komori.predictions.entity.TeamEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Fixture {
    private Long id;
    private Integer homeId;
    private String homeTeam;
    private Integer awayId;
    private String awayTeam;
    private OffsetDateTime date;
    private String competition;
    private GameStatus status;
    private String venue;
    private Integer gameweek;
    private Integer homeScore;
    private Integer awayScore;
    private List<Player> homePlayers;
    private List<Player> awayPlayers;

    public Fixture(FixtureDetails fixture, TeamEntity homeTeamEntity, TeamEntity awayTeamEntity) {
        this.id = fixture.getId();
        this.homeId = homeTeamEntity.getTeamId();
        this.homeTeam = homeTeamEntity.getName();
        this.awayId = awayTeamEntity.getTeamId();
        this.awayTeam = awayTeamEntity.getName();
        this.date = fixture.getDate();
        this.competition = "Premier League";
        this.venue = homeTeamEntity.getVenue();
        this.gameweek = fixture.getGameweek();
        this.homePlayers = new ArrayList<>();
        this.awayPlayers = new ArrayList<>();

        if (fixture.getFinished()) {
            this.status = GameStatus.FINISHED;
        } else if (fixture.getStarted()) {
            this.status = GameStatus.LIVE;
        } else {
            this.status = GameStatus.TIMED;
        }
    }
}
