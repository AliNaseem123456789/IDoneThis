import React from "react";
import Navbar from "../components/Navbar.jsx";
// import HeroHome from "../components/HeroHome";
// import HeroHowItWorks from "../components/HeroHowItWorks";
// import HeroPricing from "../components/HeroPricing";
// import HeroCaseStudies from "../components/HeroCaseStudies";
// import HeroBlog from "../components/HeroBlog";
import Reviews from "../components/Reviews.jsx";
import Chatbot from "../components/ChatBot.jsx";
import Hero from "../components/Hero.jsx";
import HeroPricing from "../components/HeroPricing.jsx";
export default function LandingPage() {
  return (
    <div className="relative">
      <Hero />
      <HeroPricing />
      <Reviews />
      <Chatbot />
    </div>
  );
}
