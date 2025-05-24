import React from "react";
import { format, parseISO } from "date-fns";

const DateHeader = ({ date, fixturesCount }) => {
  return (
    <div className="col-span-full mt-2 mb-1 flex items-center">
      <div className="bg-teal-900/30 text-teal-300 font-medium text-sm px-3 py-1 rounded-md">
        {format(parseISO(date), "EEEE, MMMM d, yyyy")}
      </div>
      <div className="ml-2 text-white/40 text-sm">
        {fixturesCount} fixture{fixturesCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default DateHeader;