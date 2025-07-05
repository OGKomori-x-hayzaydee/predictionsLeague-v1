package com.komori.predictions.io;

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
    private String userID;
    private String name;
    private String email;
    private Boolean accountVerified;
}
