import { useState } from "react";
import { Eye, Check, Sparkles, Layers, SlidersHorizontal } from "lucide-react";
import type { NailColor } from "./types";
import { colorService } from "./colorService";

interface ColorCardProps {
  color: NailColor;
  viewMode: "split" | "toggle" | "slider";
  onSelect: (color: NailColor) => void;
  onBookWithColor: (color: NailColor) => void;
}

export const ColorCard = ({
  color,
  viewMode,
  onSelect,
  onBookWithColor,
}: ColorCardProps) => {
  // Для режима "toggle"
  const [activePhoto, setActivePhoto] = useState<"swatch" | "manicure">("manicure");
  // Для интерактивного слайдера
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${color.title} (${color.shade_code})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "nude": return "Нюд";
      case "red": return "Красный/Винный";
      case "dark": return "Тёмный";
      case "pastel": return "Пастель";
      case "glitter": return "Шиммер/Глиттер";
      default: return "Оттенок";
    }
  };

  return (
    <div
      className={`color-card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(color)}
    >
      {/* Контейнер фотографий */}
      <div className="color-card-media-wrapper">
        {/* РЕЖИМ 1: ДВОЙНОЙ 50/50 СПЛИТ (Видны оба фото) */}
        {viewMode === "split" && (
          <div className="split-view-container">
            <div className="split-half swatch-half">
              <img
                src={colorService.resolveImageUrl(color.swatch_image_url)}
                alt={`Образец цвета ${color.title}`}
                className="card-img"
                loading="lazy"
              />
              <span className="media-badge top-left">Цвет</span>
            </div>
            <div className="split-half manicure-half">
              <img
                src={colorService.resolveImageUrl(color.manicure_image_url)}
                alt={`Маникюр с цветом ${color.title}`}
                className="card-img"
                loading="lazy"
              />
              <span className="media-badge top-right">На ногтях</span>
            </div>
          </div>
        )}

        {/* РЕЖИМ 2: ПЕРЕКЛЮЧАТЕЛЬ / СВАЙП ФОТО */}
        {viewMode === "toggle" && (
          <div className="toggle-view-container">
            <img
              src={colorService.resolveImageUrl(activePhoto === "swatch" ? color.swatch_image_url : color.manicure_image_url)}
              alt={activePhoto === "swatch" ? `Цвет ${color.title}` : `Маникюр ${color.title}`}
              className="card-img fade-in"
              loading="lazy"
            />
            {/* Табы переключения прямо на картинке */}
            <div
              className="media-toggle-tabs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`toggle-tab-btn ${activePhoto === "swatch" ? "active" : ""}`}
                onClick={() => setActivePhoto("swatch")}
              >
                Образец
              </button>
              <button
                type="button"
                className={`toggle-tab-btn ${activePhoto === "manicure" ? "active" : ""}`}
                onClick={() => setActivePhoto("manicure")}
              >
                Маникюр
              </button>
            </div>
          </div>
        )}

        {/* РЕЖИМ 3: ИНТЕРАКТИВНЫЙ СЛАЙДЕР СРАВНЕНИЯ */}
        {viewMode === "slider" && (
          <div
            className="slider-view-container"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              setSliderPos(Math.round((x / rect.width) * 100));
            }}
          >
            {/* Заднее фото: Маникюр */}
            <img
              src={colorService.resolveImageUrl(color.manicure_image_url)}
              alt={`Маникюр ${color.title}`}
              className="card-img slider-bg-img"
              loading="lazy"
            />
            <span className="media-badge top-right">На ногтях</span>

            {/* Переднее фото: Свотч/Цвет (обрезано по ползунку) */}
            <div
              className="slider-clip"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <img
                src={colorService.resolveImageUrl(color.swatch_image_url)}
                alt={`Цвет ${color.title}`}
                className="card-img slider-fg-img"
                loading="lazy"
              />
              <span className="media-badge top-left">Цвет</span>
            </div>

            {/* Линия разделителя */}
            <div
              className="slider-divider"
              style={{ left: `${sliderPos}%` }}
            >
              <span className="slider-handle">
                <SlidersHorizontal size={14} />
              </span>
            </div>
          </div>
        )}

        {/* Быстрая кнопка просмотра */}
        <button
          className="quick-view-btn"
          aria-label="Подробнее"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(color);
          }}
        >
          <Eye size={16} />
          <span>Детали</span>
        </button>
      </div>

      {/* Информационная часть карточки */}
      <div className="color-card-content">
        <div className="card-header-row">
          <div className="shade-badge-wrapper">
            {color.color_hex && (
              <span
                className="color-dot"
                style={{ backgroundColor: color.color_hex }}
                title={`HEX: ${color.color_hex}`}
              />
            )}
            <span className="shade-code">{color.shade_code}</span>
          </div>

          <span className="category-pill">{getCategoryLabel(color.category)}</span>
        </div>

        <h3 className="color-title" title={color.title}>
          {color.title}
        </h3>

        {color.brand && (
          <div className="brand-finish-row">
            <span className="brand-name">{color.brand}</span>
            {color.finish === "shimmer" && (
              <span className="finish-tag"><Sparkles size={12} /> Шиммер</span>
            )}
            {color.finish === "reflective" && (
              <span className="finish-tag"><Sparkles size={12} /> Светоотражающий</span>
            )}
            {color.finish === "matte" && (
              <span className="finish-tag"><Layers size={12} /> Матовый</span>
            )}
          </div>
        )}

        {color.description && (
          <p className="color-description-preview">{color.description}</p>
        )}

        {/* Нижние действия карточки */}
        <div className="card-actions-row">
          <button
            type="button"
            className={`copy-code-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyCode}
            title="Скопировать номер и название оттенка"
          >
            {copied ? <Check size={14} /> : null}
            <span>{copied ? "Скопировано!" : "Копировать код"}</span>
          </button>

          <button
            type="button"
            className="book-color-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBookWithColor(color);
            }}
          >
            Хочу этот цвет 💅
          </button>
        </div>
      </div>
    </div>
  );
};
