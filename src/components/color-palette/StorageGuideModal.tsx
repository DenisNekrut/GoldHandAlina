import { useState, useEffect } from "react";
import { X, Copy, Check, Database, Cloud, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SUPABASE_SCHEMA_SQL, isSupabaseConfigured } from "../../lib/supabase";
import { b2ClientService, type B2InfoResponse } from "../../lib/b2Client";

interface StorageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageGuideModal = ({ isOpen, onClose }: StorageGuideModalProps) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [b2Info, setB2Info] = useState<B2InfoResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      b2ClientService.getInfo().then((info) => {
        if (info) setB2Info(info);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = isSupabaseConfigured();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const envExampleText = `VITE_SUPABASE_URL=https://inzrvcskvxjfpgzmnjno.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6Ces7ezHFcFyAj1PaVe1TA_vxxbIiZT

# Backblaze B2 S3 Configuration
B2_BUCKET_NAME=goldhandsbusket
B2_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
B2_REGION=eu-central-003
B2_KEY_ID=cb25a6bc1ddd
B2_APPLICATION_KEY=0034630cb42440c0e35eb244bd1adb24cbbeb8dc69`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envExampleText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container guide-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Закрыть">
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Архитектура: Supabase + Backblaze B2</h2>
          <p className="modal-subtitle">
            Интеграция базы данных и облачного S3-хранилища фото
          </p>
        </div>

        {/* Статус B2 и Supabase */}
        <div className="guide-status-banner" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="status-indicator-box">
            <span className="status-dot active" />
            <div>
              <strong>Backblaze B2 (Хранилище данных и фото):</strong>{" "}
              <span className="text-success" style={{ fontWeight: 600 }}>
                Бакет «{b2Info?.bucketName || "goldhandsbusket"}» подключен и синхронизирован
              </span>
              <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "2px" }}>
                Все 8 образцов палитры, фотографии и база сохранены в бакете (каталог <code>nail-colors/</code> и <code>data/colors.json</code>).
              </div>
            </div>
          </div>

          <div className="status-indicator-box">
            <span className={`status-dot ${isConnected ? "active" : "pending"}`} />
            <div>
              <strong>Supabase (Реляционная база данных):</strong>{" "}
              {isConnected ? (
                <span className="text-success">Supabase подключен и синхронизируется</span>
              ) : (
                <span className="text-warning">
                  Работает через облачный Backblaze B2 и локальный кэш. Добавьте <code>VITE_SUPABASE_URL</code> и <code>VITE_SUPABASE_ANON_KEY</code> для включения PostgreSQL в Supabase.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="guide-content-scroll">
          {/* Секция 1: Backblaze B2 */}
          <div className="guide-section">
            <div className="guide-section-header">
              <Cloud className="guide-icon" size={20} />
              <h3>1. Настроенный бакет Backblaze B2</h3>
            </div>
            <div style={{
              background: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "0.88rem",
              lineHeight: 1.6
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "6px" }}>
                <span style={{ color: "#6c757d" }}>Bucket:</span>
                <strong>goldhandsbusket</strong>

                <span style={{ color: "#6c757d" }}>S3 Endpoint:</span>
                <code>https://s3.eu-central-003.backblazeb2.com</code>

                <span style={{ color: "#6c757d" }}>Регион:</span>
                <span>eu-central-003</span>

                <span style={{ color: "#6c757d" }}>KeyID:</span>
                <code>cb25a6bc1ddd</code>

                <span style={{ color: "#6c757d" }}>Шаблон фото:</span>
                <code style={{ wordBreak: "break-all" }}>https://goldhandsbusket.s3.eu-central-003.backblazeb2.com/nail-colors/...</code>
              </div>
            </div>

            <p className="guide-desc" style={{ marginTop: "12px" }}>
              <CheckCircle2 size={16} color="#198754" style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }} />
              <strong>Готово:</strong> Теперь при добавлении нового цвета в палитру кнопка <strong>«Загрузить в Backblaze B2»</strong> сразу отправляет выбранное фото с вашего компьютера/телефона в бакет <code>goldhandsbusket</code> и сохраняет постоянную ссылку!
            </p>
          </div>

          {/* Секция 2: Supabase */}
          <div className="guide-section">
            <div className="guide-section-header">
              <Database className="guide-icon" size={20} />
              <h3>2. База данных: Supabase</h3>
            </div>
            <p className="guide-desc">
              Supabase хранит текстовые параметры (название, код, бренд, категорию) и полученные ссылки на фото из Backblaze B2.
            </p>

            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span>SQL-запрос для Supabase SQL Editor</span>
                <button type="button" className="copy-code-inline" onClick={handleCopySql}>
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSql ? "Скопировано" : "Копировать SQL"}</span>
                </button>
              </div>
              <pre className="code-pre">{SUPABASE_SCHEMA_SQL}</pre>
            </div>

            <div className="env-guide-box">
              <div className="code-block-header">
                <span>Конфигурация окружения (.env)</span>
                <button type="button" className="copy-code-inline" onClick={handleCopyEnv}>
                  {copiedEnv ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedEnv ? "Скопировано" : "Копировать"}</span>
                </button>
              </div>
              <pre className="code-pre">{envExampleText}</pre>
            </div>
          </div>

          {/* Секция 3: Безопасность */}
          <div className="guide-section">
            <div className="guide-section-header">
              <ShieldCheck className="guide-icon" size={20} />
              <h3>3. Защита ключей</h3>
            </div>
            <p className="guide-desc">
              Секретный ключ <code>applicationKey</code> обрабатывается <strong>исключительно на сервере</strong> и никогда не передается в браузер клиента, обеспечивая максимальную безопасность вашего аккаунта Backblaze.
            </p>
          </div>
        </div>

        <div className="guide-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Отлично, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
