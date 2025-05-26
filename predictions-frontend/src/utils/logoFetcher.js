// Script to fetch and cache all Premier League team logos
// This can be used to bootstrap the app or refresh logo cache manually

import { saveLogosToCache, preloadTeamLogos } from '../utils/logoCache';
import { normalizeTeamName } from '../utils/teamUtils';
import { teams } from '../data/sampleData';

/**
 * Fetch all PL team logos and store them in cache
 */
export const fetchAllTeamLogos = async () => {
  console.log('Fetching all Premier League team logos...');

  try {
    // Use sample data for teams
    const allTeams = teams.map((team) => ({
      name: team,
      shortName: team,
      crest: `https://via.placeholder.com/40?text=${team.substring(0, 3)}`,
    }));

    if (!allTeams || allTeams.length === 0) {
      console.error('Failed to fetch teams');
      return false;
    }

    console.log(`Successfully fetched ${allTeams.length} teams`);

    // Create mapping of team names to their logo URLs
    const logoMapping = {};

    allTeams.forEach((team) => {
      const name = team.name;
      const shortName = team.shortName;
      const crestUrl = team.crest;

      if (!crestUrl) {
        console.warn(`No logo URL for team ${name}`);
        return;
      }

      // Store the original name
      logoMapping[name] = crestUrl;

      // Also store the short name
      if (shortName && shortName !== name) {
        logoMapping[shortName] = crestUrl;
      }

      // Also store without "FC" if applicable
      if (name.endsWith(' FC')) {
        logoMapping[name.replace(' FC', '')] = crestUrl;
      }

      // Store normalized name
      const normalized = normalizeTeamName(name);
      if (normalized !== name) {
        logoMapping[normalized] = crestUrl;
      }

      console.log(`✓ Added logo for ${name}`);
    });

    // Save to cache
    const success = saveLogosToCache(logoMapping);

    if (success) {
      // Preload images
      preloadTeamLogos(logoMapping);
      console.log(`Successfully saved logos for ${Object.keys(logoMapping).length} team name variations`);
      return true;
    } else {
      console.error('Failed to save logo cache');
      return false;
    }
  } catch (error) {
    console.error('Error fetching team logos:', error);
    return false;
  }
};

// No need to export default as we're exporting the function directly
