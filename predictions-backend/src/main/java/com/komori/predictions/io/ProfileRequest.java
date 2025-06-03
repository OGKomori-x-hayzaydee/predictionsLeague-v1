package com.komori.predictions.io;

import lombok.Data;

@Data
// Represents data coming into the API
public class ProfileRequest {
    private String name;
    private String email;
    private String password;
}
