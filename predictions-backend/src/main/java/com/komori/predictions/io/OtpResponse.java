package com.komori.predictions.io;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpResponse {
    String email;
    String otpFromUser;
}
