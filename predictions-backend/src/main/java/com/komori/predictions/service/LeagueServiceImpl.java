package com.komori.predictions.service;

import com.komori.predictions.dto.LeagueSummary;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.Publicity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.LeagueNotFoundException;
import com.komori.predictions.repository.LeagueRepository;
import com.komori.predictions.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeagueServiceImpl implements LeagueService {
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LeagueSummary createLeague(String email, String name, Publicity publicity) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String leagueCode = generateLeagueCode();
        while (leagueRepository.existsByLeagueCode(leagueCode)) {
            leagueCode = generateLeagueCode();
        }

        LeagueEntity newLeague = new LeagueEntity();
        newLeague.setName(name);
        newLeague.setPublicity(publicity);
        newLeague.setLeagueCode(leagueCode);
        newLeague.setUUID(UUID.randomUUID().toString());
        newLeague.addUser(currentUser);

        LeagueEntity savedLeague = leagueRepository.save(newLeague);

        return leagueEntityToSummary(savedLeague);
    }

    @Override
    public Set<LeagueSummary> getLeaguesForUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return Set.copyOf(userEntity.getLeagues().stream()
                .map(this::leagueEntityToSummary)
                .toList());
    }

    @Override
    public LeagueSummary getLeague(String uuid) {
        LeagueEntity league = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        return leagueEntityToSummary(league);
    }

    @Override
    public String joinLeague(String email, String uuid) {
        LeagueEntity newLeague = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        Set<LeagueEntity> leagues = currentUser.getLeagues();
        leagues.add(newLeague);
        currentUser.setLeagues(leagues);

        Set<UserEntity> users = newLeague.getUsers();
        users.add(currentUser);

        userRepository.save(currentUser);
        leagueRepository.save(newLeague);

        return newLeague.getName();
    }

    private String generateLeagueCode() {
        String chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random random = new Random();
        int l = chars.length();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(l);
            code.append(chars.charAt(index));
        }

        return code.toString();
    }

    private LeagueSummary leagueEntityToSummary(LeagueEntity league) {
        return LeagueSummary.builder()
                .uuid(league.getUUID())
                .name(league.getName())
                .publicity(league.getPublicity())
                .numberOfMembers(league.getUsers().size())
                .build();
    }
}
