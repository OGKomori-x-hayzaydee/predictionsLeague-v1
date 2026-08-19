package com.komori.predictions.repository;

import com.komori.predictions.entity.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    TeamEntity findByTeamId(Integer teamId);
}
