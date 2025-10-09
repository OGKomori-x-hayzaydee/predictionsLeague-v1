package com.komori.predictions.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.dto.response.*;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.PasswordMismatchException;
import com.komori.predictions.repository.PredictionRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    @Value("${aws.s3.bucket}")
    private String bucketName;
    private final AmazonS3 amazonS3;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PredictionRepository predictionRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileOverview viewProfile(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return new ProfileOverview(user);
    }

    public StatsHighlights getStatsHighlights(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return StatsHighlights.builder()
                .bestGameweek(StatsHighlights.StatsHighlightsGameweek.builder()
                        .gameweek("GW1")
                        .points(user.getTotalPoints())
                        .build())
                .mostActiveDay(StatsHighlights.StatsHighlightsDay.builder()
                        .day("Saturday")
                        .percentage(70.0)
                        .build())
                .favoriteFixture(StatsHighlights.StatsHighlightsFixture.builder()
                        .fixture("Arsenal Vs Chelsea")
                        .accuracy(90.0)
                        .build())
                .build();
    }

    public StatsTeamPerformance getTeamPerformance(String email) {
        TeamPerformanceProjection Arsenal = predictionRepository.getTeamPerformanceByEmail(email, Team.ARSENAL);
        TeamPerformanceProjection Chelsea = predictionRepository.getTeamPerformanceByEmail(email, Team.CHELSEA);
        TeamPerformanceProjection ManCity = predictionRepository.getTeamPerformanceByEmail(email, Team.MANCITY);
        TeamPerformanceProjection ManUtd = predictionRepository.getTeamPerformanceByEmail(email, Team.MANCITY);
        TeamPerformanceProjection Liverpool = predictionRepository.getTeamPerformanceByEmail(email, Team.LIVERPOOL);
        TeamPerformanceProjection Spurs = predictionRepository.getTeamPerformanceByEmail(email, Team.SPURS);

        return StatsTeamPerformance.builder()
                .data(List.of(
                        new StatsTeamPerformance.TeamPerformance(Arsenal),
                        new StatsTeamPerformance.TeamPerformance(Chelsea),
                        new StatsTeamPerformance.TeamPerformance(ManCity),
                        new StatsTeamPerformance.TeamPerformance(ManUtd),
                        new StatsTeamPerformance.TeamPerformance(Liverpool),
                        new StatsTeamPerformance.TeamPerformance(Spurs)
                ))
                .build();
    }

    public StatsMonthlyPerformance getMonthlyPerformance(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return StatsMonthlyPerformance.builder()
                .data(List.of(
                        new StatsMonthlyPerformance.MonthlyPerformance("Jan", user.getTotalPoints(), 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Feb", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Mar", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Apr", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("May", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Jun", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Jul", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Aug", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Sep", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Oct", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Nov", 0, 0, 0.0),
                        new StatsMonthlyPerformance.MonthlyPerformance("Dec", 0, 0, 0.0)
                ))
                .build();
    }

    public String setProfilePicture(MultipartFile file, String email) throws IOException {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String key = "profile-pictures/" + currentUser.getUUID() + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3.putObject(new PutObjectRequest(bucketName, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        String url = amazonS3.getUrl(bucketName, key).toString();
        currentUser.setProfilePictureUrl(url);
        userRepository.save(currentUser);
        return url;
    }

    public void resetPassword(String email) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        emailService.sendResetPasswordEmail(email, currentUser.getFirstName());
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new PasswordMismatchException();
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
        emailService.sendChangedPasswordEmail(email, currentUser.getFirstName());
    }
}
