package com.komori.predictions.service;

import com.komori.predictions.dto.request.CreateLeagueRequest;
import com.komori.predictions.dto.request.UserLeagueActionRequest;
import com.komori.predictions.dto.request.UpdateLeagueRequest;
import com.komori.predictions.dto.response.LeagueOverview;
import com.komori.predictions.dto.response.LeagueStanding;
import com.komori.predictions.entity.LeagueEntity;
import com.komori.predictions.dto.enumerated.Publicity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.entity.UserLeagueEntity;
import com.komori.predictions.exception.LeagueNotFoundException;
import com.komori.predictions.repository.LeagueRepository;
import com.komori.predictions.repository.PredictionRepository;
import com.komori.predictions.repository.UserLeagueRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@SuppressWarnings("DuplicatedCode")
@Service
@RequiredArgsConstructor
public class LeagueService {
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;
    private final UserLeagueRepository userLeagueRepository;
    private final PredictionRepository predictionRepository;

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

        UserLeagueEntity userLeague = new UserLeagueEntity(currentUser, newLeague, true, true);
        userLeagueRepository.save(userLeague);
    }

    @Transactional(readOnly = true)
    public Set<LeagueOverview> getLeagueOverviewForUser(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return Set.copyOf(user.getLeagues().stream()
                .map(UserLeagueEntity::getLeague)
                .map(league -> leagueEntityToCard(league, user))
                .toList());
    }

    public LeagueStanding getLeagueStanding(String email, String uuid) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LeagueEntity league = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        return leagueEntityToStanding(league, user);
    }

    public void joinLeague(String email, String code) {
        LeagueEntity league = leagueRepository.findByLeagueCode(code)
                .orElseThrow(LeagueNotFoundException::new);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserLeagueEntity newEntity = new UserLeagueEntity(user, league, false, false);
        userLeagueRepository.save(newEntity);
    }

    @Transactional
    public void makeUserAdmin(UserLeagueActionRequest request) {
        UserLeagueEntity entity = userLeagueRepository.findByUserUUIDAndLeagueUUID(request.getUserId(), request.getLeagueId())
                        .orElseThrow(() -> new UsernameNotFoundException("User is not in league"));
        entity.setIsAdmin(true);
        userLeagueRepository.save(entity);
    }

    @Transactional
    public void updateLeague(UpdateLeagueRequest request) {
        LeagueEntity league = leagueRepository.findByUUID(request.getId())
                .orElseThrow(LeagueNotFoundException::new);

        league.setName(request.getName());
        league.setDescription(request.getDescription());
        leagueRepository.save(league);
    }

    public void removeUserFromLeague(UserLeagueActionRequest request) {
        UserLeagueEntity entity = userLeagueRepository.findByUserUUIDAndLeagueUUID(request.getUserId(), request.getLeagueId())
                .orElseThrow(() -> new UsernameNotFoundException("User is not in league"));

        userLeagueRepository.delete(entity);
    }

    @Transactional
    public void deleteLeague(String uuid) {
        LeagueEntity league = leagueRepository.findByUUID(uuid)
                .orElseThrow(LeagueNotFoundException::new);

        userLeagueRepository.deleteAllByLeague(league);
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

    private LeagueOverview leagueEntityToCard(LeagueEntity league, UserEntity user) {
        return LeagueOverview.builder()
                .id(league.getUUID())
                .name(league.getName())
                .description(league.getDescription())
                .members(league.getUsers().size())
                .position(userRepository.findUserRankInLeague(user.getId(), league.getId()))
                .points(user.getTotalPoints())
                .joinCode(league.getLeagueCode())
                .isAdmin(userLeagueRepository.isUserAdmin(league.getId(), user.getId()))
                .type(league.getPublicity())
                .createdAt(league.getCreatedAt())
                .build();
    }

    protected LeagueStanding leagueEntityToStanding(LeagueEntity league, UserEntity user) {
        List<UserLeagueEntity> userLeagueEntities = userLeagueRepository.findAllByLeague(league);
        Set<LeagueStanding.LeagueMember> members = new HashSet<>();
        userLeagueEntities.forEach(entity -> {
            LeagueEntity leagueEntity = entity.getLeague();
            UserEntity userEntity = entity.getUser();
            LeagueStanding.LeagueMember member = LeagueStanding.LeagueMember.builder()
                    .id(userEntity.getUUID())
                    .username(userEntity.getUsername())
                    .displayName(userEntity.getFirstName() + " " + userEntity.getLastName())
                    .position(userRepository.findUserRankInLeague(userEntity.getId(), leagueEntity.getId()))
                    .points(userEntity.getTotalPoints())
                    .predictions(predictionRepository.countByUser(user))
                    .joinedAt(entity.getJoinedAt().toInstant())
                    .isCurrentUser(Objects.equals(userEntity.getId(), user.getId()))
                    .isAdmin(entity.getIsAdmin())
                    .build();
            members.add(member);
        });

        return new LeagueStanding(league.getUUID(), members);
    }
}
