package com.komori.predictions.repository;

import com.komori.predictions.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

    Boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query(value = """
    SELECT rank FROM (
            SELECT id, RANK() OVER (ORDER BY user_entity.total_points DESC) AS rank
                FROM user_entity
        ) sub
    WHERE id = :id
    """, nativeQuery = true)
    Integer findUserRank(@Param("id") Long id);

    @Query(value = """
    SELECT rank FROM (
            SELECT u.id, RANK() OVER (ORDER BY u.total_points DESC) AS rank
            FROM user_entity AS u
            JOIN user_league_table AS ult on u.id = ult.user_id
            WHERE ult.league_id = :leagueId
        ) sub
    WHERE id = :userId
    """, nativeQuery = true)
    Integer findUserRankInLeague(@Param(("userId")) Long userId, @Param("leagueId") Long leagueId);
}
