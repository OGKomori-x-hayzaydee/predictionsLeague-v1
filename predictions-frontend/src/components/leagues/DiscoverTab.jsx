import React from 'react';
import { motion } from 'framer-motion';
import { RocketIcon, MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import SearchInput from '../common/SearchInput';
import SortMenu from '../common/SortMenu';
import FilterMenu from '../common/FilterMenu';
import EmptyState from '../common/EmptyState';
import FeaturedLeagueCard from './FeaturedLeagueCard';
import LeagueTypesExplainer from './LeagueTypesExplainer';

const DiscoverTab = ({ 
  leagues, 
  searchQuery,
  onSearchChange,
  onClearSearch,
  onJoinLeague,
  isJoining,
  sortOption,
  onSortChange,
  filterOptions,
  onFilterChange
}) => {
  return (
    <motion.div
      key="discover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search for leagues..."
          />
        </div>
        
        <div className="flex gap-2">
          <SortMenu 
            options={[
              { value: "popular", label: "Most Popular" },
              { value: "newest", label: "Newest First" },
              { value: "members", label: "Most Members" }
            ]}
            value={sortOption}
            onChange={onSortChange}
          />
          
          <FilterMenu
            options={{
              type: [
                { value: "all", label: "All Types" },
                { value: "featured", label: "Featured" },
                { value: "official", label: "Official" },
                { value: "community", label: "Community" }
              ],
              competition: [
                { value: "all", label: "All Competitions" },
                { value: "premier-league", label: "Premier League" },
                { value: "champions-league", label: "Champions League" },
                { value: "europa-league", label: "Europa League" }
              ]
            }}
            values={filterOptions}
            onChange={onFilterChange}
          />
        </div>
      </div>
      
      {/* Featured Leagues */}
      <div className="mb-8">
        <h2 className="text-teal-100 text-2xl font-outfit mb-3 flex items-center">
          <RocketIcon className="w-5 h-5 mr-2" />
          Featured Leagues
        </h2>
        
        {leagues.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlassIcon className="w-12 h-12 text-indigo-400/80" />}
            title="No Leagues Found"
            description={searchQuery ? `No leagues match your search for "${searchQuery}"` : "No featured leagues available at this time"}
            actions={searchQuery ? [
              {
                label: "Clear Search",
                icon: <Cross2Icon />,
                onClick: onClearSearch,
                primary: true
              }
            ] : []}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leagues.map(league => (
              <FeaturedLeagueCard
                key={league.id}
                league={league}
                onJoinLeague={onJoinLeague}
                isJoining={isJoining}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* League Types Explainer */}
      <LeagueTypesExplainer />
    </motion.div>
  );
};

export default DiscoverTab;