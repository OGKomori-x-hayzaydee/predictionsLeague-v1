import React from 'react';
import StatusBar from '../components/layout/StatusBar';
import DashboardView from '../components/dashboardRenders/DashboardView';
import useDashboardData from '../hooks/useDashboardData';

// Example usage of the enhanced DashboardView with loading states
const DashboardPage = () => {
  const {
    essentialData,
    essentialLoading,
    statusBarData,
    statusBarLoading,
    recentPredictions,
    leagues,
    secondaryLoading,
    errors,
  } = useDashboardData();

  const handleGoToPredictions = (match) => {
    console.log('Navigate to predictions for match:', match);
    // Implementation would navigate to predictions page
  };

  const handleNavigateToSection = (section, params) => {
    console.log('Navigate to section:', section, params);
    // Implementation would navigate to specific section
  };

  const handleMakePredictions = () => {
    console.log('Navigate to make predictions');
    // Implementation would navigate to predictions page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Status Bar */}
      <StatusBar
        user={statusBarData.user}
        nextMatchData={statusBarData.nextMatchData}
        loading={statusBarLoading}
        onMakePredictions={handleMakePredictions}
      />
      
      {/* Dashboard Content */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <DashboardView
            // Data props
            essentialData={essentialData}
            recentPredictions={recentPredictions}
            leagues={leagues}
            
            // Action props
            goToPredictions={handleGoToPredictions}
            navigateToSection={handleNavigateToSection}
            
            // Loading states for progressive loading
            essentialLoading={essentialLoading}
            secondaryLoading={secondaryLoading}
            
            // Error states
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
