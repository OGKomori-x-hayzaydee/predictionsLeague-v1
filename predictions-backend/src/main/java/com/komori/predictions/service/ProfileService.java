package com.komori.predictions.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.komori.predictions.dto.projection.BestGameweekProjection;
import com.komori.predictions.dto.projection.MonthlyPerformanceProjection;
import com.komori.predictions.dto.projection.MostActiveDayProjection;
import com.komori.predictions.dto.projection.TeamPerformanceProjection;
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
        BestGameweekProjection gameweekProjection = predictionRepository.getBestGameweek(email);
        if (gameweekProjection == null) {
            return StatsHighlights.builder()
                    .bestGameweek(StatsHighlights.StatsHighlightsGameweek.builder()
                            .gameweek("None")
                            .points(0)
                            .build())
                    .mostActiveDay(StatsHighlights.StatsHighlightsDay.builder()
                            .day("None")
                            .percentage(0.0)
                            .build())
                    .favoriteFixture(StatsHighlights.StatsHighlightsFixture.builder()
                            .fixture("None")
                            .accuracy(0.0)
                            .build())
                    .build();
        }

        MostActiveDayProjection dayProjection = predictionRepository.getMostActiveDay(email);
        return StatsHighlights.builder()
                .bestGameweek(StatsHighlights.StatsHighlightsGameweek.builder()
                        .gameweek("GW" + gameweekProjection.getGameweek())
                        .points(gameweekProjection.getPoints())
                        .build())
                .mostActiveDay(StatsHighlights.StatsHighlightsDay.builder()
                        .day(dayProjection.getDay())
                        .percentage(dayProjection.getPercentage())
                        .build())
                .favoriteFixture(StatsHighlights.StatsHighlightsFixture.builder()
                        .fixture("Coming soon")
                        .accuracy(0.0)
                        .build())
                .build();
    }

    public StatsTeamPerformance getTeamPerformance(String email) {
        List<TeamPerformanceProjection> projections = predictionRepository.getTeamPerformanceByEmail(email);

        return StatsTeamPerformance.builder()
                .data(List.of(
                        new StatsTeamPerformance.TeamPerformance(projections.getFirst()),
                        new StatsTeamPerformance.TeamPerformance(projections.get(1)),
                        new StatsTeamPerformance.TeamPerformance(projections.get(2)),
                        new StatsTeamPerformance.TeamPerformance(projections.get(3)),
                        new StatsTeamPerformance.TeamPerformance(projections.get(4)),
                        new StatsTeamPerformance.TeamPerformance(projections.getLast())
                ))
                .build();
    }

    public StatsMonthlyPerformance getMonthlyPerformance(String email) {
        List<MonthlyPerformanceProjection> projections = predictionRepository.getMonthlyPerformance(email);

        return StatsMonthlyPerformance.builder()
                .data(List.of(
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.getFirst()),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(1)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(2)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(3)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(4)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(5)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(6)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(7)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(8)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(9)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.get(10)),
                        new StatsMonthlyPerformance.MonthlyPerformance(projections.getLast())
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
