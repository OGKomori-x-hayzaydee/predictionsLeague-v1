import React, { useContext } from "react";
import { motion } from "framer-motion";
import { 
  StarIcon, 
  LightningBoltIcon, 
  TargetIcon,
  BadgeIcon,
  RocketIcon,
  ActivityLogIcon,
  CalendarIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import AchievementCard from "./AchievementCard";

const ProfileAchievements = () => {
  const { theme } = useContext(ThemeContext);

  // Sample achievements data
  const achievements = [
    {
      id: 1,
      name: "Premier Predictor",
      description: "Make 100 correct predictions",
      icon: <StarIcon className="w-5 h-5" />,
      isUnlocked: true,
      unlockedDate: "2 weeks ago"
    },
    {
      id: 2,
      name: "Hot Streak",
      description: "Get 5 predictions correct in a row",
      icon: <LightningBoltIcon className="w-5 h-5" />,
      isUnlocked: true,
      unlockedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Sharpshooter",
      description: "Predict 50 exact scores correctly",
      icon: <TargetIcon className="w-5 h-5" />,
      isUnlocked: true,
      unlockedDate: "3 days ago"
    },
    {
      id: 4,
      name: "Century Club",
      description: "Score 100+ points in a single gameweek",
      icon: <BadgeIcon className="w-5 h-5" />,
      isUnlocked: true,
      unlockedDate: "1 month ago"
    },
    {
      id: 5,
      name: "Marathon Runner",
      description: "Maintain a 10-week prediction streak",
      icon: <ActivityLogIcon className="w-5 h-5" />,
      isUnlocked: false,
      progress: {
        current: 3,
        target: 10,
        unit: "weeks",
        percentage: 30
      }
    },
    {
      id: 6,
      name: "Big Six Master",
      description: "Achieve 90% accuracy on Big Six matches",
      icon: <RocketIcon className="w-5 h-5" />,
      isUnlocked: false,
      progress: {
        current: 82,
        target: 90,
        unit: "% accuracy",
        percentage: 91
      }
    },
    {
      id: 7,
      name: "Consistent Performer",
      description: "Score points in 20 consecutive gameweeks",
      icon: <CalendarIcon className="w-5 h-5" />,
      isUnlocked: false,
      progress: {
        current: 12,
        target: 20,
        unit: "gameweeks",
        percentage: 60
      }
    },
    {
      id: 8,
      name: "League Legend",
      description: "Finish in top 3 of 5 different leagues",
      icon: <PersonIcon className="w-5 h-5" />,
      isUnlocked: false,
      progress: {
        current: 2,
        target: 5,
        unit: "leagues",
        percentage: 40
      }
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-bold font-dmSerif mb-2`}>
          Achievements
        </h2>
        <p className={`${text.secondary[theme]} font-outfit`}>
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Progress Overview */}
      <div className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } border`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`${text.primary[theme]} font-outfit font-medium`}>
            Overall Progress
          </span>
          <span className={`${text.primary[theme]} font-outfit font-bold`}>
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${
          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
        }`}>
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              theme === "dark" ? "bg-gradient-to-r from-teal-500 to-indigo-500" : "bg-gradient-to-r from-teal-600 to-indigo-600"
            }`}
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'} font-outfit font-semibold text-lg mb-4`}>
            Unlocked ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} font-outfit font-semibold text-lg mb-4`}>
            In Progress ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={false}
                progress={achievement.progress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAchievements;
