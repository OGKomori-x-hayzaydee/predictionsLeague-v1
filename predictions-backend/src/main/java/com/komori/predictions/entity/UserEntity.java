package com.komori.predictions.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.komori.predictions.dto.enumerated.Team;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
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
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY) @JsonIgnore @Builder.Default
    private List<UserLeagueEntity> leagues = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY) @JsonIgnore @Builder.Default
    private List<PredictionEntity> predictions = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChipEntity> chips;
    @CreationTimestamp @Column(updatable = false)
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;
}
