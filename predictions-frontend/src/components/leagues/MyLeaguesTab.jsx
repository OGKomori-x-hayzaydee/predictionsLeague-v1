import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircledIcon, EnterIcon, MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import SearchInput from '../common/SearchInput';
import SortMenu from '../common/SortMenu';
import FilterMenu from '../common/FilterMenu';
import EmptyState from '../common/EmptyState';
import LeagueCard from './LeagueCard';

const MyLeaguesTab = ({ 
  leagues, 
  searchQuery, 
  onSearchChange,
  onClearSearch,
  onCreateLeague,
  onJoinLeague,
  onDiscoverLeagues,
  onViewLeague,
  onManageLeague,
  sortOption,
  onSortChange,
  filterOptions,
  onFilterChange
}) => {
  // Sort leagues based on selected option
  const sortedLeagues = [...leagues].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === "members") {
      return b.memberCount - a.memberCount;
    } else if (sortOption === "alphabetical") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
  
  return (
    <motion.div
      key="my-leagues"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {leagues.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-5">
          <div className="relative flex-1">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onClearSearch}
              placeholder="Search your leagues..."
            />
          </div>
          
          <div className="flex gap-2">
            <SortMenu 
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "members", label: "Most Members" },
                { value: "alphabetical", label: "A-Z" }
              ]}
              value={sortOption}
              onChange={onSortChange}
            />
            
            <FilterMenu
              options={{
                type: [
                  { value: "all", label: "All Types" },
                  { value: "private", label: "Private" },
                  { value: "public", label: "Public" }
                ],
                status: [
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" }
                ]
              }}
              values={filterOptions}
              onChange={onFilterChange}
            />
          </div>
        </div>
      )}

      {leagues.length === 0 ? (
        <EmptyState
          title="No Leagues Yet"
          description="You haven't joined any leagues yet. Create your own or join an existing one to start predicting."
          actions={[
            {
              label: "Create League",
              icon: <PlusCircledIcon />,
              onClick: onCreateLeague,
              primary: true
            },
            {
              label: "Join a League",
              icon: <EnterIcon />,
              onClick: onJoinLeague
            },
            {
              label: "Browse Popular Leagues",
              icon: <MagnifyingGlassIcon />,
              onClick: onDiscoverLeagues,
              secondary: true
            }
          ]}
        />
      ) : searchQuery && sortedLeagues.length === 0 ? (
        <EmptyState
          icon={<MagnifyingGlassIcon className="w-12 h-12 text-indigo-400/80" />}
          title="No Results Found"
          description={`No leagues match your search for "${searchQuery}"`}
          actions={[
            {
              label: "Clear Search",
              icon: <Cross2Icon />,
              onClick: onClearSearch,
              primary: true
            }
          ]}
        />
      ) : (
        <div className="space-y-4">
          {sortedLeagues.map(league => (
            <LeagueCard 
              key={league.id} 
              league={league} 
              onManageLeague={onManageLeague}
              onViewLeague={() => onViewLeague(league.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyLeaguesTab;