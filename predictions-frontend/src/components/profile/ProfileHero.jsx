import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const formatTeamName = (teamName) => {
  if (!teamName) return null;
  return teamName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatMemberSince = (user) => {
  const possibleDateFields = [
    user?.memberSince,
    user?.joinedAt,
    user?.createdAt,
    user?.registrationDate,
    user?.created_at,
    user?.joined_at,
  ];
  const memberDate = possibleDateFields.find((date) => date != null);
  if (memberDate) {
    const date = new Date(memberDate);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  }
  return "Recently";
};

const ProfileHero = ({ user, onEditClick }) => {
  const { theme } = useContext(ThemeContext);

  const favoriteTeam = formatTeamName(
    user?.favouriteTeam || user?.favoriteTeam
  );
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 border-slate-700/50"
          : "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/60 shadow-lg shadow-slate-200/50"
      }`}
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-600/10 to-indigo-600/5 opacity-40" />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-indigo-500/15 to-teal-500/15 rounded-full blur-3xl" />

      <div className="relative p-5 sm:p-6 md:p-8">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-18 w-18 sm:h-22 sm:w-22 md:h-24 md:w-24 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold font-dmSerif shadow-lg shadow-teal-500/25">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="rounded-2xl w-full h-full object-cover"
                />
              ) : (
                user?.username?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[3px] ${
                theme === "dark" ? "border-slate-800" : "border-white"
              } bg-emerald-500 flex items-center justify-center shadow-sm`}
            >
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
              <h2
                className={`${text.primary[theme]} text-xl sm:text-2xl md:text-3xl font-bold font-dmSerif truncate`}
              >
                {user?.username || "User"}
              </h2>
              {onEditClick && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditClick}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-outfit transition-colors self-start ${
                    theme === "dark"
                      ? "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/50"
                      : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200"
                  }`}
                >
                  <Pencil1Icon className="w-3 h-3" />
                  Edit Profile
                </motion.button>
              )}
            </div>

            {fullName && (
              <p
                className={`${text.secondary[theme]} font-outfit text-sm sm:text-base mb-1`}
              >
                {fullName}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {favoriteTeam && (
                <span
                  className={`${text.muted[theme]} font-outfit text-xs sm:text-sm flex items-center gap-1`}
                >
                  <span>⚽</span> {favoriteTeam}
                </span>
              )}
              <span
                className={`${text.muted[theme]} font-outfit text-xs sm:text-sm flex items-center gap-1`}
              >
                <CalendarIcon className="w-3 h-3" />
                Member since {formatMemberSince(user)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHero;
