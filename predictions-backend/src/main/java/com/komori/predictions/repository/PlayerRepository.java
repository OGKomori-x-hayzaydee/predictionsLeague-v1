package com.komori.predictions.repository;

import com.komori.predictions.entity.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
    List<PlayerEntity> findAllByTeam_TeamIdIn(Collection<Integer> team_teamId);

    List<PlayerEntity> findAllByTeam_TeamId(Integer teamTeamId);
}
