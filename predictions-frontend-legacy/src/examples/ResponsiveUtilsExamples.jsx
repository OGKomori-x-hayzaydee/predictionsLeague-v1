/**
 * Mobile Scale Utilities - Usage Examples
 * 
 * This file demonstrates how to use the new responsive utilities
 * and components for mobile-first development.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveGrid, ResponsiveText, ResponsiveStack } from '../components/common';
import { 
  spacing, 
  gaps, 
  textScale, 
  gridCols, 
  padding,
  margins,
  combine,
  buildGrid,
  buildText 
} from '../utils/mobileScaleUtils';

// ============================================================
// EXAMPLE 1: Using Responsive Components (Recommended)
// ============================================================

export const Example1_Components = () => {
  return (
    <ResponsiveStack space="normal" pad="page">
      {/* Page Header */}
      <ResponsiveStack space="tight">
        <ResponsiveText variant="h1" as="h1" className="font-bold text-teal-700">
          Dashboard
        </ResponsiveText>
        <ResponsiveText variant="body" className="text-slate-600">
          Welcome back! Here's your performance overview.
        </ResponsiveText>
      </ResponsiveStack>

      {/* Stats Grid */}
      <ResponsiveGrid variant="stats" gap="normal">
        <StatCard title="Points" value="124" />
        <StatCard title="Accuracy" value="78%" />
        <StatCard title="Rank" value="#1,234" />
        <StatCard title="Chips" value="3" />
      </ResponsiveGrid>

      {/* Content Grid */}
      <ResponsiveGrid variant="auto3" gap="normal">
        <ContentCard title="Upcoming Matches" />
        <ContentCard title="Recent Predictions" />
        <ContentCard title="Leagues" />
      </ResponsiveGrid>
    </ResponsiveStack>
  );
};

// ============================================================
// EXAMPLE 2: Using Direct Utilities
// ============================================================

export const Example2_DirectUtils = () => {
  return (
    <div className={spacing.normal}>
      {/* Header with manual utilities */}
      <div className={margins.bottom.normal}>
        <h1 className={`${textScale.h1} font-bold text-teal-700`}>
          Fixtures
        </h1>
        <p className={`${textScale.body} text-slate-600`}>
          Browse and predict upcoming matches
        </p>
      </div>

      {/* Grid with manual utilities */}
      <div className={`grid ${gridCols.auto2} ${gaps.normal}`}>
        <FixtureCard />
        <FixtureCard />
      </div>
    </div>
  );
};

// ============================================================
// EXAMPLE 3: Combining Utilities with Helper Functions
// ============================================================

export const Example3_Helpers = () => {
  const headerClasses = buildText({ 
    variant: 'h2', 
    className: 'font-semibold text-slate-800' 
  });

  const gridClasses = buildGrid({ 
    cols: 'stats', 
    gap: 'normal', 
    className: 'mt-4' 
  });

  return (
    <div className={padding.page}>
      <h2 className={headerClasses}>Performance Stats</h2>
      <div className={gridClasses}>
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>
    </div>
  );
};

// ============================================================
// EXAMPLE 4: With Framer Motion Integration
// ============================================================

export const Example4_Motion = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ResponsiveStack 
      space="normal" 
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ResponsiveText 
        variant="h1" 
        as={motion.h1}
        variants={itemVariants}
        className="font-bold"
      >
        Animated Header
      </ResponsiveText>

      <ResponsiveGrid 
        variant="stats" 
        as={motion.div}
        variants={itemVariants}
      >
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </ResponsiveGrid>
    </ResponsiveStack>
  );
};

// ============================================================
// EXAMPLE 5: Form Layout
// ============================================================

export const Example5_Form = () => {
  return (
    <ResponsiveStack space="section" pad="page">
      {/* Form Header */}
      <ResponsiveStack space="tight">
        <ResponsiveText variant="h2" as="h2" className="font-bold">
          Make Your Prediction
        </ResponsiveText>
        <ResponsiveText variant="bodySmall" className="text-slate-500">
          Enter your score prediction below
        </ResponsiveText>
      </ResponsiveStack>

      {/* Form Fields */}
      <ResponsiveStack space="tight" pad="cardCompact" className="bg-white rounded-xl border">
        <FormField label="Home Score" />
        <FormField label="Away Score" />
        <FormField label="First Goalscorer" />
      </ResponsiveStack>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg">
          Submit
        </button>
        <button className="px-4 py-2 border rounded-lg">
          Cancel
        </button>
      </div>
    </ResponsiveStack>
  );
};

// ============================================================
// EXAMPLE 6: Mobile-Specific Behaviors
// ============================================================

export const Example6_MobileSpecific = () => {
  return (
    <div className={combine(spacing.normal, padding.page)}>
      {/* Desktop-only sidebar */}
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>

      {/* Mobile-only hamburger */}
      <button className="block md:hidden">
        <HamburgerIcon />
      </button>

      {/* Stacks vertically on mobile, horizontally on desktop */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterButton />
        <SortButton />
        <SearchButton />
      </div>
    </div>
  );
};

// ============================================================
// EXAMPLE 7: Card with Responsive Padding
// ============================================================

export const Example7_Card = () => {
  return (
    <ResponsiveStack 
      space="tight" 
      pad="card"
      className="bg-white rounded-xl border shadow-sm"
    >
      <ResponsiveText variant="h3" as="h3" className="font-semibold">
        Card Title
      </ResponsiveText>
      <ResponsiveText variant="body" className="text-slate-600">
        Card content goes here. Padding and spacing automatically
        adjust for mobile and desktop viewports.
      </ResponsiveText>
      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg w-full sm:w-auto">
        Action
      </button>
    </ResponsiveStack>
  );
};

// ============================================================
// MIGRATION PATTERN: Before & After
// ============================================================

// BEFORE (Manual responsive classes)
export const BeforeMigration = () => {
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="mb-2 sm:mb-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Welcome back
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5">
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>
    </div>
  );
};

// AFTER (Using new utilities)
export const AfterMigration = () => {
  return (
    <ResponsiveStack space="normal">
      <ResponsiveStack space="tight">
        <ResponsiveText variant="h1" as="h1" className="font-bold">
          Dashboard
        </ResponsiveText>
        <ResponsiveText variant="body" className="text-slate-600">
          Welcome back
        </ResponsiveText>
      </ResponsiveStack>
      <ResponsiveGrid variant="stats" gap="normal">
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </ResponsiveGrid>
    </ResponsiveStack>
  );
};

// Dummy components for examples
const StatCard = ({ title, value }) => <div>StatCard</div>;
const ContentCard = ({ title }) => <div>ContentCard</div>;
const FixtureCard = () => <div>FixtureCard</div>;
const FormField = ({ label }) => <div>FormField: {label}</div>;
const Sidebar = () => <div>Sidebar</div>;
const HamburgerIcon = () => <span>☰</span>;
const FilterButton = () => <button>Filter</button>;
const SortButton = () => <button>Sort</button>;
const SearchButton = () => <button>Search</button>;
