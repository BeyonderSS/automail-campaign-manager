import About from "./About";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import { Navbar } from "./Navbar";

export default function LandingHome() {
  return (
    <>
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      {/* <section id="features">
        <Features/>
      </section> */}
      <Footer />
    </>
  );
}
