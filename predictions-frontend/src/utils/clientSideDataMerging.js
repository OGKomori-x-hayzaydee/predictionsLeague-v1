/**
 * Client-Side Data Merging Utilities
 * Combines external fixtures data with user prediction data
 */

/**
 * Fixture matching utilities
 */
export const fixtureMatching = {
  /**
   * Generate a unique key for fixture matching
   * @param {Object} fixture - Fixture object
   * @returns {string} Unique fixture key
   */
  generateFixtureKey(fixture) {
    // Normalize team names for consistent matching
    const normalizeTeam = (team) => {
      return team
        .toLowerCase()
        .replace(/\./g, '') // Remove dots
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^a-z0-9_]/g, ''); // Remove special characters
    };

    const homeTeam = normalizeTeam(fixture.homeTeam || fixture.home || '');
    const awayTeam = normalizeTeam(fixture.awayTeam || fixture.away || '');
    const date = fixture.date ? new Date(fixture.date).toISOString().split('T')[0] : '';

    return `${homeTeam}_${awayTeam}_${date}`;
  },

  /**
   * Check if two fixtures represent the same match
   * @param {Object} externalFixture - Fixture from external API
   * @param {Object} userPrediction - User prediction object
   * @returns {boolean} Whether fixtures match
   */
  fixturesMatch(externalFixture, userPrediction) {
    // PRIMARY MATCHING: Match by fixture ID / matchId (most reliable)
    if (externalFixture.id && userPrediction.matchId) {
      if (externalFixture.id === userPrediction.matchId) {
        return true;
      }
    }

    // SECONDARY MATCHING: Match by fixture key
    const externalKey = this.generateFixtureKey(externalFixture);
    const predictionKey = this.generateFixtureKey(userPrediction);
    
    if (externalKey === predictionKey) {
      return true;
    }

    // Secondary matching by date proximity and team names
    const externalDate = new Date(externalFixture.date);
    const predictionDate = new Date(userPrediction.matchDate || userPrediction.date);
    const timeDiff = Math.abs(externalDate - predictionDate);
    const maxTimeDiff = 24 * 60 * 60 * 1000; // 24 hours

    if (timeDiff <= maxTimeDiff) {
      const externalHome = (externalFixture.homeTeam || externalFixture.home || '').toLowerCase();
      const externalAway = (externalFixture.awayTeam || externalFixture.away || '').toLowerCase();
      const predictionHome = (userPrediction.homeTeam || userPrediction.home || '').toLowerCase();
      const predictionAway = (userPrediction.awayTeam || userPrediction.away || '').toLowerCase();

      // Check for exact team name matches
      if (externalHome.includes(predictionHome.split(' ')[0]) && 
          externalAway.includes(predictionAway.split(' ')[0])) {
        return true;
      }

      // Check for team name aliases - focused on our target teams
      const teamAliases = {
        'chelsea': ['chelsea', 'chelsea fc'],
        'arsenal': ['arsenal', 'arsenal fc'],
        'liverpool': ['liverpool', 'liverpool fc'],
        'tottenham': ['tottenham', 'tottenham hotspur', 'spurs'],
        'manchester city': ['manchester city', 'man city', 'man. city'],
        'manchester united': ['manchester united', 'man united', 'man utd', 'man. utd']
      };

      for (const [canonical, aliases] of Object.entries(teamAliases)) {
        const homeMatch = aliases.some(alias => 
          externalHome.includes(alias) && predictionHome.includes(canonical) ||
          predictionHome.includes(alias) && externalHome.includes(canonical)
        );
        
        const awayMatch = aliases.some(alias => 
          externalAway.includes(alias) && predictionAway.includes(canonical) ||
          predictionAway.includes(alias) && externalAway.includes(canonical)
        );

        if (homeMatch && awayMatch) {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * Find matching user prediction for an external fixture
   * @param {Object} externalFixture - External fixture
   * @param {Array} userPredictions - Array of user predictions
   * @returns {Object|null} Matching prediction or null
   */
  findMatchingPrediction(externalFixture, userPredictions) {
    if (!userPredictions || !Array.isArray(userPredictions)) {
      return null;
    }

    const match = userPredictions.find(prediction => {
      return this.fixturesMatch(externalFixture, prediction);
    });

    return match || null;
  }
};

/**
 * Data merging utilities
 */
export const dataMerging = {
  /**
   * Merge external fixtures with user predictions
   * @param {Array} externalFixtures - Fixtures from external API
   * @param {Array} userPredictions - User predictions from backend
   * @param {Object} options - Merge options
   * @returns {Array} Merged fixtures with prediction status
   */
  mergeFixturesWithPredictions(externalFixtures, userPredictions = [], options = {}) {
    const {
      includeUnpredicted = true,
      sortByDate = true,
      markSource = true
    } = options;

    if (!Array.isArray(externalFixtures)) {
      console.warn('External fixtures is not an array', { externalFixtures });
      return [];
    }

    const mergedFixtures = externalFixtures.map(fixture => {
      const matchingPrediction = fixtureMatching.findMatchingPrediction(fixture, userPredictions);
      
      const mergedFixture = {
        ...fixture,
        predicted: !!matchingPrediction,
        userPrediction: matchingPrediction ? {
          id: matchingPrediction.id,
          homeScore: matchingPrediction.homeScore,
          awayScore: matchingPrediction.awayScore,
          homeScorers: matchingPrediction.homeScorers || [],
          awayScorers: matchingPrediction.awayScorers || [],
          chips: matchingPrediction.chips || [],
          submittedAt: matchingPrediction.submittedAt,
          status: matchingPrediction.status || 'pending',
          // Actual results (from backend after match completion)
          actualHomeScorers: matchingPrediction.actualHomeScorers || null,
          actualAwayScorers: matchingPrediction.actualAwayScorers || null
        } : null,
        // Also add actual scorers at fixture level for easier access
        actualHomeScorers: matchingPrediction?.actualHomeScorers || null,
        actualAwayScorers: matchingPrediction?.actualAwayScorers || null,
        
        // Merge metadata
        mergeInfo: {
          predictionMatched: !!matchingPrediction,
          fixtureKey: fixtureMatching.generateFixtureKey(fixture),
          mergedAt: new Date().toISOString()
        }
      };

      // Mark data source if requested
      if (markSource) {
        mergedFixture.source = fixture.source || 'external-api';
        mergedFixture.dataSources = {
          fixture: fixture.source || 'external-api',
          prediction: matchingPrediction ? 'backend-api' : null
        };
      }

      return mergedFixture;
    });

    // Filter out unpredicted fixtures if requested
    const filteredFixtures = includeUnpredicted 
      ? mergedFixtures 
      : mergedFixtures.filter(fixture => fixture.predicted);

    // Sort by date if requested
    const sortedFixtures = sortByDate 
      ? filteredFixtures.sort((a, b) => new Date(a.date) - new Date(b.date))
      : filteredFixtures;

    return sortedFixtures;
  },

  /**
   * Merge prediction statistics
   * @param {Array} mergedFixtures - Merged fixtures
   * @returns {Object} Prediction statistics
   */
  calculatePredictionStats(mergedFixtures) {
    const stats = {
      total: mergedFixtures.length,
      predicted: 0,
      unpredicted: 0,
      byCompetition: {},
      byStatus: {},
      predictionRate: 0,
      upcomingPredictions: 0,
      completedPredictions: 0
    };

    mergedFixtures.forEach(fixture => {
      // Basic counts
      if (fixture.predicted) {
        stats.predicted++;
        
        // Count by prediction status
        const predictionStatus = fixture.userPrediction?.status || 'pending';
        if (predictionStatus === 'pending') {
          stats.upcomingPredictions++;
        } else {
          stats.completedPredictions++;
        }
      } else {
        stats.unpredicted++;
      }

      // Count by competition
      const competition = fixture.competition || 'Unknown';
      if (!stats.byCompetition[competition]) {
        stats.byCompetition[competition] = { total: 0, predicted: 0 };
      }
      stats.byCompetition[competition].total++;
      if (fixture.predicted) {
        stats.byCompetition[competition].predicted++;
      }

      // Count by match status
      const status = fixture.status || 'UNKNOWN';
      if (!stats.byStatus[status]) {
        stats.byStatus[status] = { total: 0, predicted: 0 };
      }
      stats.byStatus[status].total++;
      if (fixture.predicted) {
        stats.byStatus[status].predicted++;
      }
    });

    // Calculate prediction rate
    stats.predictionRate = stats.total > 0 ? (stats.predicted / stats.total) * 100 : 0;

    // Calculate competition-specific prediction rates
    Object.keys(stats.byCompetition).forEach(competition => {
      const comp = stats.byCompetition[competition];
      comp.predictionRate = comp.total > 0 ? (comp.predicted / comp.total) * 100 : 0;
    });

    return stats;
  },

  /**
   * Filter merged fixtures by various criteria
   * @param {Array} mergedFixtures - Merged fixtures
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered fixtures
   */
  filterMergedFixtures(mergedFixtures, filters = {}) {
    const {
      competition,
      predicted,
      status,
      dateFrom,
      dateTo,
      teams,
      gameweek
    } = filters;

    let filtered = [...mergedFixtures];

    // Filter by competition
    if (competition) {
      filtered = filtered.filter(fixture => 
        fixture.competition?.toLowerCase().includes(competition.toLowerCase()) ||
        fixture.competitionCode === competition
      );
    }

    // Filter by prediction status
    if (predicted !== undefined) {
      filtered = filtered.filter(fixture => fixture.predicted === predicted);
    }

    // Filter by match status
    if (status) {
      filtered = filtered.filter(fixture => fixture.status === status);
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(fixture => new Date(fixture.date) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter(fixture => new Date(fixture.date) <= toDate);
    }

    // Filter by teams
    if (teams && Array.isArray(teams)) {
      filtered = filtered.filter(fixture => 
        teams.some(team => 
          fixture.homeTeam?.toLowerCase().includes(team.toLowerCase()) ||
          fixture.awayTeam?.toLowerCase().includes(team.toLowerCase())
        )
      );
    }

    // Filter by gameweek
    if (gameweek) {
      filtered = filtered.filter(fixture => fixture.gameweek === gameweek);
    }

    return filtered;
  }
};

/**
 * Data validation utilities
 */
export const dataValidation = {
  /**
   * Validate external fixture data structure
   * @param {Object} fixture - Fixture to validate
   * @returns {Object} Validation result
   */
  validateExternalFixture(fixture) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!fixture.id) errors.push('Missing fixture ID');
    if (!fixture.homeTeam && !fixture.home) errors.push('Missing home team');
    if (!fixture.awayTeam && !fixture.away) errors.push('Missing away team');
    if (!fixture.date) errors.push('Missing fixture date');

    // Date validation
    if (fixture.date && isNaN(new Date(fixture.date))) {
      errors.push('Invalid date format');
    }

    // Optional field warnings
    if (!fixture.venue) warnings.push('Missing venue');
    if (!fixture.competition) warnings.push('Missing competition');
    if (!fixture.referee) warnings.push('Missing referee');

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Validate user prediction data structure
   * @param {Object} prediction - Prediction to validate
   * @returns {Object} Validation result
   */
  validateUserPrediction(prediction) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!prediction.id) errors.push('Missing prediction ID');
    if (!prediction.homeTeam && !prediction.home) errors.push('Missing home team');
    if (!prediction.awayTeam && !prediction.away) errors.push('Missing away team');
    if (prediction.homeScore === undefined || prediction.homeScore === null) {
      errors.push('Missing home score');
    }
    if (prediction.awayScore === undefined || prediction.awayScore === null) {
      errors.push('Missing away score');
    }

    // Score validation
    if (prediction.homeScore < 0) errors.push('Invalid home score (negative)');
    if (prediction.awayScore < 0) errors.push('Invalid away score (negative)');

    // Optional field warnings
    if (!prediction.submittedAt) warnings.push('Missing submission timestamp');
    if (!prediction.homeScorers || prediction.homeScorers.length === 0) {
      warnings.push('Missing home scorers');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Validate merged fixtures data
   * @param {Array} mergedFixtures - Merged fixtures to validate
   * @returns {Object} Validation summary
   */
  validateMergedFixtures(mergedFixtures) {
    const results = {
      totalFixtures: mergedFixtures.length,
      validFixtures: 0,
      invalidFixtures: 0,
      fixtureErrors: [],
      predictionErrors: [],
      warnings: []
    };

    mergedFixtures.forEach((fixture, index) => {
      const fixtureValidation = this.validateExternalFixture(fixture);
      
      if (fixtureValidation.valid) {
        results.validFixtures++;
      } else {
        results.invalidFixtures++;
        results.fixtureErrors.push({
          index,
          fixtureId: fixture.id,
          errors: fixtureValidation.errors
        });
      }

      if (fixtureValidation.warnings.length > 0) {
        results.warnings.push({
          index,
          fixtureId: fixture.id,
          warnings: fixtureValidation.warnings
        });
      }

      // Validate user prediction if present
      if (fixture.predicted && fixture.userPrediction) {
        const predictionValidation = this.validateUserPrediction(fixture.userPrediction);
        
        if (!predictionValidation.valid) {
          results.predictionErrors.push({
            index,
            fixtureId: fixture.id,
            predictionId: fixture.userPrediction.id,
            errors: predictionValidation.errors
          });
        }
      }
    });

    return results;
  }
};

/**
 * Main client-side data service
 */
export const clientSideDataService = {
  fixtureMatching,
  dataMerging,
  dataValidation,

  /**
   * Complete data merging workflow
   * @param {Array} externalFixtures - External fixtures
   * @param {Array} userPredictions - User predictions
   * @param {Object} options - Merge options
   * @returns {Object} Complete merged data with stats and validation
   */
  async processMergedData(externalFixtures, userPredictions, options = {}) {
    try {
      // Merge the data
      const mergedFixtures = dataMerging.mergeFixturesWithPredictions(
        externalFixtures, 
        userPredictions, 
        options
      );

      // Calculate statistics
      const stats = dataMerging.calculatePredictionStats(mergedFixtures);

      // Validate merged data
      const validation = dataValidation.validateMergedFixtures(mergedFixtures);

      // Log any validation issues
      if (validation.invalidFixtures > 0) {
        console.warn('Data validation issues found', {
          invalidFixtures: validation.invalidFixtures,
          errors: validation.fixtureErrors
        });
      }

      return {
        success: true,
        data: {
          fixtures: mergedFixtures,
          stats,
          validation,
          meta: {
            totalFixtures: mergedFixtures.length,
            predictedFixtures: stats.predicted,
            predictionRate: stats.predictionRate,
            processedAt: new Date().toISOString(),
            dataQuality: validation.validFixtures / validation.totalFixtures
          }
        }
      };
    } catch (error) {
      console.error('Data merge workflow failed', { error: error.message });
      return {
        success: false,
        error: {
          message: error.message,
          type: 'DATA_MERGE_ERROR',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};

export default clientSideDataService;
