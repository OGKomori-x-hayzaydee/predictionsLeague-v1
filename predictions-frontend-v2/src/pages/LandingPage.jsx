import React from "react";
import { useState } from "react";

import HeroSection from "../components/landingPage/HeroSection";
import WhyJoin from "../components/landingPage/WhyJoin";
import HowItWorks from "../components/landingPage/HowItWorks";
import Cta from "../components/landingPage/Cta";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <WhyJoin />
      <HowItWorks />
      <Cta />
      <Footer />
    </>
  );
}
