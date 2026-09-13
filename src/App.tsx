import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Services } from "./components/services";
import { Portfolio } from "./components/potrfolio";
import { About } from "./components/about";
import { Reviews } from "./components/reviews";
import { Contacts } from "./components/contacts";
import { Footer } from "./components/footer";
import { ColorPalettePage } from "./components/color-palette";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "palette">("home");
  const [activeSection, setActiveSection] = useState("home");
  const [selectedColorForBooking, setSelectedColorForBooking] = useState<string>("");

  // Синхронизация с hash URL (например /#palette)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#palette") {
        setCurrentPage("palette");
      } else {
        setCurrentPage("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Отслеживание активного раздела при скролле (только на главной)
  useEffect(() => {
    if (currentPage !== "home") return;

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
  }, [currentPage]);

  // Навигация между страницами и секциями
  const handleNavigate = (page: "home" | "palette", sectionId?: string) => {
    if (page === "palette") {
      setCurrentPage("palette");
      window.location.hash = "palette";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentPage("home");
      if (window.location.hash === "#palette") {
        history.pushState(null, "", window.location.pathname);
      }
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
              top: elementPosition,
              behavior: "smooth",
            });
          }
        }, 50);
      }
    }
  };

  // Выбор цвета из палитры и переход к форме контактов
  const handleSelectColorForBooking = (colorTitle: string, shadeCode: string) => {
    setSelectedColorForBooking(`${colorTitle} (${shadeCode})`);
    handleNavigate("home", "contacts");
  };

  return (
    <div className="App">
      <Header
        id={activeSection}
        activePage={currentPage}
        onNavigate={handleNavigate}
      />

      <main>
        {currentPage === "palette" ? (
          <ColorPalettePage
            onBackToHome={() => handleNavigate("home", "home")}
            onSelectColorForBooking={handleSelectColorForBooking}
          />
        ) : (
          <>
            <Hero onOpenPalette={() => handleNavigate("palette")} />
            <Services />
            <Portfolio />
            <About />
            <Reviews />
            <Contacts
              selectedColorNotes={selectedColorForBooking}
              onClearColorNotes={() => setSelectedColorForBooking("")}
            />
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
