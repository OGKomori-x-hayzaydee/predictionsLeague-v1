package com.komori.predictions.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.komori.predictions.dto.enumerated.Team;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_entity")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    private String firstName;
    private String lastName;
    private String username;
    @Column(unique = true)
    private String email;
    private String password;
    private String profilePictureUrl;
    private Boolean accountVerified;
    @Builder.Default
    private int totalPoints = 0;
    @Enumerated(value = EnumType.STRING)
    private Team favouriteTeam;
    @OneToMany(mappedBy = "user") @JsonIgnore @Builder.Default // retains default value (new HashSet instead of null)
    private Set<UserLeagueEntity> leagues = new HashSet<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore @Builder.Default
    private Set<PredictionEntity> predictions = new HashSet<>();
    @CreationTimestamp @Column(updatable = false)
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;
}
