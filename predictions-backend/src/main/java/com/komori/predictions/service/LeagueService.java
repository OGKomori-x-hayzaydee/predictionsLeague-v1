package com.komori.predictions.service;

import com.komori.predictions.dto.response.LeagueStanding;
import com.komori.predictions.dto.response.LeagueSummary;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.entity.Publicity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.IncorrectLeagueCodeException;
import com.komori.predictions.exception.LeagueAlreadyJoinedException;
import com.komori.predictions.exception.LeagueNotFoundException;
import com.komori.predictions.exception.PublicityMismatchException;
import com.komori.predictions.repository.LeagueRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@SuppressWarnings("DuplicatedCode")
@Service
@RequiredArgsConstructor
public class LeagueService {
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;

    public LeagueStanding getLeagueStandings(String uuid) {
        LeagueEntity newLeague = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        Set<UserEntity> users = newLeague.getUsers();
        Map<String, Integer> usersAndPoints = new HashMap<>();
        users.forEach(
                user -> usersAndPoints.put(user.getFirstName(), user.getTotalPoints())
        );

        return LeagueStanding.builder()
                .leagueName(newLeague.getName())
                .usersAndPoints(usersAndPoints)
                .build();
    }

    public LeagueSummary createLeague(String email, String name, Publicity publicity) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String leagueCode = "";
        if (publicity == Publicity.PRIVATE) {
            do {
                leagueCode = generateLeagueCode();
            } while (leagueRepository.existsByLeagueCode(leagueCode));
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

    public Set<LeagueSummary> getLeaguesForUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return Set.copyOf(userEntity.getLeagues().stream()
                .map(this::leagueEntityToSummary)
                .toList());
    }

    public String joinPublicLeague(String email, String uuid) {
        LeagueEntity newLeague = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        if (newLeague.getPublicity() != Publicity.PUBLIC) {
            throw new PublicityMismatchException();
        }

        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        List<String> emails = newLeague.getUsers().stream().map(UserEntity::getEmail).toList();
        if (emails.contains(email)) {
            throw new LeagueAlreadyJoinedException();
        }

        newLeague.addUser(currentUser);
        leagueRepository.save(newLeague);

        return newLeague.getName();
    }

    public String joinPrivateLeague(String email, String code) {
        LeagueEntity newLeague = leagueRepository.findByLeagueCode(code)
                .orElseThrow(IncorrectLeagueCodeException::new);

        if (!code.equals(newLeague.getLeagueCode())) {
            throw new IncorrectLeagueCodeException();
        }
        if (newLeague.getPublicity() != Publicity.PRIVATE) {
            throw new PublicityMismatchException();
        }

        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        List<String> emails = newLeague.getUsers().stream().map(UserEntity::getEmail).toList();
        if (emails.contains(email)) {
            throw new LeagueAlreadyJoinedException();
        }

        newLeague.addUser(currentUser);
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
