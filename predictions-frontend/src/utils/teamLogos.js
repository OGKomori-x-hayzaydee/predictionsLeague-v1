/**
 * Complete Premier League Team Logo System
 * Handles all 20 teams with fallbacks and dynamic loading
 */

// Available team logos (SVG format)
import arsenalLogo from "../assets/clubs/arsenal.svg";
import chelseaLogo from "../assets/clubs/chelsea.svg";
import liverpoolLogo from "../assets/clubs/liverpool.svg";
import manCityLogo from "../assets/clubs/mancity.svg";
import manUtdLogo from "../assets/clubs/manutd.svg";
import tottenhamLogo from "../assets/clubs/spurs.svg";
import bournemouthLogo from "../assets/clubs/bournemouth.svg";
import brentfordLogo from "../assets/clubs/brentford.svg";
import brightonLogo from "../assets/clubs/brighton.svg";
import crystalpalaceLogo from "../assets/clubs/crystalpalace.svg";
import evertonLogo from "../assets/clubs/everton.svg";
import fulhamLogo from "../assets/clubs/fulham.svg";
import leedsLogo from "../assets/clubs/leeds.svg";
import newcastleLogo from "../assets/clubs/newcastle.svg";
import nottinghamforestLogo from "../assets/clubs/nottinghamforest.svg";
import southamptonLogo from "../assets/clubs/southampton.svg";
import westhamLogo from "../assets/clubs/westham.svg";
import wolvesLogo from "../assets/clubs/wolves.svg";
import astonvillaLogo from "../assets/clubs/astonvilla.svg";
import burnleyLogo from "../assets/clubs/burnley.svg";

// Complete list of Premier League teams
export const PREMIER_LEAGUE_TEAMS = [
  "Arsenal",
  "Aston Villa", 
  "Bournemouth",
  "Brentford",
  "Brighton",
  "Burnley",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Leeds United",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Newcastle",
  "Nottingham Forest",
  "Southampton",
  "Tottenham",
  "West Ham",
  "Wolves"
];

export const LOCAL_LOGOS = {
  // Existing logos (will be replaced with consistent versions)
  "Arsenal": arsenalLogo,
  "Chelsea": chelseaLogo,
  "Liverpool": liverpoolLogo,
  "Man City": manCityLogo,
  "Manchester City": manCityLogo,
  "Man United": manUtdLogo,
  "Manchester United": manUtdLogo,
  "Tottenham": tottenhamLogo,
  "Tottenham Hotspur": tottenhamLogo,
  "Spurs": tottenhamLogo,
  "Aston Villa": astonvillaLogo,
  "Bournemouth": bournemouthLogo,
  "AFC Bournemouth": bournemouthLogo,
  "Brentford": brentfordLogo,
  "Brighton": brightonLogo,
  "Brighton Hove": brightonLogo,
  "Brighton & Hove Albion": brightonLogo,
  "Burnley": burnleyLogo,
  "Crystal Palace": crystalpalaceLogo,
  "Everton": evertonLogo,
  "Fulham": fulhamLogo,
  "Leeds United": leedsLogo,
  "Leeds": leedsLogo,
  "Newcastle": newcastleLogo,
  "Newcastle United": newcastleLogo,
  "Nottingham": nottinghamforestLogo,
  "Nottingham Forest": nottinghamforestLogo,
  "Southampton": southamptonLogo,
  "West Ham": westhamLogo,
  "West Ham United": westhamLogo,
  "Wolves": wolvesLogo,
  "Wolverhampton": wolvesLogo,
  "Wolverhampton Wanderers": wolvesLogo
};

/**
 * Team name normalization mapping
 * Maps various API formats to standardized names
 */
export const TEAM_NAME_MAPPING = {
  // Arsenal
  Arsenal: "Arsenal",
  "Arsenal FC": "Arsenal",
  ARSENAL: "Arsenal",

  // Aston Villa
  "Aston Villa": "Aston Villa",
  "Aston Villa FC": "Aston Villa",
  Villa: "Aston Villa",

  // Bournemouth
  Bournemouth: "Bournemouth",
  "AFC Bournemouth": "Bournemouth",
  "Bournemouth FC": "Bournemouth",

  // Brentford
  Brentford: "Brentford",
  "Brentford FC": "Brentford",

  // Brighton
  "Brighton Hove": "Brighton",
  "Brighton & Hove Albion": "Brighton",
  Brighton: "Brighton",
  "Brighton FC": "Brighton",

  // Burnley
  Burnley: "Burnley",
  "Burnley FC": "Burnley",

  // Chelsea
  Chelsea: "Chelsea",
  "Chelsea FC": "Chelsea",
  CHELSEA: "Chelsea",

  // Crystal Palace
  "Crystal Palace": "Crystal Palace",
  "Crystal Palace FC": "Crystal Palace",
  Palace: "Crystal Palace",

  // Everton
  Everton: "Everton",
  "Everton FC": "Everton",

  // Fulham
  Fulham: "Fulham",
  "Fulham FC": "Fulham",

  // Leeds United
  "Leeds United": "Leeds United",
  Leeds: "Leeds United",
  LUFC: "Leeds United",

  // Liverpool
  Liverpool: "Liverpool",
  "Liverpool FC": "Liverpool",
  LIVERPOOL: "Liverpool",
  LFC: "Liverpool",

  // Manchester City
  "Man City": "Manchester City",
  "Man. City": "Manchester City",
  "Manchester City": "Manchester City",
  "Manchester City FC": "Manchester City",
  MCFC: "Manchester City",
  City: "Manchester City",

  // Manchester United
  "Man United": "Manchester United",
  "Man. United": "Manchester United",
  "Manchester United": "Manchester United",
  "Manchester United FC": "Manchester United",
  MUFC: "Manchester United",
  United: "Manchester United",

  // Newcastle
  Newcastle: "Newcastle",
  "Newcastle United": "Newcastle",
  "Newcastle FC": "Newcastle",
  NUFC: "Newcastle",

  // Nottingham Forest
  Nottingham: "Nottingham Forest",
  "Nottingham Forest": "Nottingham Forest",
  Forest: "Nottingham Forest",
  NFFC: "Nottingham Forest",

  // Southampton
  Southampton: "Southampton",
  "Southampton FC": "Southampton",
  Saints: "Southampton",

  // Sunderland
  Sunderland: "Sunderland",
  "Sunderland AFC": "Sunderland",
  SAFC: "Sunderland",

  // Tottenham
  Tottenham: "Tottenham",
  "Tottenham Hotspur": "Tottenham",
  "Tottenham Hotspur FC": "Tottenham",
  Spurs: "Tottenham",
  THFC: "Tottenham",

  // West Ham
  "West Ham": "West Ham",
  "West Ham United": "West Ham",
  "West Ham FC": "West Ham",
  WHUFC: "West Ham",
  Hammers: "West Ham",

  // Wolverhampton
  Wolverhampton: "Wolves",
  "Wolverhampton Wanderers": "Wolves",
  Wolves: "Wolves",
  WWFC: "Wolves",
};

/**
 * Team colors for fallback generation
 */
export const TEAM_COLORS = {
  Arsenal: "#DC143C",
  "Aston Villa": "#95BFE5",
  Bournemouth: "#DA020E",
  Brentford: "#E30613",
  Brighton: "#0057B8",
  Burnley: "#6C1D45",
  Chelsea: "#034694",
  "Crystal Palace": "#1B458F",
  Everton: "#003399",
  Fulham: "#000000",
  "Leeds United": "#FFCD00",
  Liverpool: "#C8102E",
  "Manchester City": "#6CABDD",
  "Manchester United": "#DA020E",
  Newcastle: "#241F20",
  "Nottingham Forest": "#DD0000",
  Southampton: "#D71920",
  Sunderland: "#EB172B",
  Tottenham: "#132257",
  "West Ham": "#7A263A",
  Wolves: "#FDB626",
};

/**
 * Normalize team name to standard format
 */
export const normalizeTeamName = (teamName) => {
  if (!teamName) return "Unknown";
  return TEAM_NAME_MAPPING[teamName] || teamName;
};

/**
 * Generate a fallback logo URL for teams without local assets
 */
export const generateFallbackLogo = (teamName, size = 64) => {
  const normalizedName = normalizeTeamName(teamName);
  const color = TEAM_COLORS[normalizedName] || "#666666";
  const initials = normalizedName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 3);

  // Use a logo generation service or create SVG data URL
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${
    size / 2
  }" fill="${color}"/>
      <text x="${size / 2}" y="${
    size / 2 + 5
  }" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${
    size / 4
  }" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * High-quality external logo URLs for teams without local assets
 * Using reliable sources with HTTPS and proper CORS headers
 */
export const EXTERNAL_LOGO_URLS = {
  // Premier League Official Badge URLs (more reliable)
  "Aston Villa":
    "https://resources.premierleague.com/premierleague/badges/rb/t7.svg",
  Bournemouth:
    "https://resources.premierleague.com/premierleague/badges/rb/t91.svg",
  Brentford:
    "https://resources.premierleague.com/premierleague/badges/rb/t94.svg",
  Brighton:
    "https://resources.premierleague.com/premierleague/badges/rb/t36.svg",
  Burnley:
    "https://resources.premierleague.com/premierleague/badges/rb/t90.svg",
  "Crystal Palace":
    "https://resources.premierleague.com/premierleague/badges/rb/t31.svg",
  Everton:
    "https://resources.premierleague.com/premierleague/badges/rb/t11.svg",
  Fulham: "https://resources.premierleague.com/premierleague/badges/rb/t54.svg",
  "Leeds United":
    "https://resources.premierleague.com/premierleague/badges/rb/t2.svg",
  "Leicester City":
    "https://resources.premierleague.com/premierleague/badges/rb/t13.svg",
  Newcastle:
    "https://resources.premierleague.com/premierleague/badges/rb/t4.svg",
  "Nottingham Forest":
    "https://resources.premierleague.com/premierleague/badges/rb/t17.svg",
  "Sheffield United":
    "https://resources.premierleague.com/premierleague/badges/rb/t49.svg",
  Southampton:
    "https://resources.premierleague.com/premierleague/badges/rb/t20.svg",
  Watford:
    "https://resources.premierleague.com/premierleague/badges/rb/t57.svg",
  "West Ham":
    "https://resources.premierleague.com/premierleague/badges/rb/t21.svg",
  Wolves: "https://resources.premierleague.com/premierleague/badges/rb/t39.svg",

  // Fallback URLs for teams not in current PL (Championship teams that might get promoted)
  Sunderland:
    "https://upload.wikimedia.org/wikipedia/en/7/77/Logo_Sunderland.svg",
  "Norwich City":
    "https://upload.wikimedia.org/wikipedia/en/8/8c/Norwich_City.svg",
  "Blackburn Rovers":
    "https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg",
};

/**
 * Main function to get team logo
 * Priority: Local Assets > Cached External > External URLs > Fallback
 */
export const getTeamLogo = async (teamName, options = {}) => {
  const { size = 64, preferLocal = true, useFallback = true } = options;

  if (!teamName) {
    return useFallback ? generateFallbackLogo("Unknown", size) : null;
  }

  const normalizedName = normalizeTeamName(teamName);

  // 1. Try local assets first
  if (preferLocal && LOCAL_LOGOS[teamName]) {
    return LOCAL_LOGOS[teamName];
  }

  if (preferLocal && LOCAL_LOGOS[normalizedName]) {
    return LOCAL_LOGOS[normalizedName];
  }

  // 2. Try external URLs
  if (EXTERNAL_LOGO_URLS[normalizedName]) {
    try {
      // Test if the external URL is accessible
      const response = await fetch(EXTERNAL_LOGO_URLS[normalizedName], {
        method: "HEAD",
      });
      if (response.ok) {
        return EXTERNAL_LOGO_URLS[normalizedName];
      }
    } catch (error) {
      console.warn(`External logo failed for ${normalizedName}:`, error);
    }
  }

  // 3. Generate fallback
  return useFallback ? generateFallbackLogo(normalizedName, size) : null;
};

/**
 * Sync version that returns immediately available logos
 */
export const getTeamLogoSync = (teamName, options = {}) => {
  const { size = 64, preferLocal = true, useFallback = true } = options;

  if (!teamName) {
    return useFallback ? generateFallbackLogo("Unknown", size) : null;
  }

  const normalizedName = normalizeTeamName(teamName);

  // Try local assets
  if (preferLocal && LOCAL_LOGOS[teamName]) {
    return LOCAL_LOGOS[teamName];
  }

  if (preferLocal && LOCAL_LOGOS[normalizedName]) {
    return LOCAL_LOGOS[normalizedName];
  }

  // Try external URLs (optimistic)
  if (EXTERNAL_LOGO_URLS[normalizedName]) {
    return EXTERNAL_LOGO_URLS[normalizedName];
  }

  // Generate fallback
  return useFallback ? generateFallbackLogo(normalizedName, size) : null;
};

/**
 * Standard logo size configurations for consistent display
 */
export const LOGO_SIZES = {
  xs: 24,      // Mini icons
  sm: 32,      // Small contexts
  md: 48,      // Default size
  lg: 64,      // Large displays
  xl: 96,      // Hero sections
};

/**
 * Get standardized CSS classes for logo containers
 * Ensures consistent aspect ratios and prevents layout shifts
 */
export const getLogoContainerClasses = (size = 48) => {
  const baseClasses = "flex items-center justify-center flex-shrink-0 overflow-hidden";
  const roundingClass = size <= 32 ? "rounded" : "rounded-lg";
  
  return `${baseClasses} ${roundingClass}`;
};

/**
 * Get standardized CSS classes for logo images
 * Maintains aspect ratio while fitting within container
 */
export const getLogoImageClasses = (theme = "light") => {
  const baseClasses = "max-w-full max-h-full object-contain";
  const themeClasses = theme === "dark" ? "filter brightness-110" : "";
  
  return `${baseClasses} ${themeClasses}`.trim();
};

/**
 * Preload all team logos for better performance
 */
export const preloadAllLogos = async () => {
  const logoPromises = PREMIER_LEAGUE_TEAMS.map(async (team) => {
    try {
      const logo = await getTeamLogo(team);
      return { team, logo, success: true };
    } catch (error) {
      return { team, error: error.message, success: false };
    }
  });

  const results = await Promise.allSettled(logoPromises);
  console.log("Logo preload results:", results);

  return results;
};

export default {
  getTeamLogo,
  getTeamLogoSync,
  normalizeTeamName,
  generateFallbackLogo,
  preloadAllLogos,
  PREMIER_LEAGUE_TEAMS,
  LOCAL_LOGOS,
  EXTERNAL_LOGO_URLS,
  TEAM_COLORS,
  LOGO_SIZES,
  getLogoContainerClasses,
  getLogoImageClasses,
};
