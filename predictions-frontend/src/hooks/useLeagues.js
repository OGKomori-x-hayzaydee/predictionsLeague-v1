import { useState, useEffect } from 'react';

const useLeagues = () => {
  const [myLeagues, setMyLeagues] = useState([]);
  const [featuredLeagues, setFeaturedLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated API call to fetch user leagues
  const fetchMyLeagues = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - this would be replaced with actual API call
      const leaguesData = [
        {
          id: 1,
          name: "Global Premier League Predictions",
          type: "public",
          members: 10843,
          position: 567,
          rank: "Silver II",
          points: 345,
          pointsLeader: 521,
          isAdmin: false,
          description: "Official global league for all Premier League prediction enthusiasts."
        },
        {
          id: 2,
          name: "Friends & Family",
          type: "private",
          members: 12,
          position: 3,
          rank: "Gold",
          points: 453,
          pointsLeader: 478,
          isAdmin: true,
          description: "Our private prediction league for bragging rights at family gatherings!"
        },
        {
          id: 3,
          name: "Office Rivalry",
          type: "private",
          members: 8,
          position: 1,
          rank: "Leader",
          points: 482,
          pointsLeader: 482,
          isAdmin: true,
          description: "Settle workplace debates through the beautiful game."
        },
        {
          id: 4,
          name: "Reddit r/PremierLeague",
          type: "public",
          members: 5432,
          position: 78,
          rank: "Platinum",
          points: 471,
          pointsLeader: 543,
          isAdmin: false,
          description: "The official prediction league for the Premier League subreddit."
        }
      ];
      
      setMyLeagues(leaguesData);
      setError(null);
    } catch (err) {
      setError('Failed to load your leagues. Please try again later.');
      console.error('Error fetching leagues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated API call to fetch featured leagues
  const fetchFeaturedLeagues = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - would be replaced with actual API call
      const featuredData = [
        {
          id: 101,
          name: "Official NBC Sports League",
          type: "public",
          members: 24567,
          pointsToQualify: null,
          description: "NBC Sports official prediction challenge with weekly prizes!",
          sponsor: "NBC Sports",
          hasAwards: true
        },
        {
          id: 102,
          name: "Sky Sports Super 6",
          type: "public",
          members: 31245,
          pointsToQualify: null,
          description: "Predict six matches each week with a chance to win £250,000.",
          sponsor: "Sky Sports",
          hasAwards: true
        },
        {
          id: 103,
          name: "Premier League Legends",
          type: "public",
          members: 8762,
          pointsToQualify: 1200,
          description: "Elite league for the top 10% of predictors from previous season.",
          sponsor: null,
          hasAwards: true
        },
        {
          id: 104,
          name: "FPL Integration Challenge",
          type: "public",
          members: 15328,
          pointsToQualify: null,
          description: "Link your FPL team and earn bonus points based on your squad performance.",
          sponsor: "Fantasy Premier League",
          hasAwards: false
        }
      ];
      
      setFeaturedLeagues(featuredData);
    } catch (err) {
      console.error('Error fetching featured leagues:', err);
    }
  };

  // Join a league by code
  const joinLeague = async (leagueCode) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful join
      // In a real app, this would return the joined league data from the API
      const joinedLeague = {
        id: 999,
        name: `League ${leagueCode}`,
        type: "private",
        members: 15,
        position: 15,
        rank: "Bronze",
        points: 0,
        pointsLeader: 450,
        isAdmin: false,
        description: "You've just joined this league"
      };
      
      // Add the joined league to myLeagues
      setMyLeagues(prev => [...prev, joinedLeague]);
      
      return { success: true, message: "Successfully joined league!", league: joinedLeague };
    } catch (err) {
      return { success: false, message: "Failed to join league. Invalid code or server error." };
    }
  };

  // Join a featured league directly
  const joinFeaturedLeague = async (leagueId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the featured league by ID
      const leagueToJoin = featuredLeagues.find(league => league.id === leagueId);
      
      if (!leagueToJoin) {
        return { success: false, message: "League not found" };
      }
      
      // Transform featured league to user league format
      const joinedLeague = {
        id: leagueToJoin.id,
        name: leagueToJoin.name,
        type: leagueToJoin.type,
        members: leagueToJoin.members,
        position: leagueToJoin.members, // Start at bottom position
        rank: "Bronze",
        points: 0,
        pointsLeader: 550,
        isAdmin: false,
        description: leagueToJoin.description
      };
      
      // Check if already joined
      const alreadyJoined = myLeagues.some(league => league.id === leagueId);
      
      if (!alreadyJoined) {
        setMyLeagues(prev => [...prev, joinedLeague]);
        return { success: true, message: "Successfully joined league!" };
      } else {
        return { success: false, message: "You've already joined this league" };
      }
    } catch (err) {
      return { success: false, message: "Failed to join league. Please try again." };
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchMyLeagues();
    fetchFeaturedLeagues();
  }, []);

  return { 
    myLeagues, 
    featuredLeagues, 
    isLoading, 
    error, 
    joinLeague,
    joinFeaturedLeague,
    refreshMyLeagues: fetchMyLeagues
  };
};

export default useLeagues;