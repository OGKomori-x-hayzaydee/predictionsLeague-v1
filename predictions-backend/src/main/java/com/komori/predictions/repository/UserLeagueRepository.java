package com.komori.predictions.repository;

import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.UserLeagueEntity;
import com.komori.predictions.entity.id.UserLeagueId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLeagueRepository extends JpaRepository<UserLeagueEntity, UserLeagueId> {
    @Query(value = """
    select case when count(ul) > 0 then true else false end
    from UserLeagueEntity ul
    where ul.league.id = :leagueId and ul.user.id = :userId and ul.isAdmin = true
    """)
    boolean isUserAdmin(@Param("leagueId") Long leagueId, @Param("userId") Long userId);


    List<UserLeagueEntity> findAllByLeague(LeagueEntity league);
}
