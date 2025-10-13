package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Publicity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "leagues")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    private String name;
    private String description;
    private String leagueCode;
    private String status;
    @Enumerated(value = EnumType.STRING)
    private Publicity publicity;
    @OneToMany(mappedBy = "league") @Builder.Default
    private Set<UserLeagueEntity> users = new HashSet<>();
    @CreationTimestamp
    private Timestamp createdAt;
}
