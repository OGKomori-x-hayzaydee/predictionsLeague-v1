/**
 * Team Logo Downloader Utility
 * Downloads all Premier League team logos to local assets
 */

import { EXTERNAL_LOGO_URLS, TEAM_NAME_MAPPING } from './teamLogos.js';

/**
 * Download and save team logos locally
 * This should be run during build time or as a setup script
 */
export async function downloadTeamLogos() {
  const downloadResults = {
    success: [],
    failed: [],
    total: 0
  };

  console.log('📥 Starting team logo download...');

  for (const [teamName, logoUrl] of Object.entries(EXTERNAL_LOGO_URLS)) {
    downloadResults.total++;
    
    try {
      console.log(`⬇️ Downloading ${teamName} logo...`);
      
      const response = await fetch(logoUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const fileName = `${teamName.toLowerCase().replace(/\s+/g, '')}.${getFileExtension(logoUrl)}`;
      
      // In a real implementation, you'd save this to the assets folder
      // For now, we'll create object URLs for preview
      const objectUrl = URL.createObjectURL(blob);
      
      downloadResults.success.push({
        team: teamName,
        fileName,
        url: objectUrl,
        size: blob.size,
        type: blob.type
      });

      console.log(`✅ ${teamName}: ${fileName} (${formatBytes(blob.size)})`);
      
    } catch (error) {
      console.error(`❌ Failed to download ${teamName}:`, error.message);
      downloadResults.failed.push({
        team: teamName,
        url: logoUrl,
        error: error.message
      });
    }
  }

  console.log('\n📊 Download Summary:');
  console.log(`Total: ${downloadResults.total}`);
  console.log(`Success: ${downloadResults.success.length}`);
  console.log(`Failed: ${downloadResults.failed.length}`);

  if (downloadResults.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    downloadResults.failed.forEach(item => {
      console.log(`  - ${item.team}: ${item.error}`);
    });
  }

  return downloadResults;
}

/**
 * Get file extension from URL
 */
function getFileExtension(url) {
  const extension = url.split('.').pop().split('?')[0];
  return ['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(extension.toLowerCase()) 
    ? extension.toLowerCase() 
    : 'png';
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate download script for manual execution
 * This generates code you can run in the browser console to download logos
 */
export function generateDownloadScript() {
  const script = `
// Premier League Logo Downloader Script
// Run this in your browser console to download all team logos

const logos = ${JSON.stringify(EXTERNAL_LOGO_URLS, null, 2)};

async function downloadLogo(teamName, url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = teamName.toLowerCase().replace(/\\s+/g, '') + '.' + (url.includes('.svg') ? 'svg' : 'png');
    
    // Create download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    
    console.log('✅ Downloaded:', fileName);
    return true;
  } catch (error) {
    console.error('❌ Failed to download', teamName, ':', error);
    return false;
  }
}

async function downloadAllLogos() {
  console.log('🚀 Starting download of', Object.keys(logos).length, 'team logos...');
  
  for (const [teamName, url] of Object.entries(logos)) {
    await downloadLogo(teamName, url);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('✅ Download complete! Check your Downloads folder.');
}

// Start download
downloadAllLogos();
`;

  return script;
}

/**
 * Create a comprehensive logo manifest for all teams
 */
export function createLogoManifest() {
  const manifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    totalTeams: Object.keys(EXTERNAL_LOGO_URLS).length,
    teams: {}
  };

  for (const [teamName, logoUrl] of Object.entries(EXTERNAL_LOGO_URLS)) {
    const normalizedName = teamName.toLowerCase().replace(/\s+/g, '');
    manifest.teams[teamName] = {
      normalizedName,
      fileName: `${normalizedName}.png`,
      externalUrl: logoUrl,
      localPath: `../assets/clubs/${normalizedName}.png`,
      aliases: Object.keys(TEAM_NAME_MAPPING).filter(key => 
        TEAM_NAME_MAPPING[key] === teamName
      )
    };
  }

  return manifest;
}

// Export for use in components
export default {
  downloadTeamLogos,
  generateDownloadScript,
  createLogoManifest
};