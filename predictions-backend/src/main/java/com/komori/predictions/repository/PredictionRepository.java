package com.komori.predictions.repository;

import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    Set<PredictionEntity> findAllByUser_Email(String userEmail);

    Integer countByUser(UserEntity user);
}
