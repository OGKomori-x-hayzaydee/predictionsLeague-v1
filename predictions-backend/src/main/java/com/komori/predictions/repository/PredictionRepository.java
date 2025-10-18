package com.komori.predictions.repository;

import com.komori.predictions.dto.projection.AccuracyStatsProjection;
import com.komori.predictions.dto.projection.MonthlyPerformanceProjection;
import com.komori.predictions.dto.projection.TeamPerformanceProjection;
import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    List<PredictionEntity> findAllByUser_Email(String userEmail);

    Integer countByUser(UserEntity user);

    @Query(value = """
    SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN p.correct = TRUE THEN 1 ELSE 0 END) AS correct
    FROM predictions p
    WHERE p.user_id = :userId
    """, nativeQuery = true)
    AccuracyStatsProjection getAccuracyStatsByUserId(@Param("userId") Long userId);

    @Query(value = """
    WITH teams AS (
        SELECT 'Arsenal' AS team
            UNION ALL SELECT 'Chelsea'
            UNION ALL SELECT 'Liverpool'
            UNION ALL SELECT 'Man City'
            UNION ALL SELECT 'Man United'
            UNION ALL SELECT 'Tottenham'
    )
    SELECT
            t.team,
            COUNT(p.id) AS total,
            COALESCE(SUM(CASE WHEN p.correct THEN 1 ELSE 0 END),0) AS correct,
            COALESCE(SUM(p.points),0) AS points
    FROM teams t
    LEFT JOIN predictions p
            ON (p.home_team = t.team OR p.away_team = t.team)
    LEFT JOIN users u
            ON p.user_id = u.id
            AND u.email = :email
    GROUP BY t.team
    """, nativeQuery = true)
    List<TeamPerformanceProjection> getTeamPerformanceByEmail(@Param("email") String email);

    @Query(value = """
    WITH months AS (
            SELECT generate_series(1,12) AS month
    )
    SELECT
            m.month,
            COUNT(p.id) AS total,
            COALESCE(SUM(CASE WHEN p.correct THEN 1 ELSE 0 END),0) AS correct,
            COALESCE(SUM(p.points),0) AS points
    FROM months m
    LEFT JOIN predictions p
        ON EXTRACT(MONTH FROM p.date) = m.month
    LEFT JOIN users u
        ON u.id = p.user_id
        AND u.email = :email
    GROUP BY m.month
    ORDER BY m.month
    """, nativeQuery = true)
    List<MonthlyPerformanceProjection> getMonthlyPerformance(@Param("email") String email);

    PredictionEntity findByMatchIdAndUser_Email(Long matchId, String userEmail);

    List<PredictionEntity> findAllByMatchId(Long matchId);
}
