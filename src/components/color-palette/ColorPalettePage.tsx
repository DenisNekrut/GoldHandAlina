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
