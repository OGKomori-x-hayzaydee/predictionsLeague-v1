package com.komori.predictions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "league_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    private String name;
    private String leagueCode;
    @ManyToMany(mappedBy = "leagues")
    private Set<UserEntity> users;
}
