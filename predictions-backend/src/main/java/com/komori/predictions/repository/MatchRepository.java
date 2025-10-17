package com.komori.predictions.repository;

import com.komori.predictions.entity.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
    MatchEntity findByOldFixtureId(Integer oldFixtureId);
}
