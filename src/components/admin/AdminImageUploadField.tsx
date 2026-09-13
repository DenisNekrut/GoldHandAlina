import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { b2ClientService } from "../../lib/b2Client";

interface AdminImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  hint?: string;
  fallbackEmoji?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export const AdminImageUploadField = ({
  label,
  value,
  onChange,
  placeholder = "https://... или загрузите файл",
  hint,
  fallbackEmoji,
  aspectRatio = "portrait",
}: AdminImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Сброс поля выбора, чтобы можно было выбрать тот же файл снова
    e.target.value = "";

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Читаем локально
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Пробуем загрузить в Backblaze B2 через серверный API
      try {
        const publicUrl = await b2ClientService.uploadDataUrl(
          dataUrl,
          file.name,
          file.type
        );
        onChange(publicUrl);
      } catch (cloudErr) {
        console.warn("Backblaze B2 upload fallback to dataURL:", cloudErr);
        // Безопасный fallback: сохраняем как оптимизированный dataUrl
        onChange(dataUrl);
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err: any) {
      console.error("Failed to process image file:", err);
      setUploadError(err.message || "Ошибка чтения файла");
    } finally {
      setIsUploading(false);
    }
  };

  const aspectClass =
    aspectRatio === "square"
      ? "w-20 h-20"
      : aspectRatio === "portrait"
      ? "w-20 h-28"
      : "w-32 h-20";

  return (
    <div className="admin-field">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="text-xs font-semibold text-stone-700 m-0">
          {label}
        </label>
        {fallbackEmoji && (
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <span>Смайлик по умолчанию:</span>
            <span className="text-sm">{fallbackEmoji}</span>
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
        {/* Превью изображения или заглушка */}
        <div
          className={`${aspectClass} relative shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center shadow-inner group`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <button
                type="button"
                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => onChange("")}
                title="Удалить фото"
              >
                <X size={18} />
              </button>
            </>
          ) : fallbackEmoji ? (
            <div className="flex flex-col items-center justify-center text-stone-400 p-2 text-center">
              <span className="text-2xl mb-0.5">{fallbackEmoji}</span>
              <span className="text-[9px] text-stone-400 leading-tight">Нет фото</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-400 p-2 text-center">
              <ImageIcon size={22} className="mb-1 opacity-50" />
              <span className="text-[9px] leading-tight">Нет фото</span>
            </div>
          )}
        </div>

        {/* Поле ввода URL и кнопки загрузки */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
          <div className="relative flex items-center">
            <LinkIcon size={14} className="absolute left-2.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              className="admin-input !pl-8 text-xs font-mono"
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            {value && (
              <button
                type="button"
                className="absolute right-2 text-stone-400 hover:text-stone-600 p-1"
                onClick={() => onChange("")}
                title="Очистить"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="admin-btn secondary text-xs !py-1 !px-2.5 flex items-center gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-amber-700" />
                  <span>Загрузка...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check size={13} className="text-green-600" />
                  <span className="text-green-700">Загружено!</span>
                </>
              ) : (
                <>
                  <Upload size={13} />
                  <span>Загрузить фото с устройства</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                className="text-xs text-stone-500 hover:text-red-600 transition-colors"
                onClick={() => onChange("")}
              >
                Удалить фото
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadError && (
            <span className="text-[11px] text-red-600">{uploadError}</span>
          )}

          {hint && !uploadError && (
            <span className="text-[11px] text-stone-400 leading-tight">
              {hint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
