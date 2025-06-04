package com.komori.predictions.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
// Represents data coming into the API
public class ProfileRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;
    @Email(message = "Enter valid email address")
    @NotBlank(message = "Enter an email address")
    private String email;
    private String password;
}
