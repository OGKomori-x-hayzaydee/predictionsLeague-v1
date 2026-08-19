/**
 * Logo Manager Component
 * Allows previewing and downloading team logos
 */

import React, { useState, useEffect } from 'react';
import { EXTERNAL_LOGO_URLS, TEAM_COLORS, LOCAL_LOGOS } from '../utils/teamLogos';
import { downloadTeamLogos, generateDownloadScript } from '../utils/logoDownloader';

const LogoManager = () => {
  const [logoStatus, setLogoStatus] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState(new Set());

  useEffect(() => {
    // Check which logos are available locally vs externally
    const status = {};
    
    Object.keys(EXTERNAL_LOGO_URLS).forEach(teamName => {
      status[teamName] = {
        hasLocal: !!LOCAL_LOGOS[teamName],
        hasExternal: !!EXTERNAL_LOGO_URLS[teamName],
        externalUrl: EXTERNAL_LOGO_URLS[teamName],
        color: TEAM_COLORS[teamName] || '#666666'
      };
    });
    
    setLogoStatus(status);
  }, []);

  const handleDownloadSelected = async () => {
    if (selectedTeams.size === 0) {
      alert('Please select teams to download');
      return;
    }

    setDownloading(true);
    
    // Generate download script for selected teams
    const selectedLogos = {};
    selectedTeams.forEach(team => {
      selectedLogos[team] = EXTERNAL_LOGO_URLS[team];
    });

    const script = `
const selectedLogos = ${JSON.stringify(selectedLogos, null, 2)};

async function downloadLogo(teamName, url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = teamName.toLowerCase().replace(/\\s+/g, '') + '.png';
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    
    console.log('✅ Downloaded:', fileName);
  } catch (error) {
    console.error('❌ Failed:', teamName, error);
  }
}

for (const [team, url] of Object.entries(selectedLogos)) {
  await downloadLogo(team, url);
  await new Promise(r => setTimeout(r, 500));
}
`;

    // Copy script to clipboard
    navigator.clipboard.writeText(script);
    alert('Download script copied to clipboard! Paste and run in browser console.');
    
    setDownloading(false);
  };

  const toggleTeamSelection = (teamName) => {
    const newSelection = new Set(selectedTeams);
    if (newSelection.has(teamName)) {
      newSelection.delete(teamName);
    } else {
      newSelection.add(teamName);
    }
    setSelectedTeams(newSelection);
  };

  const selectAll = () => {
    const missingLogos = Object.keys(logoStatus).filter(team => !logoStatus[team].hasLocal);
    setSelectedTeams(new Set(missingLogos));
  };

  const clearSelection = () => {
    setSelectedTeams(new Set());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Premier League Logo Manager</h1>
      
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Select teams that need logos downloaded</li>
          <li>Click "Generate Download Script"</li>
          <li>Open browser console (F12)</li>
          <li>Paste and run the script</li>
          <li>Save downloaded logos to <code>/src/assets/clubs/</code></li>
          <li>Update LOCAL_LOGOS imports in teamLogos.js</li>
        </ol>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={selectAll}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select Missing ({Object.keys(logoStatus).filter(team => !logoStatus[team].hasLocal).length})
        </button>
        
        <button
          onClick={clearSelection}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Selection
        </button>
        
        <button
          onClick={handleDownloadSelected}
          disabled={selectedTeams.size === 0 || downloading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {downloading ? 'Generating...' : `Generate Download Script (${selectedTeams.size})`}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(logoStatus).map(([teamName, status]) => (
          <div
            key={teamName}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedTeams.has(teamName)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
            onClick={() => toggleTeamSelection(teamName)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{teamName}</h3>
              <div className="flex gap-1">
                {status.hasLocal && (
                  <span className="w-3 h-3 bg-green-500 rounded-full" title="Has local logo"></span>
                )}
                {status.hasExternal && (
                  <span className="w-3 h-3 bg-blue-500 rounded-full" title="External URL available"></span>
                )}
              </div>
            </div>
            
            <div className="aspect-square mb-3 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              {status.hasLocal ? (
                <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">LOCAL</span>
                </div>
              ) : (
                <img
                  src={status.externalUrl}
                  alt={`${teamName} logo`}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // Fallback to team color circle
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs';
                    fallback.style.backgroundColor = status.color;
                    fallback.textContent = teamName.slice(0, 3).toUpperCase();
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              )}
            </div>
            
            <div className="text-xs space-y-1">
              <div className={`flex items-center gap-2 ${status.hasLocal ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="w-2 h-2 bg-current rounded-full"></span>
                Local: {status.hasLocal ? 'Available' : 'Missing'}
              </div>
              
              <div className={`flex items-center gap-2 ${status.hasExternal ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="w-2 h-2 bg-current rounded-full"></span>
                Remote: {status.hasExternal ? 'Available' : 'Missing'}
              </div>
            </div>
            
            {selectedTeams.has(teamName) && (
              <div className="mt-2 text-xs font-semibold text-blue-600">
                ✓ Selected for download
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Missing Logos Summary</h3>
        <p className="text-sm mb-2">
          Teams without local logos: {Object.keys(logoStatus).filter(team => !logoStatus[team].hasLocal).length} / {Object.keys(logoStatus).length}
        </p>
        <div className="text-xs space-x-2">
          {Object.keys(logoStatus)
            .filter(team => !logoStatus[team].hasLocal)
            .map(team => (
              <span key={team} className="inline-block bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">
                {team}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LogoManager;