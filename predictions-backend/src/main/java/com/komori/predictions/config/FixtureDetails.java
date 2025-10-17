package com.komori.predictions.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
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
            Map.entry("Liverpool", 40),
            Map.entry("Bournemouth", 35),
            Map.entry("Aston Villa", 66),
            Map.entry("Newcastle", 34),
            Map.entry("Brighton Hove", 51),
            Map.entry("Fulham", 36),
            Map.entry("Sunderland", 746),
            Map.entry("West Ham", 48),
            Map.entry("Tottenham", 47),
            Map.entry("Burnley", 44),
            Map.entry("Wolverhampton", 39),
            Map.entry("Man City", 50),
            Map.entry("Nottingham", 65),
            Map.entry("Brentford", 55),
            Map.entry("Chelsea", 49),
            Map.entry("Crystal Palace", 52),
            Map.entry("Man United", 33),
            Map.entry("Arsenal", 42),
            Map.entry("Leeds", 63),
            Map.entry("Everton", 45)
    );
}
