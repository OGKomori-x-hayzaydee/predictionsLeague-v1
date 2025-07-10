package com.komori.predictions.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
// Represents data coming into the API
public class RegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
