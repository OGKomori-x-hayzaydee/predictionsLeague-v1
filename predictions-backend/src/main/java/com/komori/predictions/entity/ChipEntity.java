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
    @Builder.Default
    private Integer remainingGameweeks = 0;
    @Builder.Default
    private Integer seasonLimit = 0;
    @Builder.Default
    private Integer seasonUsageCount = 0;
    @Builder.Default
    private Integer lastUsedGameweek = 0;
}
