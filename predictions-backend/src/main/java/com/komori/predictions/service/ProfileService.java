package com.komori.predictions.service;

import com.komori.predictions.io.ProfileRequest;
import com.komori.predictions.io.ProfileResponse;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest profileRequest);

    ProfileResponse getProfile(String email);
}
