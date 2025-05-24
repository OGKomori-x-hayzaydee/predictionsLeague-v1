import React from 'react';
import ViewToggleButton from './ViewToggleButton';
import {
  LayoutIcon,
  PersonIcon,
  StackIcon,
  CalendarIcon,
  ClockIcon,
  TableIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";

const ViewToggleBar = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-primary-800/50 rounded-lg border border-primary-700/30 p-1 flex">
        <ViewToggleButton
          icon={<LayoutIcon />}
          active={viewMode === "carousel"}
          onClick={() => setViewMode("carousel")}
          tooltip="Carousel View"
          label="Carousel"
        />
        <ViewToggleButton
          icon={<PersonIcon />}
          active={viewMode === "teams"}
          onClick={() => setViewMode("teams")}
          tooltip="By Team"
          label="Teams"
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
          icon={<TableIcon />}
          active={viewMode === "table"}
          onClick={() => setViewMode("table")}
          tooltip="Table View"
          label="Table"
        />
        <ViewToggleButton
          icon={<ListBulletIcon />}
          active={viewMode === "list"}
          onClick={() => setViewMode("list")}
          tooltip="List View"
          label="List"
        />
      </div>
    </div>
  );
};

export default ViewToggleBar;