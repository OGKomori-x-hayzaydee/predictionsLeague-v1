import React from "react";

import HeroSection from "../components/landingPage/HeroSection";
import Features from "../components/landingPage/Features";
import AppPreview from "../components/landingPage/AppPreview";
import HowItWorks from "../components/landingPage/HowItWorks";
import Testimonials from "../components/landingPage/Testimonials";
import Cta from "../components/landingPage/Cta";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  return (
    <div className="bg-white dark:bg-primary-800 min-h-screen transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <Features />
      <AppPreview />
      <HowItWorks />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
