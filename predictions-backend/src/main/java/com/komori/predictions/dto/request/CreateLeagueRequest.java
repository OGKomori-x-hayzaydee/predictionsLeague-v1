package com.komori.predictions.dto.request;

import com.komori.predictions.entity.Publicity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLeagueRequest {
    private String name;
    private Publicity publicity;
}
