package com.komori.predictions.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer teamId;
    private String tla;
    private String name;
    private Boolean isBigSixTeam;
    @OneToMany(mappedBy = "team")
    private List<PlayerEntity> players;
    private String venue;
}
