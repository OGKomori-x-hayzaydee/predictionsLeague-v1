package com.komori.predictions.repository;

import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.dto.response.TeamPerformanceProjection;
import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    Set<PredictionEntity> findAllByUser_Email(String userEmail);

    Integer countByUser(UserEntity user);

    @Query("""
    select
        :team as team,
         count(p) as total,
         sum(case when p.correct then 1 else 0 end) as correct,
         sum(p.points) as points
    from PredictionEntity p
    where p.user.email = :email and (p.homeTeam = :team or p.awayTeam = :team)
    """)
    TeamPerformanceProjection getTeamPerformanceByEmail(@Param("email") String email, @Param("team") Team team);
}
