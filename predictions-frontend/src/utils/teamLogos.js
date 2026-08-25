/**
 * Complete Premier League + Championship Team Logo System
 * Handles all clubs with fallbacks and dynamic loading
 *
 * Crest assets are sourced from football-data.org (free tier), whose terms
 * of use explicitly permit displaying the `crest` field returned by their
 * API in apps built on it (unlike scraping Wikipedia's non-free uploads,
 * which are for editorial use on Wikipedia only). Required attribution
 * ("Football data provided by the Football-Data.org API") lives in Footer.jsx.
 */

// Local crest assets (PNG, football-data.org)
import arsenalLogo from "../assets/clubs/arsenal.png";
import astonVillaLogo from "../assets/clubs/astonvilla.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import evertonLogo from "../assets/clubs/everton.png";
import fulhamLogo from "../assets/clubs/fulham.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUnitedLogo from "../assets/clubs/manunited.png";
import newcastleLogo from "../assets/clubs/newcastle.png";
import sunderlandLogo from "../assets/clubs/sunderland.png";
import tottenhamLogo from "../assets/clubs/tottenham.png";
import hullCityLogo from "../assets/clubs/hullcity.png";
import leedsUnitedLogo from "../assets/clubs/leedsunited.png";
import ipswichTownLogo from "../assets/clubs/ipswichtown.png";
import nottinghamForestLogo from "../assets/clubs/nottingham.png";
import crystalPalaceLogo from "../assets/clubs/crystalpalace.png";
import brightonLogo from "../assets/clubs/brightonhove.png";
import brentfordLogo from "../assets/clubs/brentford.png";
import bournemouthLogo from "../assets/clubs/bournemouth.png";
import coventryCityLogo from "../assets/clubs/coventrycity.png";
import blackburnLogo from "../assets/clubs/blackburn.png";
import boltonLogo from "../assets/clubs/bolton.png";
import norwichLogo from "../assets/clubs/norwich.png";
import qprLogo from "../assets/clubs/qpr.png";
import stokeLogo from "../assets/clubs/stoke.png";
import swanseaLogo from "../assets/clubs/swansea.png";
import westBromLogo from "../assets/clubs/westbrom.png";
import wolvesLogo from "../assets/clubs/wolverhampton.png";
import portsmouthLogo from "../assets/clubs/portsmouth.png";
import burnleyLogo from "../assets/clubs/burnley.png";
import birminghamLogo from "../assets/clubs/birmingham.png";
import southamptonLogo from "../assets/clubs/southampton.png";
import derbyCountyLogo from "../assets/clubs/derbycounty.png";
import middlesbroughLogo from "../assets/clubs/middlesbrough.png";
import watfordLogo from "../assets/clubs/watford.png";
import charltonLogo from "../assets/clubs/charlton.png";
import sheffieldUtdLogo from "../assets/clubs/sheffieldutd.png";
import millwallLogo from "../assets/clubs/millwall.png";
import bristolCityLogo from "../assets/clubs/bristolcity.png";
import wrexhamLogo from "../assets/clubs/wrexham.png";
import westHamLogo from "../assets/clubs/westham.png";
import cardiffLogo from "../assets/clubs/cardiff.png";
import prestonNELogo from "../assets/clubs/prestonne.png";
import lincolnCityLogo from "../assets/clubs/lincolncity.png";

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
  "Wolves",
];

export const LOCAL_LOGOS = {
  Arsenal: arsenalLogo,
  "Aston Villa": astonVillaLogo,
  Bournemouth: bournemouthLogo,
  "AFC Bournemouth": bournemouthLogo,
  Brentford: brentfordLogo,
  Brighton: brightonLogo,
  "Brighton Hove": brightonLogo,
  "Brighton & Hove Albion": brightonLogo,
  Burnley: burnleyLogo,
  Chelsea: chelseaLogo,
  "Crystal Palace": crystalPalaceLogo,
  Everton: evertonLogo,
  Fulham: fulhamLogo,
  "Leeds United": leedsUnitedLogo,
  Leeds: leedsUnitedLogo,
  Liverpool: liverpoolLogo,
  "Man City": manCityLogo,
  "Manchester City": manCityLogo,
  "Man United": manUnitedLogo,
  "Manchester United": manUnitedLogo,
  Newcastle: newcastleLogo,
  "Newcastle United": newcastleLogo,
  "Nottingham Forest": nottinghamForestLogo,
  Nottingham: nottinghamForestLogo,
  Southampton: southamptonLogo,
  Sunderland: sunderlandLogo,
  Tottenham: tottenhamLogo,
  "Tottenham Hotspur": tottenhamLogo,
  Spurs: tottenhamLogo,
  "West Ham": westHamLogo,
  "West Ham United": westHamLogo,
  Wolves: wolvesLogo,
  Wolverhampton: wolvesLogo,
  "Wolverhampton Wanderers": wolvesLogo,

  // Championship / other clubs
  "Hull City": hullCityLogo,
  "Coventry City": coventryCityLogo,
  "Ipswich Town": ipswichTownLogo,
  Blackburn: blackburnLogo,
  "Blackburn Rovers": blackburnLogo,
  Bolton: boltonLogo,
  "Bolton Wanderers": boltonLogo,
  Norwich: norwichLogo,
  "Norwich City": norwichLogo,
  QPR: qprLogo,
  "Queens Park Rangers": qprLogo,
  Stoke: stokeLogo,
  "Stoke City": stokeLogo,
  Swansea: swanseaLogo,
  "Swansea City": swanseaLogo,
  "West Brom": westBromLogo,
  "West Bromwich Albion": westBromLogo,
  Portsmouth: portsmouthLogo,
  Birmingham: birminghamLogo,
  "Birmingham City": birminghamLogo,
  "Derby County": derbyCountyLogo,
  Derby: derbyCountyLogo,
  Middlesbrough: middlesbroughLogo,
  Watford: watfordLogo,
  Charlton: charltonLogo,
  "Charlton Athletic": charltonLogo,
  "Sheffield Utd": sheffieldUtdLogo,
  "Sheffield United": sheffieldUtdLogo,
  Millwall: millwallLogo,
  "Bristol City": bristolCityLogo,
  Wrexham: wrexhamLogo,
  Cardiff: cardiffLogo,
  "Cardiff City": cardiffLogo,
  "Preston NE": prestonNELogo,
  "Preston North End": prestonNELogo,
  "Lincoln City": lincolnCityLogo,
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

  // Hull City
  "Hull City": "Hull City",
  "Hull City AFC": "Hull City",
  Hull: "Hull City",

  // Coventry City
  "Coventry City": "Coventry City",
  "Coventry City FC": "Coventry City",
  Coventry: "Coventry City",

  // Ipswich Town
  "Ipswich Town": "Ipswich Town",
  "Ipswich Town FC": "Ipswich Town",
  Ipswich: "Ipswich Town",

  // Other Championship clubs
  Blackburn: "Blackburn",
  "Blackburn Rovers": "Blackburn",
  Bolton: "Bolton",
  "Bolton Wanderers": "Bolton",
  Norwich: "Norwich",
  "Norwich City": "Norwich",
  QPR: "QPR",
  "Queens Park Rangers": "QPR",
  Stoke: "Stoke",
  "Stoke City": "Stoke",
  Swansea: "Swansea",
  "Swansea City": "Swansea",
  "West Brom": "West Brom",
  "West Bromwich Albion": "West Brom",
  Portsmouth: "Portsmouth",
  Birmingham: "Birmingham",
  "Birmingham City": "Birmingham",
  "Derby County": "Derby County",
  Derby: "Derby County",
  Middlesbrough: "Middlesbrough",
  Watford: "Watford",
  Charlton: "Charlton",
  "Charlton Athletic": "Charlton",
  "Sheffield Utd": "Sheffield Utd",
  "Sheffield United": "Sheffield Utd",
  Millwall: "Millwall",
  "Bristol City": "Bristol City",
  Wrexham: "Wrexham",
  Cardiff: "Cardiff",
  "Cardiff City": "Cardiff",
  "Preston NE": "Preston NE",
  "Preston North End": "Preston NE",
  "Lincoln City": "Lincoln City",
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
  "Hull City": "#F18A00",
  "Coventry City": "#78D0F7",
  "Ipswich Town": "#0033A0",
  Blackburn: "#009EE0",
  Bolton: "#8D0E1A",
  Norwich: "#00A650",
  QPR: "#1D5BA4",
  Stoke: "#E03A3E",
  Swansea: "#121212",
  "West Brom": "#122F67",
  Portsmouth: "#001489",
  Birmingham: "#0000FF",
  "Derby County": "#FFFFFF",
  Middlesbrough: "#CC0000",
  Watford: "#FBEE23",
  Charlton: "#D3141C",
  "Sheffield Utd": "#EE2737",
  Millwall: "#001B5A",
  "Bristol City": "#E21C21",
  Wrexham: "#B3131E",
  Cardiff: "#0070B5",
  "Preston NE": "#1B1B1B",
  "Lincoln City": "#E2231A",
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
 * Main function to get team logo
 * Priority: Local Assets > Fallback
 */
export const getTeamLogo = async (teamName, options = {}) => {
  const { size = 64, useFallback = true } = options;

  if (!teamName) {
    return useFallback ? generateFallbackLogo("Unknown", size) : null;
  }

  const normalizedName = normalizeTeamName(teamName);

  if (LOCAL_LOGOS[teamName]) {
    return LOCAL_LOGOS[teamName];
  }

  if (LOCAL_LOGOS[normalizedName]) {
    return LOCAL_LOGOS[normalizedName];
  }

  return useFallback ? generateFallbackLogo(normalizedName, size) : null;
};

/**
 * Sync version that returns immediately available logos
 */
export const getTeamLogoSync = (teamName, options = {}) => {
  const { size = 64, useFallback = true } = options;

  if (!teamName) {
    return useFallback ? generateFallbackLogo("Unknown", size) : null;
  }

  const normalizedName = normalizeTeamName(teamName);

  if (LOCAL_LOGOS[teamName]) {
    return LOCAL_LOGOS[teamName];
  }

  if (LOCAL_LOGOS[normalizedName]) {
    return LOCAL_LOGOS[normalizedName];
  }

  return useFallback ? generateFallbackLogo(normalizedName, size) : null;
};

/**
 * Standard logo size configurations for consistent display
 */
export const LOGO_SIZES = {
  xs: 24, // Mini icons
  sm: 32, // Small contexts
  md: 48, // Default size
  lg: 64, // Large displays
  xl: 96, // Hero sections
};

/**
 * Get standardized CSS classes for logo containers
 * Ensures consistent aspect ratios and prevents layout shifts
 */
export const getLogoContainerClasses = (size = 48) => {
  const baseClasses =
    "flex items-center justify-center flex-shrink-0 overflow-hidden";
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
  TEAM_COLORS,
  LOGO_SIZES,
  getLogoContainerClasses,
  getLogoImageClasses,
};
