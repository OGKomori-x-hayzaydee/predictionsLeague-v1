import { useContext } from "react";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";

const DateHeader = ({ date, fixturesCount }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="col-span-full mt-2 mb-1 flex items-center">
      <div className={`font-medium text-sm px-3 py-1 rounded-md ${
        theme === "dark" 
          ? "bg-teal-900/30 text-teal-300" 
          : "bg-teal-100 text-teal-700 border border-teal-200"
      }`}>
        {format(parseISO(date), "EEEE, MMMM d, yyyy")}
      </div>
      <div className="ml-2 text-white/40 text-sm">
        {fixturesCount} fixture{fixturesCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default DateHeader;