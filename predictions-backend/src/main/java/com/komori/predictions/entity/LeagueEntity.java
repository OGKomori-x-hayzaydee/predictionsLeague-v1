package com.komori.predictions.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "league_entity")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String UUID;
    private String name;
    private String leagueCode;
    @Enumerated(value = EnumType.STRING)
    private Publicity publicity;
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "user_league_table",
            joinColumns = @JoinColumn(name = "league_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    ) @Builder.Default // retains default value (new HashSet instead of null)
    private Set<UserEntity> users = new HashSet<>();

    public void addUser(UserEntity userEntity) {
        this.users.add(userEntity);
        userEntity.getLeagues().add(this);
    }
}
