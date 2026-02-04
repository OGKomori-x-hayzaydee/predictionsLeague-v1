package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Position;
import com.komori.predictions.dto.response.api2.Squad;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long playerId;
    private String name;
    @ManyToOne @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;
    @Enumerated(value = EnumType.STRING)
    private Position position;

    public PlayerEntity(Squad.SquadList.Athlete athlete, TeamEntity teamEntity) {
        this.playerId = athlete.getId();
        this.name = athlete.getName();
        this.team = teamEntity;
        String pos = athlete.getPosition().toString();
        if (pos.equals("Defender")) {
            this.position = Position.DEFENDER;
        } else if (pos.equals("Midfielder")) {
            this.position = Position.MIDFIELDER;
        } else {
            this.position = Position.FORWARD;
        }
    }
}
