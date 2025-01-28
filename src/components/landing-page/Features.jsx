"use client"
import React from "react";
import Safari from "../ui/safari";
import { Button } from "../ui/button";
import { BoxReveal } from "../ui/box-reveal";
import { useTheme } from "next-themes";
import { FlickeringGrid } from "../ui/flickering-grid";
function Features() {
  const {theme} = useTheme()
  return (
    <div className=" relative flex items-center justify-center min-h-screen">
      <FlickeringGrid         className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
/>
      <Safari
        url="lavdash.com"
        imageSrc={`/mockups/loopHome-desktop-${theme==="dark"?"dark":"light"}.png`}
        className="h-[calc(100vh-100px)] w-full z-10 "
      />
       

    </div>
  );
}

export default Features;
