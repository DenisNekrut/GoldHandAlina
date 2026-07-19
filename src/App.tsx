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

  const isDev = import.meta.env.MODE === 'development' || import.meta.env.VITE_BASE?.includes('/dev/');

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
        {/* Добавляем плашку на время разработки */}
      {isDev && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: '#ffcc00', color: '#000', padding: '5px', textAlign: 'center',
          zIndex: 9999, fontWeight: 'bold'
        }}>
          🔧 ТЕСТОВАЯ ВЕРСИЯ (DEV)
        </div>
      )}
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
