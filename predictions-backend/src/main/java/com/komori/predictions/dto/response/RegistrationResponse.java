package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// Represents data being sent from the API
public class RegistrationResponse {
    private String name;
    private String email;
}
