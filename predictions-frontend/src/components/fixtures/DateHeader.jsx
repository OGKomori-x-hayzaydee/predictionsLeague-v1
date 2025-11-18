import { useContext } from "react";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";

const DateHeader = ({ date, itemsCount, type = "fixtures" }) => {
  const { theme } = useContext(ThemeContext);
  
  const itemLabel = type === "predictions" ? "prediction" : "fixture";
  const pluralLabel = itemsCount !== 1 ? `${itemLabel}s` : itemLabel;
  
  return (
    <div className="col-span-full mt-2 mb-1 flex items-center">
      <div className={`font-medium text-sm px-3 py-1 rounded-md ${
        theme === "dark" 
          ? "bg-teal-900/30 text-teal-300" 
          : "bg-teal-100 text-teal-700 border border-teal-200"
      }`}>
        {format(parseISO(date), "EEEE, MMMM d, yyyy")}
      </div>
      <div className={`ml-2 text-sm ${
        theme === "dark" ? "text-slate-400" : "text-slate-500"
      }`}>
        {itemsCount} {pluralLabel}
      </div>
    </div>
  );
};

export default DateHeader;