package com.komori.predictions.controller;

import com.komori.predictions.dto.response.ChipStatus;
import com.komori.predictions.service.ChipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chips")
@RequiredArgsConstructor
public class ChipController {
    private final ChipService chipService;

    @GetMapping("/status")
    public ResponseEntity<ChipStatus> getChipStatus(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        List<ChipStatus.UserChip> userChipList = chipService.getChipStatusForUser(email);
        return ResponseEntity.ok(new ChipStatus(userChipList));
    }
}
