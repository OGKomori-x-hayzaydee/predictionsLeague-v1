/**
 * Client-side prediction tracker using SECURE localStorage
 * Syncs prediction status across all components
 * Now with encryption, signatures, and tampering detection
 */

import { secureStorage } from './secureStorage';

const STORAGE_KEY = 'userPredictions';
const PREDICTION_EXPIRY_HOURS = 72; // Predictions expire after 3 days

class PredictionTracker {
  constructor() {
    this.listeners = new Set();
    this.useSecureStorage = true; // Toggle for secure storage
    this.cleanupExpiredPredictions();
    
    // Listen for security events
    window.addEventListener('security:tamper-detected', (e) => {
      console.error('🚨 Security breach detected:', e.detail);
      // Optionally show user warning or force re-login
    });
  }

  // Get all predictions from secure storage
  getAllPredictions() {
    try {
      if (this.useSecureStorage) {
        const stored = secureStorage.getItem(STORAGE_KEY);
        return stored ? (Array.isArray(stored) ? stored : [stored]) : [];
      } else {
        // Fallback to regular localStorage (for debugging)
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.error('Error reading predictions from storage:', error);
      return [];
    }
  }

  // Save prediction to secure storage
  savePrediction(prediction) {
    try {
      const predictions = this.getAllPredictions();
      const timestamp = Date.now();
      
      const predictionWithTimestamp = {
        ...prediction,
        id: prediction.fixtureId || `${prediction.homeTeam}_${prediction.awayTeam}`,
        fixtureId: prediction.fixtureId,
        timestamp,
        expiresAt: timestamp + (PREDICTION_EXPIRY_HOURS * 60 * 60 * 1000)
      };

      // Remove existing prediction for same fixture
      const filtered = predictions.filter(p => p.id !== predictionWithTimestamp.id);
      
      // Add new prediction
      const updated = [...filtered, predictionWithTimestamp];
      
      if (this.useSecureStorage) {
        // Store array securely
        secureStorage.setItem(STORAGE_KEY, updated);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error saving prediction:', error);
      return false;
    }
  }

  // Remove prediction
  removePrediction(fixtureId) {
    try {
      const predictions = this.getAllPredictions();
      const filtered = predictions.filter(p => p.id !== fixtureId);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error removing prediction:', error);
      return false;
    }
  }

  // Check if fixture has prediction
  hasPredictionForFixture(fixtureId, homeTeam, awayTeam) {
    const predictions = this.getAllPredictions();
    
    return predictions.some(p => 
      p.id === fixtureId || 
      (p.homeTeam === homeTeam && p.awayTeam === awayTeam)
    );
  }

  // Get prediction status for fixtures
  getPredictionStatus(fixtures) {
    if (!fixtures || fixtures.length === 0) {
      return {
        totalFixtures: 0,
        predictedCount: 0,
        pendingCount: 0,
        allPredictionsMade: false
      };
    }

    const now = new Date();
    
    // Filter upcoming fixtures only
    const upcomingFixtures = fixtures.filter(fixture => {
      const kickoffTime = new Date(fixture.utcDate || fixture.date);
      return kickoffTime > now && (fixture.status === 'SCHEDULED' || fixture.status === 'TIMED');
    });

    // Count predicted fixtures
    const predictedCount = upcomingFixtures.filter(fixture => 
      this.hasPredictionForFixture(
        fixture.id, 
        fixture.homeTeam?.name || fixture.homeTeam, 
        fixture.awayTeam?.name || fixture.awayTeam
      )
    ).length;

    const pendingCount = upcomingFixtures.length - predictedCount;

    return {
      totalFixtures: upcomingFixtures.length,
      predictedCount,
      pendingCount: Math.max(0, pendingCount),
      allPredictionsMade: pendingCount === 0 && upcomingFixtures.length > 0
    };
  }

  // Clean up expired predictions
  cleanupExpiredPredictions() {
    try {
      const predictions = this.getAllPredictions();
      const now = Date.now();
      
      const validPredictions = predictions.filter(p => 
        !p.expiresAt || p.expiresAt > now
      );

      if (validPredictions.length !== predictions.length) {
        if (this.useSecureStorage) {
          secureStorage.setItem(STORAGE_KEY, validPredictions);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validPredictions));
        }
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error cleaning up predictions:', error);
    }
  }

  // Subscribe to prediction changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in prediction listener:', error);
      }
    });
  }

  // Clear all predictions (useful for logout)
  clearAllPredictions() {
    try {
      if (this.useSecureStorage) {
        secureStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error clearing predictions:', error);
      return false;
    }
  }

  // Run security health check
  runSecurityCheck() {
    if (this.useSecureStorage) {
      return secureStorage.healthCheck();
    }
    return { healthy: 0, corrupted: 0 };
  }

  // Get prediction details for specific fixture
  getPrediction(fixtureId, homeTeam, awayTeam) {
    const predictions = this.getAllPredictions();
    
    return predictions.find(p => 
      p.id === fixtureId || 
      (p.homeTeam === homeTeam && p.awayTeam === awayTeam)
    );
  }

  // Bulk import predictions (useful for syncing with API)
  importPredictions(newPredictions) {
    try {
      const timestamp = Date.now();
      
      const predictionsWithTimestamp = newPredictions.map(pred => ({
        ...pred,
        id: pred.fixtureId || pred.id || `${pred.homeTeam}_${pred.awayTeam}`,
        timestamp,
        expiresAt: timestamp + (PREDICTION_EXPIRY_HOURS * 60 * 60 * 1000)
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(predictionsWithTimestamp));
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error importing predictions:', error);
      return false;
    }
  }
}

// Create singleton instance
export const predictionTracker = new PredictionTracker();

// React hook for using the prediction tracker
import { useState, useEffect } from 'react';

export const usePredictionTracker = (fixtures = []) => {
  const [status, setStatus] = useState({
    totalFixtures: 0,
    predictedCount: 0,
    pendingCount: 0,
    allPredictionsMade: false
  });

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = predictionTracker.getPredictionStatus(fixtures);
      setStatus(newStatus);
    };

    // Initial update
    updateStatus();

    // Subscribe to changes
    const unsubscribe = predictionTracker.subscribe(updateStatus);

    // Cleanup on unmount
    return unsubscribe;
  }, [fixtures]);

  return {
    ...status,
    savePrediction: predictionTracker.savePrediction.bind(predictionTracker),
    removePrediction: predictionTracker.removePrediction.bind(predictionTracker),
    hasPrediction: predictionTracker.hasPredictionForFixture.bind(predictionTracker),
    getPrediction: predictionTracker.getPrediction.bind(predictionTracker),
    clearAll: predictionTracker.clearAllPredictions.bind(predictionTracker)
  };
};

export default predictionTracker;