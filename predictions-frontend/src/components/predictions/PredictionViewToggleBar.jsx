import React, { useContext } from "react";
import ViewToggleButton from "../ui/ViewToggleButton";
import {
  LayoutIcon,
  StackIcon,
  CalendarIcon,
  ClockIcon,
  TableIcon,
  ListBulletIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionViewToggleBar = ({ viewMode, setViewMode }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col space-y-2">
      <div
        className={`${
          theme === "dark"
            ? "bg-primary-800/50 border-primary-700/30"
            : "bg-slate-100 border-slate-200"        } rounded-lg border p-1 flex flex-wrap gap-1`}
      >
        <ViewToggleButton
          icon={<PersonIcon />}
          active={viewMode === "teams"}
          onClick={() => setViewMode("teams")}
          tooltip="By Team"
          label="Teams"
        />
        <ViewToggleButton
          icon={<ListBulletIcon />}
          active={viewMode === "list"}
          onClick={() => setViewMode("list")}
          tooltip="List View"
          label="List"
        />
        <ViewToggleButton
          icon={<TableIcon />}
          active={viewMode === "table"}
          onClick={() => setViewMode("table")}
          tooltip="Table View"
          label="Table"
        />
        <ViewToggleButton
          icon={<StackIcon />}
          active={viewMode === "stack"}
          onClick={() => setViewMode("stack")}
          tooltip="Stack View"
          label="Stack"
        />
        <ViewToggleButton
          icon={<CalendarIcon />}
          active={viewMode === "calendar"}
          onClick={() => setViewMode("calendar")}
          tooltip="Calendar View"
          label="Calendar"
        />
        <ViewToggleButton
          icon={<ClockIcon />}
          active={viewMode === "timeline"}
          onClick={() => setViewMode("timeline")}
          tooltip="Timeline"
          label="Timeline"
        />
        <ViewToggleButton
          icon={<LayoutIcon />}
          active={viewMode === "carousel"}
          onClick={() => setViewMode("carousel")}
          tooltip="Carousel View"
          label="Carousel"
        />
      </div>
    </div>
  );
};

export default PredictionViewToggleBar;
