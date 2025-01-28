import React from "react";
import { HyperText } from "../ui/hyper-text";
import Link from "next/link";
import { AnimatedShinyText } from "../ui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="my-12 flex w-full items-center justify-center text-sm md:my-24 md:text-lg">
        <div className="mx-1">@ {year} Automail Campaign</div>
        <div>
          <Link target="_blank" href={"https://github.com/BeyonderSS"}>
            <AnimatedShinyText className="">
              Crafted by yours truly.
            </AnimatedShinyText>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Footer;
