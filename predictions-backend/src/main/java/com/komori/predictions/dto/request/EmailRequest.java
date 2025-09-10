package com.komori.predictions.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {
    private NameAndEmail sender;
    private List<NameAndEmail> to;
    private String subject;
    private String htmlContent;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NameAndEmail {
        private String name;
        private String email;
    }
}
