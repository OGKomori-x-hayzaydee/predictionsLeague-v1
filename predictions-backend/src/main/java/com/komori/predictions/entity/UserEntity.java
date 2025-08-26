package com.komori.predictions.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String userID;
    private String firstName;
    private String lastName;
    private String username;
    @Column(unique = true)
    private String email;
    private String password;
    private Boolean accountVerified;
    @Builder.Default
    private int totalPoints = 0;
    @Enumerated(value = EnumType.STRING)
    private Team favouriteTeam;
    @ManyToMany(mappedBy = "users")
    @JsonIgnore @Builder.Default // retains default value (new HashSet instead of null)
    private Set<LeagueEntity> leagues = new HashSet<>();
    @CreationTimestamp @Column(updatable = false)
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;
}
