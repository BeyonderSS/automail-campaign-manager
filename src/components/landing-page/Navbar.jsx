"use client"

import React, { useEffect, useRef } from "react"
import { Dock, DockIcon } from "../ui/dock"
import { Separator } from "../ui/separator"
import { ThemeToggle } from "../theme-toggle"
import Link from "next/link"
import { Home, Info, LayoutDashboard, Image, PlayCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { gsap } from "gsap"
import { useScrollDirection } from "@/hooks/useScrollDirection"

export function Navbar() {
  const navbarRef = useRef(null)
  const scrollDirection = useScrollDirection()

  useEffect(() => {
    // Entry animation
    gsap.from(navbarRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // Scroll-based animation
    gsap.to(navbarRef.current, {
      y: scrollDirection === "down" ? -100 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    })
  }, [scrollDirection])

  return (
    <div ref={navbarRef} className="fixed top-0 z-10 w-full">
      <div className="relative">
          <TooltipProvider>
        <Dock direction="middle">
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/#hero" className="">
                    <Home />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/#features" className="">
                    <Image />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mockups</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/#getting-started" className="">
                    <PlayCircle />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Getting Started</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link target="_blank" href="https://puneet-portfolio.vercel.app/">
                    <Info />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>About Me</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <Separator orientation="vertical" />

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
        </Dock>
          </TooltipProvider>
      </div>
    </div>
  )
}

