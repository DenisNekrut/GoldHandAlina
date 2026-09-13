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
import { AdminPage } from "./components/admin";
import { SiteContentProvider, useSiteContent } from "./context";
import "./App.css";

function AppContent() {
  const { content } = useSiteContent();
  const [currentPage, setCurrentPage] = useState<"home" | "palette" | "admin">("home");
  const [activeSection, setActiveSection] = useState("home");
  const [selectedColorForBooking, setSelectedColorForBooking] = useState<string>("");

  // Синхронизация с hash URL (#palette, #admin, #services, #portfolio, #contacts) и pathname
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === "#admin" || path.endsWith("/admin") || path.endsWith("/admin/")) {
        setCurrentPage("admin");
        document.title = "Панель управления — GoldHandAlina";
      } else if (hash === "#palette" || path.endsWith("/palette") || path.endsWith("/palette/")) {
        setCurrentPage("palette");
        document.title = "Палитра оттенков (свотч + маникюр) — GoldHandAlina";
      } else {
        setCurrentPage("home");
        const brandName = `${content.general?.brandNamePart1 || "Gold"}${content.general?.brandNamePart2 || "Hands"}`;
        document.title = `${brandName} — Студия маникюра и педикюра`;

        // Если hash указывает на конкретную секцию на главной (#services, #portfolio, #contacts, #booking, #about, #reviews)
        const cleanHash = hash.replace("#", "");
        if (cleanHash === "booking") {
          setActiveSection("contacts");
          scrollToSection("contacts");
        } else if (["services", "portfolio", "about", "reviews", "contacts", "home"].includes(cleanHash)) {
          setActiveSection(cleanHash);
          scrollToSection(cleanHash);
        }
      }
    };

    const scrollToSection = (sectionId: string) => {
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
      }, 80);
    };

    handleUrlChange();
    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [content.general?.brandNamePart1, content.general?.brandNamePart2]);

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
  const handleNavigate = (page: "home" | "palette" | "admin", sectionId?: string) => {
    if (page === "palette") {
      setCurrentPage("palette");
      window.location.hash = "palette";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "admin") {
      setCurrentPage("admin");
      window.location.hash = "admin";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentPage("home");
      if (sectionId) {
        window.location.hash = sectionId;
        setActiveSection(sectionId);
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
        }, 60);
      } else {
        if (window.location.hash === "#palette" || window.location.hash === "#admin") {
          history.pushState(null, "", window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Выбор цвета из палитры и переход к форме контактов
  const handleSelectColorForBooking = (colorTitle: string, shadeCode: string) => {
    setSelectedColorForBooking(`${colorTitle} (${shadeCode})`);
    handleNavigate("home", "contacts");
  };

  // Страница администрирования
  if (currentPage === "admin") {
    return <AdminPage onBackToSite={() => handleNavigate("home")} />;
  }

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

function App() {
  return (
    <SiteContentProvider>
      <AppContent />
    </SiteContentProvider>
  );
}

export default App;


