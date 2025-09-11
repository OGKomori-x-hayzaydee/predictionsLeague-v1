package com.komori.predictions.entity.id;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Embeddable
@EqualsAndHashCode
public class UserLeagueId implements Serializable {
    private Long userId;
    private Long leagueId;
}
