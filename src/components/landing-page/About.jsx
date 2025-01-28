import React from "react";
import { TextReveal } from "../ui/text-reveal";
import { Button } from "../ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { VelocityScroll } from "../ui/scroll-based-velocity";

function About() {
  return (
    <div className="z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <TextReveal
        text="📧 Tired of juggling countless emails and messy workflows? 😫"
        className="mb-4 text-4xl font-bold text-primary md:text-5xl lg:text-6xl"
      />

      <TextReveal
        text="✨ Say goodbye to the old way of emailing and hello to AI-powered precision! 🤖"
        className="mb-8 text-xl text-muted-foreground md:text-2xl"
      />
      <TextReveal
        text="🎯 Plan. ✍️ Schedule. ✅ Relax. Automail handles it all!"
        className="mb-8 text-xl text-muted-foreground md:text-2xl"
      />
      <VelocityScroll defaultVelocity={3} numRows={2}>
        🚀 Automail Campaign Manager ✉️
      </VelocityScroll>
    </div>
  );
}

export default About;
