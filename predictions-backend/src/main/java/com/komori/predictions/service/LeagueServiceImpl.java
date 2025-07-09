package com.komori.predictions.service;

import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.LeagueRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeagueServiceImpl implements LeagueService {
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;

    @Override
    public void createLeague(String name) {
        String insertGeneratedCodeHere = "";
        LeagueEntity league = LeagueEntity.builder()
                .UUID(UUID.randomUUID().toString())
                .name(name)
                .leagueCode(insertGeneratedCodeHere)
                .build();
        leagueRepository.save(league);
    }

    @Override
    public Set<LeagueEntity> getLeaguesForUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userEntity.getLeagues();
    }
}
