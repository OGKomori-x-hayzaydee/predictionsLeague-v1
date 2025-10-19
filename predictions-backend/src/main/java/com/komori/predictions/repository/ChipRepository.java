package com.komori.predictions.repository;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.entity.ChipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChipRepository extends JpaRepository<ChipEntity, Long> {
    List<ChipEntity> findAllByUser_Email(String userEmail);

    @Modifying
    @Query("""
    update ChipEntity c
        set c.remainingGameweeks = c.remainingGameweeks - 1
        where c.remainingGameweeks > 0
    """)
    void decrementGameweeksRemainingForAllUsers();

    ChipEntity findByUser_EmailAndType(String userEmail, Chip type);
}
