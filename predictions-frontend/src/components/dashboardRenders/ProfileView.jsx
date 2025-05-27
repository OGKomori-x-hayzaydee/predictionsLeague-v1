import React, { useContext } from "react";
import { StarIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, status } from "../../utils/themeUtils";

const ProfileView = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className="mb-6">
        <h1 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-3xl font-bold font-dmSerif`}>
          My Profile
        </h1>
        <p className={`${text.secondary[theme]} font-outfit`}>
          Manage your profile information and settings
        </p>
      </div>

      <div className={`${backgrounds.card[theme]} rounded-lg p-6 border mb-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-24 w-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-medium">
            A
          </div>
          <div className="flex-1">
            <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-dmSerif mb-1`}>
              alexplayer23
            </h2>
            <p className={`${text.secondary[theme]} font-outfit mb-4`}>
              Member since March 2025
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`${theme === 'dark' ? 'bg-teal-700/20 text-teal-300' : 'bg-teal-100 text-teal-700'} text-xs font-medium py-1 px-2 rounded-full flex items-center`}>
                <StarIcon className="mr-1" /> Premier Predictor
              </span>
              <span className={`${theme === 'dark' ? 'bg-indigo-700/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} text-xs font-medium py-1 px-2 rounded-full flex items-center`}>
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
        <div className={`${backgrounds.card[theme]} rounded-lg p-5 border`}>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'} font-outfit font-medium text-lg mb-4`}>
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>Username</span>
              <span className={`${text.primary[theme]}`}>alexplayer23</span>
            </div>
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>Email</span>
              <span className={`${text.primary[theme]}`}>alex@example.com</span>
            </div>
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>Favorite Team</span>
              <span className={`${text.primary[theme]}`}>Arsenal</span>
            </div>
          </div>
        </div>

        <div className={`${backgrounds.card[theme]} rounded-lg p-5 border`}>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'} font-outfit font-medium text-lg mb-4`}>
            Your Stats
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>
                Total Predictions
              </span>
              <span className={`${text.primary[theme]}`}>237</span>
            </div>
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>
                Correct Score Predictions
              </span>
              <span className={`${text.primary[theme]}`}>41 (17.3%)</span>
            </div>
            <div className="flex flex-col">
              <span className={`${text.muted[theme]} text-sm mb-1`}>Best Gameweek</span>
              <span className={`${text.primary[theme]}`}>GW21 (86 points)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
