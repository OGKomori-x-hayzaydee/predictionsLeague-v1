import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const EmptyFixtureState = ({ searchQuery }) => {
  return (
    <div className="bg-primary-700/30 border border-primary-600/30 rounded-lg p-6 text-center max-w-lg mx-auto">
      <div className="bg-primary-600/30 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
        <MagnifyingGlassIcon className="w-6 h-6 text-teal-300/60" />
      </div>
      <h3 className="text-lg text-teal-100 mb-2">No fixtures found</h3>
      {searchQuery ? (
        <p className="text-white/60 text-sm">
          No fixtures match your search for "{searchQuery}". Try adjusting your search terms.
        </p>
      ) : (
        <p className="text-white/60 text-sm">
          There are no upcoming fixtures available at this time.
        </p>
      )}
    </div>
  );
};

export default EmptyFixtureState;