import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Services } from "./components/services";
import { Portfolio } from "./components/potrfolio";
import { About } from "./components/about";
import { Reviews } from "./components/reviews";
import { Contacts } from "./components/contacts";
import { Footer } from "./components/footer";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "services",
        "portfolio",
        "about",
        "reviews",
        "contacts",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <Header id={activeSection} />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

export default App;
