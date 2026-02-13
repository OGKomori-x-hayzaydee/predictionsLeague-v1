package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Position;
import com.komori.predictions.dto.response.fpl.Squad;
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

    public PlayerEntity(Squad.Player player, TeamEntity teamEntity) {
        this.playerId = player.getId();
        this.name = player.getWebName();
        this.team = teamEntity;
        int pos = player.getElementType();
        if (pos == 2) {
            this.position = Position.DEFENDER;
        } else if (pos == 3) {
            this.position = Position.MIDFIELDER;
        } else {
            this.position = Position.FORWARD;
        }
    }
}
