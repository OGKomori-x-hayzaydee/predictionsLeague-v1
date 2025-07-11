package com.komori.predictions.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpResponse {
    String email;
    String otpFromUser;
}
