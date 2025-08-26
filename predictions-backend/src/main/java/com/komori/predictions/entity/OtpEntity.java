package com.komori.predictions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "otp_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String value;
    private Long expiration;
}
