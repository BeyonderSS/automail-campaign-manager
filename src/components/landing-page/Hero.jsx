import React from "react";
import { MorphingText } from "../ui/morphing-text";
import { Globe } from "../ui/globe";
const texts = [
  "Introducing", 
  "Auto Mail Campaign", 
  "Streamline Your Emails", 
  "Powered by AI Precision", 
  "Save Time, Boost Productivity", 
  "Plan, Automate, Relax", 
  "Craft Campaigns Effortlessly", 
  "Your All-in-One Email Solution"
];
function Hero() {
  return (
    <div className="relative h-screen w-full bg-background">
      <Globe className="top-72" />
      <div className="absolute left-0 right-0 top-32 flex justify-center sm:bg-inherit">
        <MorphingText texts={texts} />
      </div>
    </div>
  );
}

export default Hero;
