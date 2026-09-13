import { useState } from "react";
import { X, Plus, Image as ImageIcon, HelpCircle, AlertCircle, CloudUpload, CheckCircle, Loader2 } from "lucide-react";
import type { ColorCategory, ColorFinish, NewNailColorInput } from "./types";
import { b2ClientService } from "../../lib/b2Client";

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newColor: NewNailColorInput) => Promise<void>;
  isSupabaseActive: boolean;
  onOpenStorageGuide: () => void;
}

export const AddColorModal = ({
  isOpen,
  onClose,
  onAdd,
  isSupabaseActive,
  onOpenStorageGuide,
}: AddColorModalProps) => {
  const [formData, setFormData] = useState<NewNailColorInput>({
    title: "",
    shade_code: "",
    category: "nude",
    color_hex: "#F5EBE6",
    finish: "glossy",
    brand: "",
    swatch_image_url: "",
    manicure_image_url: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingSwatch, setUploadingSwatch] = useState(false);
  const [uploadingManicure, setUploadingManicure] = useState(false);

  if (!isOpen) return null;

  // Прямая загрузка файла в Backblaze B2 (bucket: goldhandsbusket)
  const handleFileUploadToB2 = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "swatch_image_url" | "manicure_image_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Размер файла не должен превышать 15 МБ");
      return;
    }

    const setUploading = field === "swatch_image_url" ? setUploadingSwatch : setUploadingManicure;
    setErrorMsg("");
    setUploading(true);

    try {
      const publicUrl = await b2ClientService.uploadFile(file);
      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
    } catch (err: unknown) {
      console.error("Upload error:", err);
      // Fallback: читаем как локальный dataUrl если сеть/бэкенд недоступны
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
      setErrorMsg(
        err instanceof Error
          ? `Backblaze B2: ${err.message}. Фото сохранено локально.`
          : "Ошибка отправки в B2, фото сохранено локально."
      );
    } finally {
      setUploading(false);
      // Очищаем value инпута чтобы можно было выбрать тот же файл снова
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Укажите название оттенка");
      return;
    }
    if (!formData.swatch_image_url.trim()) {
      setErrorMsg("Загрузите или укажите ссылку на фото образца цвета");
      return;
    }
    if (!formData.manicure_image_url.trim()) {
      setErrorMsg("Загрузите или укажите ссылку на фото маникюра на ногтях");
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd(formData);
      onClose();
      // Сброс формы
      setFormData({
        title: "",
        shade_code: "",
        category: "nude",
        color_hex: "#F5EBE6",
        finish: "glossy",
        brand: "",
        swatch_image_url: "",
        manicure_image_url: "",
        description: "",
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container add-color-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Закрыть">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-title-with-badge">
            <h2>Добавить цвет в палитру</h2>
            <div className="storage-badges-container" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                className="storage-badge b2-live"
                style={{
                  background: "#e8f4fd",
                  color: "#0a58ca",
                  borderColor: "#b6d4fe",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  border: "1px solid",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onClick={onOpenStorageGuide}
                title="Backblaze B2 bucket: goldhandsbusket (активен)"
              >
                <CloudUpload size={13} />
                <span>B2: goldhandsbusket</span>
              </span>

              <span
                className={`storage-badge ${isSupabaseActive ? "supabase-live" : "local-live"}`}
                onClick={onOpenStorageGuide}
                title="Нажмите для просмотра настроек Supabase & Backblaze B2"
              >
                {isSupabaseActive ? "⚡ Supabase подключен" : "💾 Каталог активен"}
                <HelpCircle size={14} />
              </span>
            </div>
          </div>
          <p className="modal-subtitle">
            Загружайте фото напрямую в облако <strong>Backblaze B2 (goldhandsbusket)</strong> или вставляйте ссылки
          </p>
        </div>

        {errorMsg && (
          <div className="form-error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-color-form">
          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="title">Название цвета / оттенка *</label>
              <input
                id="title"
                type="text"
                placeholder="Например: Нежный молочный нюд"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shade_code">Номер / Код оттенка</label>
              <input
                id="shade_code"
                type="text"
                placeholder="Например: #104 или N-01"
                value={formData.shade_code}
                onChange={(e) => setFormData({ ...formData, shade_code: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row three-cols">
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ColorCategory })
                }
              >
                <option value="nude">Нюдовые / Молочные</option>
                <option value="red">Красные / Винные</option>
                <option value="dark">Темные / Глубокие</option>
                <option value="pastel">Пастельные тона</option>
                <option value="glitter">Шиммер / Блестки</option>
                <option value="bright">Яркие</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="finish">Финиш покрытия</label>
              <select
                id="finish"
                value={formData.finish}
                onChange={(e) =>
                  setFormData({ ...formData, finish: e.target.value as ColorFinish })
                }
              >
                <option value="glossy">Глянцевый</option>
                <option value="matte">Матовый</option>
                <option value="shimmer">Шиммерный</option>
                <option value="reflective">Светоотражающий</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color_hex">Цвет индикатора (HEX)</label>
              <div className="hex-input-group">
                <input
                  type="color"
                  value={formData.color_hex || "#f5ebe6"}
                  onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                  className="color-picker-input"
                />
                <input
                  type="text"
                  placeholder="#F5EBE6"
                  value={formData.color_hex}
                  onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Бренд гель-лака</label>
            <input
              id="brand"
              type="text"
              placeholder="Например: Luxio, Uno, Kodi, EMI"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          {/* СЕКЦИЯ 2-Х ФОТО С ПРЯМОЙ ЗАГРУЗКОЙ В BACKBLAZE B2 */}
          <div className="photos-upload-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 className="section-label" style={{ margin: 0 }}>Два фото карточки:</h4>
              <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                ☁️ Прямая отправка в <strong>goldhandsbusket</strong>
              </span>
            </div>

            <div className="photos-upload-grid">
              {/* ФОТО 1: Цвет/свотч */}
              <div className="photo-field-card">
                <span className="photo-card-title">1. Фото цвета (свотч / флакон) *</span>

                {formData.swatch_image_url ? (
                  <div className="preview-box">
                    <img src={formData.swatch_image_url} alt="Превью цвета" />
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={() => setFormData({ ...formData, swatch_image_url: "" })}
                    >
                      <X size={14} />
                    </button>
                    {formData.swatch_image_url.includes("backblazeb2") && (
                      <span className="b2-uploaded-tag" style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "6px",
                        background: "rgba(10, 88, 202, 0.85)",
                        color: "#fff",
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                      }}>
                        <CheckCircle size={10} /> В B2
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="empty-preview-placeholder">
                    {uploadingSwatch ? (
                      <Loader2 size={32} className="spin-animate" style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      <ImageIcon size={32} />
                    )}
                    <span>{uploadingSwatch ? "Загрузка в Backblaze B2..." : "Образец оттенка"}</span>
                  </div>
                )}

                <div className="upload-file-hint" style={{ marginTop: "10px" }}>
                  <label className="file-select-label" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    width: "100%",
                    justifyContent: "center",
                    cursor: uploadingSwatch ? "wait" : "pointer",
                    opacity: uploadingSwatch ? 0.7 : 1
                  }}>
                    {uploadingSwatch ? <Loader2 size={16} className="spin-animate" /> : <CloudUpload size={16} />}
                    <span>{uploadingSwatch ? "Загружаем в B2..." : "Загрузить в Backblaze B2"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSwatch}
                      onChange={(e) => handleFileUploadToB2(e, "swatch_image_url")}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  placeholder="или вставьте прямую ссылку..."
                  value={formData.swatch_image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, swatch_image_url: e.target.value })
                  }
                  className="url-input"
                  style={{ marginTop: "8px", fontSize: "0.8rem" }}
                />
              </div>

              {/* ФОТО 2: Готовый маникюр */}
              <div className="photo-field-card">
                <span className="photo-card-title">2. Фото готового маникюра на ногтях *</span>

                {formData.manicure_image_url ? (
                  <div className="preview-box">
                    <img src={formData.manicure_image_url} alt="Превью маникюра" />
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={() => setFormData({ ...formData, manicure_image_url: "" })}
                    >
                      <X size={14} />
                    </button>
                    {formData.manicure_image_url.includes("backblazeb2") && (
                      <span className="b2-uploaded-tag" style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "6px",
                        background: "rgba(10, 88, 202, 0.85)",
                        color: "#fff",
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                      }}>
                        <CheckCircle size={10} /> В B2
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="empty-preview-placeholder">
                    {uploadingManicure ? (
                      <Loader2 size={32} className="spin-animate" style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      <ImageIcon size={32} />
                    )}
                    <span>{uploadingManicure ? "Загрузка в Backblaze B2..." : "Маникюр на ногтях"}</span>
                  </div>
                )}

                <div className="upload-file-hint" style={{ marginTop: "10px" }}>
                  <label className="file-select-label" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    width: "100%",
                    justifyContent: "center",
                    cursor: uploadingManicure ? "wait" : "pointer",
                    opacity: uploadingManicure ? 0.7 : 1
                  }}>
                    {uploadingManicure ? <Loader2 size={16} className="spin-animate" /> : <CloudUpload size={16} />}
                    <span>{uploadingManicure ? "Загружаем в B2..." : "Загрузить в Backblaze B2"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingManicure}
                      onChange={(e) => handleFileUploadToB2(e, "manicure_image_url")}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  placeholder="или вставьте прямую ссылку..."
                  value={formData.manicure_image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, manicure_image_url: e.target.value })
                  }
                  className="url-input"
                  style={{ marginTop: "8px", fontSize: "0.8rem" }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание и рекомендации мастера</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Например: Идеален в 2 тонких слоя. Прекрасно сочетается с серебряной фольгой и нюдовой базой."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting || uploadingSwatch || uploadingManicure}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || uploadingSwatch || uploadingManicure}
            >
              <Plus size={18} />
              <span>{isSubmitting ? "Сохранение..." : "Сохранить оттенок"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
