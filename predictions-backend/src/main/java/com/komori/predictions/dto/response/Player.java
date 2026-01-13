package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Position;
import com.komori.predictions.entity.PlayerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private String name;
    private Position position;

    public Player(PlayerEntity entity) {
        this.name = entity.getName();
        this.position = entity.getPosition();
    }
}
