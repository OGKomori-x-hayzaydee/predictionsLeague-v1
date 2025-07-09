package com.komori.predictions.repository;

import com.komori.predictions.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
