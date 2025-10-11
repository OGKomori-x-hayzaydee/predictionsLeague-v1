package com.komori.predictions.controller;

import com.komori.predictions.dto.response.Fixture;
import com.komori.predictions.service.FixtureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/external-fixtures")
@RequiredArgsConstructor
public class FixtureController {
    private final FixtureService fixtureService;

    @GetMapping("/fixtures")
    public ResponseEntity<List<Fixture>> getFixtures() {
        List<Fixture> fixtures = fixtureService.getFixtures();
        return ResponseEntity.ok(fixtures);
    }
}
