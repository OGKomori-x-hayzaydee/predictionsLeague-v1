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
import java.util.Set;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    Set<PredictionEntity> findAllByUser_Email(String userEmail);

    Integer countByUser(UserEntity user);

    @Query(value = """
    SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN p.correct = TRUE THEN 1 ELSE 0 END) AS correct
    FROM prediction_entity p
    WHERE p.user_id = :userId
    """, nativeQuery = true)
    AccuracyStatsProjection getAccuracyStatsByUserId(@Param("userId") Long userId);

    @Query(value = """
    SELECT
            t.team,
            COUNT(*) AS total,
            SUM(CASE WHEN p.correct = TRUE THEN 1 ELSE 0 END) AS correct,
            SUM(p.points) AS points
    FROM (
            SELECT 'ARSENAL' AS team
                    UNION ALL SELECT 'CHELSEA'
                    UNION ALL SELECT 'LIVERPOOL'
                    UNION ALL SELECT 'MANCITY'
                    UNION ALL SELECT 'MANUTD'
                    UNION ALL SELECT 'SPURS'
    ) t
    LEFT JOIN prediction_entity p
    ON (p.home_team = t.team OR p.away_team = t.team)
    JOIN user_entity u ON p.user_id = u.id
    WHERE u.email = :email
    GROUP BY t.team
    """, nativeQuery = true)
    List<TeamPerformanceProjection> getTeamPerformanceByEmail(@Param("email") String email);

    @Query(value = """
    SELECT
            EXTRACT(MONTH FROM p.date) AS month,
            COUNT(*) AS total,
            SUM(CASE WHEN p.correct THEN 1 ELSE 0 END) AS correct,
            SUM(p.points) AS points
    FROM prediction_entity p
    JOIN user_entity u ON p.user_id = u.id
    WHERE u.email = :email
    GROUP BY month
    ORDER BY month
    """, nativeQuery = true)
    List<MonthlyPerformanceProjection> getMonthlyPerformance(@Param("email") String email);
}
