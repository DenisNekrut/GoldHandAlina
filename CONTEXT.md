# КОНТЕКСТ ПРОЕКТА (PROJECT CONTEXT)

Дата: 2026-09-13T13:11:45.893Z

## Структура проекта (файлы src):

- **src/App.css** (1835 bytes)
- **src/App.tsx** (6831 bytes)
- **src/components/about/About.css** (1368 bytes)
- **src/components/about/About.tsx** (1775 bytes)
- **src/components/about/index.ts** (24 bytes)
- **src/components/admin/Admin.css** (11166 bytes)
- **src/components/admin/AdminAuthModal.tsx** (11198 bytes)
- **src/components/admin/AdminImageUploadField.tsx** (7385 bytes)
- **src/components/admin/AdminPage.tsx** (79592 bytes)
- **src/components/admin/index.ts** (92 bytes)
- **src/components/color-palette/AddColorModal.tsx** (19137 bytes)
- **src/components/color-palette/ColorCard.tsx** (8544 bytes)
- **src/components/color-palette/ColorDetailModal.tsx** (8081 bytes)
- **src/components/color-palette/ColorPalette.css** (26793 bytes)
- **src/components/color-palette/ColorPalettePage.tsx** (12813 bytes)
- **src/components/color-palette/StorageGuideModal.tsx** (8649 bytes)
- **src/components/color-palette/colorService.ts** (7334 bytes)
- **src/components/color-palette/index.ts** (329 bytes)
- **src/components/color-palette/mockData.ts** (5089 bytes)
- **src/components/color-palette/types.ts** (905 bytes)
- **src/components/contacts/Contacts.css** (3292 bytes)
- **src/components/contacts/Contacts.tsx** (7148 bytes)
- **src/components/contacts/index.ts** (27 bytes)
- **src/components/footer/Footer.css** (2643 bytes)
- **src/components/footer/Footer.tsx** (3923 bytes)
- **src/components/footer/index.ts** (25 bytes)
- **src/components/header/Header.css** (3504 bytes)
- **src/components/header/Header.tsx** (4158 bytes)
- **src/components/header/index.ts** (25 bytes)
- **src/components/hero/Hero.css** (3584 bytes)
- **src/components/hero/Hero.tsx** (3399 bytes)
- **src/components/hero/index.ts** (23 bytes)
- **src/components/potrfolio/Portfolio.css** (1992 bytes)
- **src/components/potrfolio/Portfolio.tsx** (1691 bytes)
- **src/components/potrfolio/index.ts** (28 bytes)
- **src/components/reviews/Reviews.css** (2469 bytes)
- **src/components/reviews/Reviews.tsx** (2532 bytes)
- **src/components/reviews/index.ts** (26 bytes)
- **src/components/services/Services.css** (1361 bytes)
- **src/components/services/Services.tsx** (1649 bytes)
- **src/components/services/index.ts** (27 bytes)
- **src/context/SiteContentContext.tsx** (2035 bytes)
- **src/context/index.ts** (244 bytes)
- **src/context/siteContentContextDef.ts** (621 bytes)
- **src/context/useSiteContent.ts** (168 bytes)
- **src/index.css** (2175 bytes)
- **src/lib/b2Client.ts** (1832 bytes)
- **src/lib/supabase.ts** (7831 bytes)
- **src/main.tsx** (289 bytes)
- **src/pwa.ts** (694 bytes)
- **src/services/siteContentService.ts** (18148 bytes)
- **src/types/content.ts** (3089 bytes)

## Ключевые файлы и их содержимое:


### src/App.tsx
```tsx
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



```

### src/types/content.ts
```tsx
export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  btnBookText: string;
  btnPortfolioText: string;
  btnPaletteText: string;
  statYears: string;
  statYearsLabel: string;
  statClients: string;
  statClientsLabel: string;
  statSterility: string;
  statSterilityLabel: string;
  avatarEmoji: string;
  avatarUrl?: string;
  badgeImageUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string; // 'hands' | 'brush' | 'magic' | 'spa' or custom string
  imageUrl?: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface PortfolioCategory {
  id: string;
  label: string;
}

export interface PortfolioItem {
  id: string | number;
  category: string;
  title: string;
  emoji?: string;
  imageUrl?: string;
}

export interface PortfolioContent {
  title: string;
  subtitle: string;
  categories: PortfolioCategory[];
  items: PortfolioItem[];
}

export interface AboutFeature {
  id: string;
  icon: string; // 'check' | 'heart' | 'shield' | 'star'
  text: string;
}

export interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  features: AboutFeature[];
  avatarEmoji: string;
  avatarUrl?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  avatarUrl?: string;
}

export interface ReviewsContent {
  title: string;
  subtitle: string;
  items: ReviewItem[];
}

export interface ContactInfoItem {
  id: string;
  type: "address" | "phone" | "email" | "booking" | "other";
  title: string;
  details: string;
  link?: string;
}

export interface SocialLinkItem {
  id: string;
  type: "vk" | "telegram" | "instagram" | "whatsapp" | "other";
  label: string;
  url: string;
}

export interface ContactsContent {
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  infoItems: ContactInfoItem[];
  socials: SocialLinkItem[];
}

export interface PaletteCategoryItem {
  id: string;
  label: string;
}

export interface PalettePageContent {
  badge: string;
  title: string;
  subtitle: string;
  backButtonText: string;
  searchPlaceholder: string;
  categories: PaletteCategoryItem[];
  viewModeLabel: string;
  viewModeSplitText: string;
  viewModeToggleText: string;
  viewModeSliderText: string;
  bookButtonText: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyButtonText: string;
  emptyImageUrl?: string;
  emptyEmoji?: string;
}

export interface GeneralSettings {
  brandNamePart1: string;
  brandNamePart2: string;
  tagline: string;
  logoImageUrl?: string;
  allowedEmails: string[];
  allowedGithubUsernames: string[];
}

export interface SiteContent {
  version: number;
  updatedAt: string;
  general: GeneralSettings;
  hero: HeroContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  about: AboutContent;
  reviews: ReviewsContent;
  contacts: ContactsContent;
  palette: PalettePageContent;
}


```

### src/components/color-palette/ColorPalettePage.tsx
```tsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Database,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Columns,
  Layers,
  Cloud,
} from "lucide-react";
import { useSiteContent } from "../../context";
import { ColorCard } from "./ColorCard";
import { ColorDetailModal } from "./ColorDetailModal";
import { AddColorModal } from "./AddColorModal";
import { StorageGuideModal } from "./StorageGuideModal";
import { colorService } from "./colorService";
import type { NailColor, NewNailColorInput } from "./types";
import "./ColorPalette.css";

interface ColorPalettePageProps {
  onBackToHome: () => void;
  onSelectColorForBooking: (colorTitle: string, shadeCode: string) => void;
}

export const ColorPalettePage = ({
  onBackToHome,
  onSelectColorForBooking,
}: ColorPalettePageProps) => {
  const { content } = useSiteContent();
  const paletteContent = content.palette;

  const [colors, setColors] = useState<NailColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "toggle" | "slider">("split");

  // Модальные окна
  const [selectedColorForDetail, setSelectedColorForDetail] = useState<NailColor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const isCloudConnected = colorService.isCloudConnected();

  const loadColors = () => {
    colorService.getAll()
      .then((data) => {
        setColors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load nail colors:", err);
        setLoading(false);
      });
  };

  // Загрузка оттенков и подписка на обновления в реальном времени
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadColors();

    const unsubscribe = colorService.subscribeToChanges(() => {
      loadColors();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddColor = async (input: NewNailColorInput) => {
    const saved = await colorService.add(input);
    setColors((prev) => [saved, ...prev]);
  };

  const handleBookColor = (color: NailColor) => {
    setSelectedColorForDetail(null);
    onSelectColorForBooking(color.title, color.shade_code);
  };

  const handleResetDemo = () => {
    if (window.confirm("Сбросить палитру к начальным демонстрационным оттенкам?")) {
      const demo = colorService.resetToDemo();
      setColors(demo);
    }
  };

  const categories = paletteContent.categories && paletteContent.categories.length > 0
    ? paletteContent.categories
    : [
        { id: "all", label: "Все цвета" },
        { id: "nude", label: "Нюд и молочные" },
        { id: "red", label: "Красные и винные" },
        { id: "dark", label: "Глубокие темные" },
        { id: "pastel", label: "Нежная пастель" },
        { id: "glitter", label: "Шиммер и блеск" },
      ];

  // Фильтрация
  const filteredColors = useMemo(() => {
    return colors.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shade_code.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [colors, selectedCategory, searchQuery]);

  return (
    <div className="color-palette-page">
      {/* Навигационная полоса возврата */}
      <div className="palette-top-bar">
        <div className="container top-bar-container">
          <button
            type="button"
            className="back-btn"
            onClick={onBackToHome}
          >
            <ArrowLeft size={18} />
            <span>← {paletteContent.backButtonText || "Вернуться на главную"}</span>
          </button>

          <div className="top-bar-right-actions">
            <button
              type="button"
              className="cloud-status-indicator connected"
              onClick={() => setIsGuideModalOpen(true)}
              title="Настройки Backblaze B2: goldhandsbusket (активен)"
              style={{ background: "#e8f4fd", color: "#0a58ca", borderColor: "#b6d4fe" }}
            >
              <Cloud size={15} />
              <span>B2: goldhandsbusket</span>
            </button>

            <button
              type="button"
              className={`cloud-status-indicator ${isCloudConnected ? "connected" : "local"}`}
              onClick={() => setIsGuideModalOpen(true)}
              title="Настройки Supabase & Backblaze B2"
            >
              <Database size={15} />
              <span>{isCloudConnected ? "Supabase Active" : "База: Supabase"}</span>
            </button>

            <button
              type="button"
              className="btn-add-new-color"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} />
              <span>Добавить цвет</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero-секция страницы палитры */}
      <div className="palette-hero">
        <div className="container">
          <div className="palette-hero-badge">
            <Sparkles size={16} />
            <span>{paletteContent.badge || "Интерактивный каталог оттенков"}</span>
          </div>
          <h1 className="palette-title">{paletteContent.title || "Цвет лака & Готовый маникюр"}</h1>
          <p className="palette-subtitle">
            {paletteContent.subtitle ||
              "Больше никаких сомнений перед покрытием! Каждая карточка показывает сразу два фото: точный оттенок гель-лака и как этот цвет выглядит на реальных ногтях."}
          </p>
        </div>
      </div>

      {/* Панель фильтров и управления */}
      <div className="palette-controls-section">
        <div className="container">
          <div className="controls-row">
            {/* Поиск */}
            <div className="palette-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={paletteContent.searchPlaceholder || "Поиск по названию или коду оттенка (#104, Luxio...)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Переключатель вида карточек */}
            <div className="view-mode-selector">
              <span className="view-mode-label">{paletteContent.viewModeLabel || "Вид фото:"}</span>
              <div className="view-mode-buttons">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                  onClick={() => setViewMode("split")}
                  title="50/50 оба фото рядом"
                >
                  <Columns size={16} />
                  <span>{paletteContent.viewModeSplitText || "50/50 Вместе"}</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "toggle" ? "active" : ""}`}
                  onClick={() => setViewMode("toggle")}
                  title="Переключение Цвет ↔ Маникюр"
                >
                  <Layers size={16} />
                  <span>{paletteContent.viewModeToggleText || "Вкладки"}</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "slider" ? "active" : ""}`}
                  onClick={() => setViewMode("slider")}
                  title="Слайдер сравнения До/После"
                >
                  <SlidersHorizontal size={16} />
                  <span>{paletteContent.viewModeSliderText || "Слайдер"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Категории оттенков */}
          <div className="categories-chips-container">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Основная галерея карточек */}
      <div className="palette-grid-section">
        <div className="container">
          <div className="grid-header-meta">
            <span className="results-count">
              Показано оттенков: <strong>{filteredColors.length}</strong>
            </span>

            <button
              type="button"
              className="btn-text-reload"
              onClick={handleResetDemo}
              title="Восстановить примеры"
            >
              <RefreshCw size={14} />
              <span>Сбросить к демо</span>
            </button>
          </div>

          {loading ? (
            <div className="palette-loading-state">
              <div className="loading-spinner" />
              <p>Загрузка каталога цветов...</p>
            </div>
          ) : filteredColors.length === 0 ? (
            <div className="palette-empty-state">
              {paletteContent.emptyImageUrl ? (
                <img
                  src={paletteContent.emptyImageUrl}
                  alt="Empty"
                  className="w-16 h-16 object-contain mb-3 mx-auto"
                />
              ) : (
                <div className="empty-icon">{paletteContent.emptyEmoji || "🎨"}</div>
              )}
              <h3>{paletteContent.emptyTitle || "По вашему запросу ничего не найдено"}</h3>
              <p>{paletteContent.emptySubtitle || "Попробуйте изменить категорию или очистить поисковый запрос."}</p>
              <button
                type="button"
                className="btn-clear-filters"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                {paletteContent.emptyButtonText || "Показать все оттенки"}
              </button>
            </div>
          ) : (
            <div className="palette-cards-grid">
              {filteredColors.map((color) => (
                <ColorCard
                  key={color.id}
                  color={color}
                  viewMode={viewMode}
                  onSelect={(c) => setSelectedColorForDetail(c)}
                  onBookWithColor={handleBookColor}
                  bookButtonText={paletteContent.bookButtonText}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      <ColorDetailModal
        color={selectedColorForDetail}
        onClose={() => setSelectedColorForDetail(null)}
        onBook={handleBookColor}
      />

      <AddColorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddColor}
        isSupabaseActive={isCloudConnected}
        onOpenStorageGuide={() => {
          setIsAddModalOpen(false);
          setIsGuideModalOpen(true);
        }}
      />

      <StorageGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};

```

### src/components/header/Header.tsx
```tsx
import { useState } from "react";
import { Lock } from "lucide-react";
import { useSiteContent } from "../../context";
import "./Header.css";

interface HeaderProps {
  id: string;
  activePage?: "home" | "palette" | "admin";
  onNavigate?: (page: "home" | "palette" | "admin", sectionId?: string) => void;
}

export const Header = ({ id, activePage = "home", onNavigate }: HeaderProps) => {
  const { content } = useSiteContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
    { id: "about", label: "Обо мне" },
    { id: "reviews", label: "Отзывы" },
    { id: "contacts", label: "Контакты" },
  ];

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate("home", sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMenuOpen(false);
  };

  const handlePaletteClick = () => {
    if (onNavigate) {
      onNavigate("palette");
    }
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (onNavigate) {
      onNavigate("admin");
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => handleNavClick("home")}>
          {content.general.logoImageUrl ? (
            <img
              src={content.general.logoImageUrl}
              alt="Logo"
              className="logo-photo-img"
            />
          ) : (
            <span className="logo-icon">💅</span>
          )}
          <span className="logo-text">
            {content.general.brandNamePart1 || "Gold"}
            <span>{content.general.brandNamePart2 || "Hands"}</span>
          </span>
        </div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link ${
                    activePage === "home" && id === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* Специальная кнопка страницы Палитра цветов */}
            <li>
              <button
                className={`nav-link palette-nav-btn ${
                  activePage === "palette" ? "active" : ""
                }`}
                onClick={handlePaletteClick}
                title="Каталог: Цвет лака + Маникюр на ногтях"
              >
                <span>Палитра цветов</span>
                <span className="palette-nav-badge">2 фото</span>
              </button>
            </li>

            {/* Вход в панель управления для мастера */}
            <li>
              <button
                className={`nav-link admin-nav-btn ${activePage === "admin" ? "active" : ""}`}
                onClick={handleAdminClick}
                title="Панель управления сайтом /admin"
              >
                <Lock size={14} />
                <span>Админка</span>
              </button>
            </li>
          </ul>
        </nav>

        <button
          className="burger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>
    </header>
  );
};




```

### src/components/hero/Hero.tsx
```tsx
import "./Hero.css";
import { useSiteContent } from "../../context";

interface HeroProps {
  onOpenPalette?: () => void;
}

export const Hero = ({ onOpenPalette }: HeroProps) => {
  const { content } = useSiteContent();
  const hero = content.hero;

  const scrollToContacts = () => {
    const element = document.getElementById("contacts");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">{hero.badge}</div>
          <h1 className="hero-title">
            {hero.titleLine1} <br />
            <span>{hero.titleLine2}</span>
          </h1>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-buttons">
            <button onClick={scrollToContacts} className="btn-primary">
              {hero.btnBookText || "Записаться"}
            </button>
            {onOpenPalette && (
              <button
                type="button"
                className="btn-primary"
                style={{
                  background: "var(--secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onClick={onOpenPalette}
              >
                <span>{hero.btnPaletteText || "Палитра цветов"}</span>
                <span style={{
                  background: "var(--primary)",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700
                }}>2 фото</span>
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => {
                const element = document.getElementById("portfolio");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {hero.btnPortfolioText || "Смотреть работы"}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{hero.statYears}</span>
              <span className="stat-label">{hero.statYearsLabel}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">{hero.statClients}</span>
              <span className="stat-label">{hero.statClientsLabel}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">{hero.statSterility}</span>
              <span className="stat-label">{hero.statSterilityLabel}</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          {hero.avatarUrl ? (
            <img
              src={hero.avatarUrl}
              alt={`${hero.titleLine1} ${hero.titleLine2}`}
              className="hero-photo-img"
              loading="eager"
            />
          ) : (
            <div className="hero-image-placeholder">
              <span>{hero.avatarEmoji || "💅"}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};



```

### src/components/footer/Footer.tsx
```tsx
import { FaHeart, FaLock } from "react-icons/fa";
import { useSiteContent } from "../../context";
import "./Footer.css";

interface FooterProps {
  onNavigate?: (page: "home" | "palette" | "admin", sectionId?: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const { content } = useSiteContent();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, page: "home" | "palette" | "admin", sectionId?: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page, sectionId);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">
              {content.general.logoImageUrl ? (
                <img
                  src={content.general.logoImageUrl}
                  alt="Logo"
                  className="footer-logo-img"
                />
              ) : (
                "💅 "
              )}
              {content.general.brandNamePart1 || "Gold"}{content.general.brandNamePart2 || "Hands"}
            </span>
            <p className="footer-description">
              Профессиональный маникюр и педикюр с любовью к деталям. Создаём
              красоту вместе!
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-nav">
              <h4>Навигация</h4>
              <ul>
                <li>
                  <a href="#home" onClick={(e) => handleLinkClick(e, "home", "home")}>Главная</a>
                </li>
                <li>
                  <a href="#palette" onClick={(e) => handleLinkClick(e, "palette")} style={{ color: "var(--primary)", fontWeight: 600 }}>
                    Палитра цветов (2 фото)
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleLinkClick(e, "home", "services")}>Услуги</a>
                </li>
                <li>
                  <a href="#portfolio" onClick={(e) => handleLinkClick(e, "home", "portfolio")}>Портфолио</a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => handleLinkClick(e, "home", "about")}>Обо мне</a>
                </li>
                <li>
                  <a href="#reviews" onClick={(e) => handleLinkClick(e, "home", "reviews")}>Отзывы</a>
                </li>
                <li>
                  <a href="#contacts" onClick={(e) => handleLinkClick(e, "home", "contacts")}>Контакты</a>
                </li>
              </ul>
            </div>

            <div className="footer-hours">
              <h4>Часы работы</h4>
              <ul>
                <li>Понедельник - Суббота</li>
                <li>10:00 - 21:00</li>
                <li>Воскресенье</li>
                <li>11:00 - 19:00</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} GoldHands. Все права защищены.</p>
          <div className="footer-bottom-actions">
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, "admin")}
              className="footer-admin-link"
              title="Панель управления сайтом (/admin)"
            >
              <FaLock size={12} />
              <span>Панель мастера</span>
            </button>
            <p className="footer-made-with">
              Сделано с <FaHeart className="heart-icon" /> для вас
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};




```
