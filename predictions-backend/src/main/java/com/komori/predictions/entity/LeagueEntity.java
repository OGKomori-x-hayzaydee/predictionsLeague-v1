package com.komori.predictions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "league_entity")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeagueEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    private String name;
}
