import React from 'react';
import { usePredictionTracker } from '../utils/predictionTracker';

// Simple component to test and visualize the prediction tracker
const PredictionTrackerTest = () => {
  const mockFixtures = [
    {
      id: 1,
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea', 
      utcDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: 'SCHEDULED'
    },
    {
      id: 2,
      homeTeam: 'Liverpool',
      awayTeam: 'Manchester City',
      utcDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      status: 'SCHEDULED'
    }
  ];

  const {
    totalFixtures,
    predictedCount,
    pendingCount,
    allPredictionsMade,
    savePrediction,
    removePrediction,
    hasPrediction,
    getPrediction
  } = usePredictionTracker(mockFixtures);

  const handleAddPrediction = (fixtureId, homeTeam, awayTeam) => {
    savePrediction({
      fixtureId,
      homeTeam,
      awayTeam,
      homeScore: 2,
      awayScore: 1,
      timestamp: Date.now()
    });
  };

  const handleRemovePrediction = (fixtureId) => {
    removePrediction(fixtureId);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🎯 Prediction Tracker Test</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">📊 Status Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-sm text-gray-600">Total Fixtures</span>
            <span className="text-xl font-bold">{totalFixtures}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Predicted</span>
            <span className="text-xl font-bold text-green-600">{predictedCount}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Pending</span>
            <span className="text-xl font-bold text-orange-600">{pendingCount}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">All Done?</span>
            <span className={`text-xl font-bold ${allPredictionsMade ? 'text-green-600' : 'text-red-600'}`}>
              {allPredictionsMade ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">🏟️ Mock Fixtures</h3>
        {mockFixtures.map(fixture => {
          const predicted = hasPrediction(fixture.id, fixture.homeTeam, fixture.awayTeam);
          const prediction = getPrediction(fixture.id, fixture.homeTeam, fixture.awayTeam);
          
          return (
            <div key={fixture.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {fixture.homeTeam} vs {fixture.awayTeam}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(fixture.utcDate).toLocaleDateString()}
                  </div>
                  {predicted && prediction && (
                    <div className="text-sm text-green-600 mt-1">
                      Predicted: {prediction.homeScore} - {prediction.awayScore}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {predicted ? (
                    <>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ✅ Predicted
                      </span>
                      <button
                        onClick={() => handleRemovePrediction(fixture.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                        ⏳ Pending
                      </span>
                      <button
                        onClick={() => handleAddPrediction(fixture.id, fixture.homeTeam, fixture.awayTeam)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add Prediction
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded text-sm">
        <p><strong>💡 Test Instructions:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Click "Add Prediction" to simulate making a prediction</li>
          <li>Watch the status bar update in real-time</li>
          <li>Click "Remove" to simulate removing a prediction</li>
          <li>The status persists across page refreshes (localStorage)</li>
        </ul>
      </div>
    </div>
  );
};

export default PredictionTrackerTest;