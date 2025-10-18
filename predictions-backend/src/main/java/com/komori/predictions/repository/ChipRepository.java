package com.komori.predictions.repository;

import com.komori.predictions.entity.ChipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChipRepository extends JpaRepository<ChipEntity, Long> {
    List<ChipEntity> findAllByUser_Email(String userEmail);
}
