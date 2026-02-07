package com.komori.predictions.repository;

import com.komori.predictions.entity.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
    List<PlayerEntity> findAllByTeam_TeamId(Integer teamTeamId);

    @Query("select p from PlayerEntity p where p.team.teamId in :teamIds")
    List<PlayerEntity> findAllByTeamIds(@Param("teamIds") List<Integer> teamId);
}
