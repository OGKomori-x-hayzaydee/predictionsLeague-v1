import arsenalLogo from "../assets/clubs/arsenal.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUtdLogo from "../assets/clubs/manutd.png";
import tottenhamLogo from "../assets/clubs/tottenham.png";

// Team logos mapping
export const teamLogos = {
  Arsenal: arsenalLogo,
  Chelsea: chelseaLogo,
  Liverpool: liverpoolLogo,
  "Man. City": manCityLogo,
  "Man. United": manUtdLogo,
  Tottenham: tottenhamLogo,
  "Manchester City": manCityLogo,
  "Manchester United": manUtdLogo,
};

export function getTeamLogo(team) {
  return teamLogos[team] || `https://via.placeholder.com/40?text=${team.substring(0, 3)}`;
}

// Teams list for filtering
export const teams = [
  "Arsenal", 
  "Chelsea", 
  "Liverpool", 
  "Manchester City", 
  "Manchester United", 
  "Tottenham"
];

// Sample fixtures data
export const fixtures = [
  {
    id: 1,
    gameweek: 36,
    homeTeam: "Arsenal",
    awayTeam: "Tottenham",
    date: "2025-05-12T15:00:00",
    venue: "Emirates Stadium",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 2,
    gameweek: 36,
    homeTeam: "Man. City",
    awayTeam: "Man. United",
    date: "2025-05-12T17:30:00",
    venue: "Etihad Stadium",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 3,
    gameweek: 36,
    homeTeam: "Chelsea",
    awayTeam: "Liverpool",
    date: "2025-05-13T20:00:00",
    venue: "Stamford Bridge",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 4,
    gameweek: 37,
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    date: "2025-05-19T15:00:00",
    venue: "Anfield",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 5,
    gameweek: 37,
    homeTeam: "Man. United",
    awayTeam: "Tottenham",
    date: "2025-05-20T20:00:00",
    venue: "Old Trafford",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 6,
    gameweek: 38,
    homeTeam: "Arsenal",
    awayTeam: "Man. City",
    date: "2025-05-26T16:00:00",
    venue: "Emirates Stadium",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 7,
    gameweek: 38,
    homeTeam: "Tottenham",
    awayTeam: "Chelsea",
    date: "2025-05-26T16:00:00",
    venue: "Tottenham Hotspur Stadium",
    competition: "Premier League",
    predicted: false,
  },
  {
    id: 8,
    gameweek: 38,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2025-05-26T16:00:00",
    venue: "Emirates Stadium",
    competition: "Premier League",
    predicted: false,
  }
];

// Sample match data for Matches.jsx
export const matches = [
  {
    id: 1,
    gameweek: 36,
    homeTeam: "Arsenal",
    awayTeam: "Tottenham",
    date: "2025-05-12T15:00:00",
    venue: "Emirates Stadium",
    predicted: true,
    result: null, // null means match hasn't happened yet
    status: "upcoming"
  },
  {
    id: 2,
    gameweek: 36,
    homeTeam: "Manchester City",
    awayTeam: "Manchester United",
    date: "2025-05-12T17:30:00",
    venue: "Etihad Stadium",
    predicted: false,
    result: null,
    status: "upcoming"
  },
  {
    id: 3,
    gameweek: 35,
    homeTeam: "Liverpool",
    awayTeam: "Tottenham",
    date: "2025-05-04T16:30:00",
    venue: "Anfield",
    predicted: true,
    result: { homeGoals: 2, awayGoals: 1 },
    status: "completed"
  },
  {
    id: 4,
    gameweek: 35,
    homeTeam: "Chelsea",
    awayTeam: "Liverpool",
    date: "2025-04-30T19:45:00",
    venue: "Stamford Bridge",
    predicted: false,
    result: { homeGoals: 1, awayGoals: 3 },
    status: "completed"
  },
  {
    id: 5,
    gameweek: 35,
    homeTeam: "Manchester United",
    awayTeam: "Arsenal",
    date: "2025-05-05T20:00:00",
    venue: "Old Trafford",
    predicted: true,
    result: { homeGoals: 1, awayGoals: 2 },
    status: "completed"
  },
  {
    id: 6,
    gameweek: 35,
    homeTeam: "Chelsea",
    awayTeam: "Manchester City",
    date: "2025-05-06T19:45:00",
    venue: "Stamford Bridge",
    predicted: true,
    result: { homeGoals: 0, awayGoals: 0 },
    status: "completed"
  }
];

// Sample gameweeks for filters
export const gameweeks = Array.from({ length: 38 }, (_, i) => i + 1);

// Sample predictions data
export const predictions = [
  {
    id: 1,
    matchId: 101,
    homeTeam: "Arsenal",
    awayTeam: "Tottenham",
    homeScore: 2,
    awayScore: 1,
    actualHomeScore: 2,
    actualAwayScore: 1,
    correct: true,
    points: 12,
    date: "2025-04-22T15:00:00",
    gameweek: 34,
    homeScorers: ["Saka", "Martinelli"],
    awayScorers: ["Son"],
    actualHomeScorers: ["Saka", "Martinelli"],
    actualAwayScorers: ["Son"],
    status: "completed",
    chips: ["defensePlus"]
  },
  {
    id: 2,
    matchId: 102,
    homeTeam: "Chelsea",
    awayTeam: "Man. United",
    homeScore: 0,
    awayScore: 2,
    actualHomeScore: 1,
    actualAwayScore: 1,
    correct: false,
    points: 0,
    date: "2025-04-29T20:00:00",
    gameweek: 35,
    homeScorers: [],
    awayScorers: ["Rashford", "Fernandes"],
    actualHomeScorers: ["Palmer"],
    actualAwayScorers: ["Rashford"],
    status: "completed",
    chips: []
  },
  {
    id: 3,
    matchId: 103,
    homeTeam: "Liverpool",
    awayTeam: "Man. City",
    homeScore: 2,
    awayScore: 2,
    actualHomeScore: 2,
    actualAwayScore: 2,
    correct: true,
    points: 8,
    date: "2025-05-06T17:30:00",
    gameweek: 36,
    homeScorers: ["Salah", "Núñez"],
    awayScorers: ["Haaland", "De Bruyne"],
    actualHomeScorers: ["Díaz", "Núñez"],
    actualAwayScorers: ["Haaland", "Foden"],
    status: "completed",
    chips: ["doublePoints"]
  },
  {
    id: 4,
    matchId: 104,
    homeTeam: "Man. City",
    awayTeam: "Tottenham",
    homeScore: 3,
    awayScore: 1,
    actualHomeScore: null,
    actualAwayScore: null,
    correct: null,
    points: null,
    date: "2025-05-12T20:00:00",
    gameweek: 37,
    homeScorers: ["Haaland", "Haaland", "Foden"],
    awayScorers: ["Son"],
    actualHomeScorers: null,
    actualAwayScorers: null,
    status: "pending",
    chips: []
  },
  {
    id: 5,
    matchId: 105,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeScore: 4,
    awayScore: 2,
    actualHomeScore: null,
    actualAwayScore: null,
    correct: null,
    points: null,
    date: "2025-06-01T17:00:00",
    gameweek: 38,
    homeScorers: ["Saka", "Havertz", "Martinelli", "Ødegaard"],
    awayScorers: ["Palmer", "Jackson"],
    actualHomeScorers: null,
    actualAwayScorers: null,
    status: "pending",
    chips: ["scorerFocus", "wildcard"]
  }
];

// Sample upcoming matches for Dashboard
export const upcomingMatches = [
  {
    id: 1,
    home: "Arsenal",
    away: "Tottenham",
    date: "2025-05-23T15:00:00",
    predicted: false,
  },
  {
    id: 2,
    home: "Man. City",
    away: "Liverpool",
    date: "2025-05-24T17:30:00",
    predicted: true,
  },
  {
    id: 3,
    home: "Chelsea",
    away: "Man United",
    date: "2025-05-12T20:00:00",
    predicted: false,
  }
];

// Sample recent predictions
export const recentPredictions = [
  { id: 1, match: "Man United 3-1 Liverpool", points: 12, correct: true },
  { id: 2, match: "Arsenal 2-1 Chelsea", points: 8, correct: true },
  { id: 3, match: "Man City 1-1 Tottenham", points: 0, correct: false },
];

// Sample leagues
export const leagues = [
  { id: 1, name: "Global League", position: 567, members: 10843 },
  { id: 2, name: "Friends & Family", position: 3, members: 12 },
  { id: 3, name: "Office Rivalry", position: 1, members: 8 },
];

// How it works steps
export const howItWorksSteps = [
  {
    number: "01",
    title: "sign up",
    description:
      "create your account and set up your profile with your favorite team and preferences.",
  },
  {
    number: "02",
    title: "make predictions",
    description:
      "predict the outcomes of matches involving the 'Big Six' teams, including scorelines and goalscorers.",
  },
  {
    number: "03",
    title: "use chips strategically",
    description:
      "deploy special chips like Double Down and Wildcard at the right moments to maximize your points.",
  },
  {
    number: "04",
    title: "follow live updates",
    description:
      "watch your predictions come to life with real-time updates during matches.",
  },
  {
    number: "05",
    title: "compete in leagues",
    description:
      "join public leagues or create private ones to compete with friends and fellow fans.",
  },
  {
    number: "06",
    title: "win seasonal awards",
    description:
      "earn prestigious awards based on your prediction accuracy throughout the season.",
  }
];

// Features for Why Join component
export const features = [
  {
    title: "'Big Six' focus",
    description:
      "concentrate on the most exciting matches featuring Manchester United, Manchester City, Liverpool, Chelsea, Arsenal, and Tottenham.",
  },
  {
    title: "multi-dimensional scoring",
    description:
      "earn points for correct winners, exact scores, goalscorers, and special events like clean sheets and comebacks.",
  },
  {
    title: "strategic gameplay",
    description:
      "use special 'chips' like Double Down, Wildcard, and All-In Week to maximize your points at crucial moments.",
  },
  {
    title: "private leagues",
    description:
      "create private leagues to compete with friends, family, or colleagues in your own exclusive competition.",
  },
  {
    title: "real-time updates",
    description:
      "experience the excitement of live score updates and see your points change as matches unfold.",
  },
  {
    title: "seasonal awards",
    description:
      "compete for prestigious end-of-season awards like Prediction Champion, Oracle Award, and Goalscorer Guru.",
  }
];

// Footer sections
export const footerSections = [
  {
    title: "quick links",
    links: [
      { text: "home", url: "/" },
      { text: "predictions", url: "/predictions" },
      { text: "leaderboard", url: "/leaderboard" },
      { text: "how to play", url: "/how-to-play" },
    ],
  },
  {
    title: "resources",
    links: [
      { text: "FAQ", url: "/faq" },
      { text: "rules", url: "/rules" },
      { text: "support", url: "/support" },
      { text: "blog", url: "/blog" },
    ],
  },
  {
    title: "legal",
    links: [
      { text: "terms of service", url: "/terms-of-service" },
      { text: "privacy policy", url: "/privacy-policy" },
      { text: "cookie policy", url: "/cookie-policy" },
    ],
  }
];

export const upcomingFixtures = [
  { id: 1, home: "Man United", away: "Newcastle", date: "2025-05-15T15:00:00", predicted: false, competition: "Premier League", homeImg: "", awayImg: "", deadline: "2025-05-15T13:00:00" },
  { id: 2, home: "Arsenal", away: "Everton", date: "2025-05-15T17:30:00", predicted: true, competition: "Premier League", homeImg: "", awayImg: "", deadline: "2025-05-15T15:30:00" },
  { id: 3, home: "Liverpool", away: "West Ham", date: "2025-05-16T20:00:00", predicted: false, competition: "Premier League", homeImg: "", awayImg: "", deadline: "2025-05-16T18:00:00" },
  { id: 4, home: "Brighton", away: "Fulham", date: "2025-05-17T15:00:00", predicted: false, competition: "Premier League", homeImg: "", awayImg: "", deadline: "2025-05-17T13:00:00" }
];

// Sample league data for development purposes
export const getSampleLeague = (leagueId) => {
  return {
    id: leagueId,
    name: `League ${leagueId}`,
    type: "private",
    description: "This league is for friends and family to compete in Premier League predictions",
    members: 12,
    position: 3,
    points: 453,
    pointsLeader: 478,
    lastUpdate: "2025-05-15T14:30:00",
    isAdmin: parseInt(leagueId) % 2 === 0, // Just for testing - every even ID is admin
    leaderboard: [
      { id: 1, name: "Jane Smith", points: 478, position: 1, trend: "up", avatar: null },
      { id: 2, name: "John Doe", points: 467, position: 2, trend: "same", avatar: null },
      { id: 3, name: "Current User", points: 453, position: 3, trend: "down", avatar: null, isCurrentUser: true },
      { id: 4, name: "Mike Jones", points: 432, position: 4, trend: "up", avatar: null },
      { id: 5, name: "Sarah Williams", points: 418, position: 5, trend: "down", avatar: null },
      { id: 6, name: "Robert Chen", points: 405, position: 6, trend: "up", avatar: null },
      { id: 7, name: "Emma Wilson", points: 398, position: 7, trend: "down", avatar: null },
      { id: 8, name: "David Clark", points: 382, position: 8, trend: "same", avatar: null },
    ]
  };
};