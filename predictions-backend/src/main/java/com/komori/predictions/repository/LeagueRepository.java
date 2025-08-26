package com.komori.predictions.repository;

import com.komori.predictions.entity.LeagueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeagueRepository extends JpaRepository<LeagueEntity, Long> {
    Optional<LeagueEntity> findByUUID(String uuid);
    boolean existsByLeagueCode(String code);
    Optional<LeagueEntity> findByLeagueCode(String code);
}
