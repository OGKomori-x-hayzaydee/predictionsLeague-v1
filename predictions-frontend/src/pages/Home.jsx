import React from "react";
import { useState } from "react";

import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import WhyJoin from "../components/WhyJoin";
import HowItWorks from "../components/HowItWorks";
import Cta from "../components/Cta";
import Footer from "../components/Footer";

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
