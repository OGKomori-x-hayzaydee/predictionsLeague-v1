/**
 * TeamLogo Component
 * Displays team logos with fallbacks and loading states
 */

import React, { useState, useEffect } from 'react';
import { 
  getTeamLogoSync, 
  getTeamLogo, 
  getLogoContainerClasses, 
  getLogoImageClasses,
  LOGO_SIZES
} from '../../utils/teamLogos';

const TeamLogo = ({
  teamName,
  size = LOGO_SIZES.md,
  className = '',
  alt,
  showTeamName = false,
  style = {},
  onError,
  loading: loadingProp = false,
  theme = 'light',
  ...props
}) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!teamName) {
      setIsLoading(false);
      return;
    }

    // Get immediate logo (local or fallback)
    const syncLogo = getTeamLogoSync(teamName, { size });
    setLogoUrl(syncLogo);
    setIsLoading(false);

    // Try to get better logo asynchronously
    const loadBetterLogo = async () => {
      try {
        const asyncLogo = await getTeamLogo(teamName, { size });
        if (asyncLogo && asyncLogo !== syncLogo) {
          setLogoUrl(asyncLogo);
        }
      } catch (error) {
        console.warn(`Failed to load logo for ${teamName}:`, error);
        if (onError) onError(error);
        setHasError(true);
      }
    };

    loadBetterLogo();
  }, [teamName, size, onError]);

  const handleImageError = (e) => {
    console.warn(`Logo image failed to load for ${teamName}`);
    setHasError(true);
    
    // Fallback to generated logo
    const fallback = getTeamLogoSync(teamName, { 
      size, 
      preferLocal: false, 
      useFallback: true 
    });
    setLogoUrl(fallback);
    
    if (onError) onError(new Error('Logo image failed to load'));
  };

  const displayLoading = loadingProp || isLoading;

  if (displayLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded ${className}`}
        style={{
          width: size,
          height: size,
          ...style
        }}
        {...props}
      >
        <div className="animate-pulse bg-gray-300 rounded-full w-6 h-6"></div>
      </div>
    );
  }

  if (!logoUrl && !teamName) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded ${className}`}
        style={{
          width: size,
          height: size,
          ...style
        }}
        {...props}
      >
        <span className="text-gray-400 text-xs">?</span>
      </div>
    );
  }

  const containerClasses = getLogoContainerClasses(size);
  const imageClasses = getLogoImageClasses(theme);

  return (
    <div 
      className={`inline-flex items-center ${className}`}
      style={style}
      {...props}
    >
      <div
        className={containerClasses}
        style={{
          width: size,
          height: size,
        }}
      >
        <img
          src={logoUrl}
          alt={alt || `${teamName} logo`}
          className={`${imageClasses} ${hasError ? 'opacity-75' : ''}`}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      {showTeamName && (
        <span className="ml-2 text-sm font-medium">
          {teamName}
        </span>
      )}
    </div>
  );
};

export default TeamLogo;