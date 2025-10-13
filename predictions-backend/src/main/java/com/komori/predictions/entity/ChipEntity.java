package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Chip;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChipEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @Enumerated(value = EnumType.STRING)
    private Chip type;
    private Integer cooldownRemaining;
    private Integer lastGameweekUsed;
}
