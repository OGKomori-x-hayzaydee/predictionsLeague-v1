import React from "react";
import { StarIcon, LightningBoltIcon } from "@radix-ui/react-icons";

const ProfileView = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
          My Profile
        </h1>
        <p className="text-white/70 font-outfit">
          Manage your profile information and settings
        </p>
      </div>

      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-24 w-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-medium">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-teal-100 text-2xl font-dmSerif mb-1">
              alexplayer23
            </h2>
            <p className="text-white/70 font-outfit mb-4">
              Member since March 2025
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                <StarIcon className="mr-1" /> Premier Predictor
              </span>
              <span className="bg-indigo-700/20 text-indigo-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                <LightningBoltIcon className="mr-1" /> 3-Week Streak
              </span>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-md transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <h3 className="text-teal-200 font-outfit font-medium text-lg mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">Username</span>
              <span className="text-white">alexplayer23</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">Email</span>
              <span className="text-white">alex@example.com</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">Favorite Team</span>
              <span className="text-white">Arsenal</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <h3 className="text-teal-200 font-outfit font-medium text-lg mb-4">
            Your Stats
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">
                Total Predictions
              </span>
              <span className="text-white">237</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">
                Correct Score Predictions
              </span>
              <span className="text-white">41 (17.3%)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/50 text-sm mb-1">Best Gameweek</span>
              <span className="text-white">GW21 (86 points)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
