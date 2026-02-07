package com.komori.predictions.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchdayService {
    private final RedisTemplate<String, Object> redisGeneralTemplate;

    public int getCurrentMatchday() {
        Object value = redisGeneralTemplate.opsForValue().get("currentMatchday");
        if (value instanceof Integer) {
            return (int) value;
        } else if (value instanceof String) {
            return Integer.parseInt((String) value);
        } else {
            log.error("Current matchday not set in Redis");
            throw new RuntimeException("Current matchday not set in Redis");
        }
    }

    public void setCurrentMatchday(int matchday) {
        redisGeneralTemplate.opsForValue().set("currentMatchday", matchday);
    }
}
