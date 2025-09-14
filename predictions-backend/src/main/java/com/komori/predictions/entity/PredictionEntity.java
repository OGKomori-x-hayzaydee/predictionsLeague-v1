package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Status;
import com.komori.predictions.dto.enumerated.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
@Table(name = "prediction_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToOne @JoinColumn(name = "user_id")
    private UserEntity user;
    private Long matchId;
    @Enumerated(value = EnumType.STRING)
    private Team homeTeam;
    @Enumerated(value = EnumType.STRING)
    private Team awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private Set<String> homeScorers;
    private Set<String> awayScorers;
    private Boolean correct;
    private Integer points;
    private Status status;
    private Instant date;
    private Integer gameweek;
}
