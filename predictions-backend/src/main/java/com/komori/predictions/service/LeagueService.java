package com.komori.predictions.service;

import com.komori.predictions.dto.request.CreateLeagueRequest;
import com.komori.predictions.dto.response.LeagueCard;
import com.komori.predictions.dto.response.LeagueStanding;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.dto.enumerated.Publicity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.entity.UserLeagueEntity;
import com.komori.predictions.exception.IncorrectLeagueCodeException;
import com.komori.predictions.exception.LeagueAlreadyJoinedException;
import com.komori.predictions.exception.LeagueNotFoundException;
import com.komori.predictions.exception.PublicityMismatchException;
import com.komori.predictions.repository.LeagueRepository;
import com.komori.predictions.repository.UserLeagueRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@SuppressWarnings("DuplicatedCode")
@Service
@RequiredArgsConstructor
public class LeagueService {
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;
    private final UserLeagueRepository userLeagueRepository;

    public Set<LeagueCard> getLeagueCardsForUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return Set.copyOf(userEntity.getLeagues().stream()
                .map(league -> leagueEntityToCard(league, userEntity))
                .toList());
    }

    public void createLeague(String email, CreateLeagueRequest request) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String leagueCode = "";
        if (request.getPublicity() == Publicity.PRIVATE) {
            do {
                leagueCode = generateLeagueCode();
            } while (leagueRepository.existsByLeagueCode(leagueCode));
        }

        LeagueEntity newLeague = LeagueEntity.builder()
                .name(request.getName())
                .publicity(request.getPublicity())
                .description(request.getDescription())
                .leagueCode(leagueCode)
                .UUID(UUID.randomUUID().toString())
                .status("Active")
                .build();
        leagueRepository.save(newLeague);

        UserLeagueEntity userLeague = UserLeagueEntity.builder()
                .league(newLeague)
                .user(currentUser)
                .isAdmin(true)
                .isOwner(true)
                .build();
        userLeagueRepository.save(userLeague);
    }

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

    public String joinPublicLeague(String email, String uuid) {
        LeagueEntity newLeague = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        if (newLeague.getPublicity() != Publicity.PUBLIC) {
            throw new PublicityMismatchException();
        }

        @SuppressWarnings("unused") UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        List<String> emails = newLeague.getUsers().stream().map(UserEntity::getEmail).toList();
        if (emails.contains(email)) {
            throw new LeagueAlreadyJoinedException();
        }


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

        @SuppressWarnings("unused") UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        List<String> emails = newLeague.getUsers().stream().map(UserEntity::getEmail).toList();
        if (emails.contains(email)) {
            throw new LeagueAlreadyJoinedException();
        }

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

    private LeagueCard leagueEntityToCard(LeagueEntity league, UserEntity user) {
        return LeagueCard.builder()
                .id(league.getUUID())
                .name(league.getName())
                .description(league.getDescription())
                .memberCount(league.getUsers().size())
                .currentRank(userRepository.findUserRankInLeague(user.getId(), league.getId()))
                .totalPoints(user.getTotalPoints())
                .joinCode(league.getLeagueCode())
                .isOwner(userLeagueRepository.isUserOwner(league.getId(), user.getId()))
                .isAdmin(userLeagueRepository.isUserAdmin(league.getId(), user.getId()))
                .status(league.getStatus())
                .createdAt(league.getCreatedAt())
                .gameweek(4)
                .nextDeadline(Instant.now().plusSeconds(1000000))
                .build();
    }
}
