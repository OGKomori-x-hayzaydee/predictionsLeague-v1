package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Position;
import com.komori.predictions.dto.response.api2.ExternalTeamResponse;
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

    public Player(ExternalTeamResponse.Squad.Player externalPlayer) {
        this.name = externalPlayer.getName();
        this.position = getPositionFromExternalData(externalPlayer.getPosition());
    }

    private Position getPositionFromExternalData(String position) {
        if (position.contains("Defender")) {
            return Position.DEFENDER;
        }
        if (position.contains("Midfield")) {
            return Position.MIDFIELDER;
        }
        return Position.FORWARD;
    }
}
