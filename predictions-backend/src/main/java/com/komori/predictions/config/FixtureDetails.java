package com.komori.predictions.config;

import com.komori.predictions.service.APIService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class FixtureDetails {
    public static int currentMatchday;
    public static final Set<String> BIG_SIX_TEAMS = Set.of(
            "Man City",
            "Man United",
            "Liverpool",
            "Tottenham",
            "Arsenal",
            "Chelsea"
    );
    public static final Map<String, String> VENUES = Map.ofEntries(
            Map.entry("LIV","Anfield"),
            Map.entry("BOU","Vitality Stadium"),
            Map.entry("AVL","Villa Park"),
            Map.entry("NEW","St James' Park"),
            Map.entry("BHA","Amex Stadium"),
            Map.entry("FUL","Craven Cottage"),
            Map.entry("SUN","Stadium of Light"),
            Map.entry("WHU","London Stadium"),
            Map.entry("TOT","Tottenham Hotspur Stadium"),
            Map.entry("BUR","Turf Moor"),
            Map.entry("WOL","Molineux Stadium"),
            Map.entry("MCI","Etihad Stadium"),
            Map.entry("NOT","The City Ground"),
            Map.entry("BRE","Gtech Community Stadium"),
            Map.entry("CHE","Stamford Bridge"),
            Map.entry("CRY","Selhurst Park"),
            Map.entry("MUN","Old Trafford"),
            Map.entry("ARS","Emirates Stadium"),
            Map.entry("LEE","Elland Road"),
            Map.entry("EVE","Hill Dickinson Stadium")
    );
    public static final Map<String, Integer> TEAM_IDS = Map.ofEntries(
            Map.entry("Liverpool", 84),
            Map.entry("Bournemouth", 3071),
            Map.entry("Aston Villa", 3088),
            Map.entry("Newcastle", 3100),
            Map.entry("Brighton Hove", 3079),
            Map.entry("Fulham", 3085),
            Map.entry("Sunderland", 3111),
            Map.entry("West Ham", 3081),
            Map.entry("Tottenham", 164),
            Map.entry("Burnley", 3075),
            Map.entry("Wolverhampton", 3077),
            Map.entry("Man City", 80),
            Map.entry("Nottingham", 3089),
            Map.entry("Brentford", 3086),
            Map.entry("Chelsea", 88),
            Map.entry("Crystal Palace", 3429),
            Map.entry("Man United", 102),
            Map.entry("Arsenal", 141),
            Map.entry("Leeds", 3103),
            Map.entry("Everton", 3073)
    );

    public FixtureDetails(RedisTemplate<String, Object> redisGeneralTemplate, APIService apiService) {
        Object value = redisGeneralTemplate.opsForValue().get("currentMatchday");
        if (value instanceof Integer) {
            currentMatchday = (int) value;
        } else if (value instanceof String) {
            currentMatchday = Integer.parseInt((String) value);
        } else {
            apiService.setCurrentMatchday();
        }
    }
}
