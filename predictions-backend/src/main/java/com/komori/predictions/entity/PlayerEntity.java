package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Position;
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
    private String name;
    @ManyToOne @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;
    @Enumerated(value = EnumType.STRING)
    private Position position;
}
