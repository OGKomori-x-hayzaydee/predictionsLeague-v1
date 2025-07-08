package com.komori.predictions.service;

public interface ProfileService {
    void resetPassword(String email);

    void changePassword(String email, String oldPassword, String newPassword);
}
