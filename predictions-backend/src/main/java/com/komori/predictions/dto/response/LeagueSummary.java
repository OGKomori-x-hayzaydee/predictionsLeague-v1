package com.komori.predictions.dto.response;

import com.komori.predictions.entity.Publicity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueSummary {
    private String uuid;
    private String name;
    private Publicity publicity;
    private int numberOfMembers;
}
