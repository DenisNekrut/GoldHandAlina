import { useState } from "react";
import { X, Check, Copy, Sparkles, ExternalLink } from "lucide-react";
import type { NailColor } from "./types";
import { colorService } from "./colorService";

interface ColorDetailModalProps {
  color: NailColor | null;
  onClose: () => void;
  onBook: (color: NailColor) => void;
}

export const ColorDetailModal = ({
  color,
  onClose,
  onBook,
}: ColorDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"compare" | "swatch" | "manicure">("compare");
  const [copied, setCopied] = useState(false);

  if (!color) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${color.title} (${color.shade_code})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Закрыть">
          <X size={20} />
        </button>

        <div className="detail-modal-body">
          {/* Левая колонка: Просмотр 2-х фото */}
          <div className="detail-media-column">
            {/* Табы режима просмотра */}
            <div className="detail-tabs">
              <button
                className={`detail-tab-btn ${activeTab === "compare" ? "active" : ""}`}
                onClick={() => setActiveTab("compare")}
              >
                Оба фото вместе
              </button>
              <button
                className={`detail-tab-btn ${activeTab === "swatch" ? "active" : ""}`}
                onClick={() => setActiveTab("swatch")}
              >
                Цвет лака
              </button>
              <button
                className={`detail-tab-btn ${activeTab === "manicure" ? "active" : ""}`}
                onClick={() => setActiveTab("manicure")}
              >
                На ногтях
              </button>
            </div>

            {/* Контейнер изображений */}
            <div className="detail-images-display">
              {activeTab === "compare" && (
                <div className="compare-grid">
                  <div className="compare-card">
                    <div className="compare-img-wrapper">
                      <img
                        src={colorService.resolveImageUrl(color.swatch_image_url)}
                        alt={`Образец цвета ${color.title}`}
                        className="modal-img"
                      />
                    </div>
                    <span className="compare-caption">1. Образец / Цвет</span>
                  </div>
                  <div className="compare-card">
                    <div className="compare-img-wrapper">
                      <img
                        src={colorService.resolveImageUrl(color.manicure_image_url)}
                        alt={`Маникюр с цветом ${color.title}`}
                        className="modal-img"
                      />
                    </div>
                    <span className="compare-caption">2. Готовый маникюр</span>
                  </div>
                </div>
              )}

              {activeTab === "swatch" && (
                <div className="single-img-view">
                  <img
                    src={colorService.resolveImageUrl(color.swatch_image_url)}
                    alt={`Цвет ${color.title}`}
                    className="modal-img-large"
                  />
                  <div className="single-caption">Флакон / Свотч оттенка</div>
                </div>
              )}

              {activeTab === "manicure" && (
                <div className="single-img-view">
                  <img
                    src={colorService.resolveImageUrl(color.manicure_image_url)}
                    alt={`Маникюр ${color.title}`}
                    className="modal-img-large"
                  />
                  <div className="single-caption">Результат маникюра на ногтях</div>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка: Детали и запись */}
          <div className="detail-info-column">
            <div className="detail-header">
              <div className="detail-code-row">
                <div className="detail-shade-badge">
                  {color.color_hex && (
                    <span
                      className="detail-color-circle"
                      style={{ backgroundColor: color.color_hex }}
                    />
                  )}
                  <span className="detail-code-text">{color.shade_code}</span>
                </div>
                {color.brand && (
                  <span className="detail-brand-badge">{color.brand}</span>
                )}
              </div>

              <h2 className="detail-title">{color.title}</h2>
            </div>

            {/* Характеристики */}
            <div className="detail-specs">
              <div className="spec-item">
                <span className="spec-label">Категория:</span>
                <span className="spec-val">
                  {color.category === "nude" && "Нюдовые и натуральные"}
                  {color.category === "red" && "Красные и винные"}
                  {color.category === "dark" && "Темные и драматичные"}
                  {color.category === "pastel" && "Нежная пастель"}
                  {color.category === "glitter" && "Шиммер и светоотражающие"}
                </span>
              </div>

              {color.finish && (
                <div className="spec-item">
                  <span className="spec-label">Финиш:</span>
                  <span className="spec-val">
                    {color.finish === "glossy" && "Глянцевый блеск"}
                    {color.finish === "matte" && "Бархатный матовый"}
                    {color.finish === "shimmer" && "Деликатный шиммер"}
                    {color.finish === "reflective" && "Светоотражающий эффект"}
                  </span>
                </div>
              )}
            </div>

            {color.description && (
              <div className="detail-description">
                <h4>Описание оттенка:</h4>
                <p>{color.description}</p>
              </div>
            )}

            <div className="detail-tip">
              <Sparkles size={16} className="tip-icon" />
              <p>
                Цвет вживую может слегка варьироваться в зависимости от освещения.
                Мастер нанесет образцы на палитру перед покрытием, чтобы вы были уверены в выборе!
              </p>
            </div>

            {/* Кнопки действий */}
            <div className="detail-actions">
              <button
                type="button"
                className="btn-book-primary"
                onClick={() => onBook(color)}
              >
                <span>Записаться с этим цветом</span>
                <ExternalLink size={16} />
              </button>

              <button
                type="button"
                className="btn-copy-secondary"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Скопировано в буфер" : "Скопировать название и код"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
