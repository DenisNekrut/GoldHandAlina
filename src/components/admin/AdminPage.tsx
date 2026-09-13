import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Briefcase,
  Image,
  User,
  Star,
  Phone,
  Palette,
  Shield,
  Save,
  RotateCcw,
  Download,
  Upload,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { SiteContent, ServiceItem, PortfolioItem, ReviewItem, AboutFeature } from "../../types/content";
import { siteContentService } from "../../services/siteContentService";
import { getSupabase } from "../../lib/supabase";
import { colorService } from "../color-palette/colorService";
import type { NailColor } from "../color-palette/types";
import { AddColorModal } from "../color-palette/AddColorModal";
import { AdminAuthModal } from "./AdminAuthModal";
import "./Admin.css";

interface AdminPageProps {
  onBackToSite: () => void;
}

type TabType = "hero" | "services" | "portfolio" | "about" | "reviews" | "contacts" | "palette" | "access";

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [colors, setColors] = useState<NailColor[]>([]);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const supabase = getSupabase();

  // Загрузка контента и проверка авторизованного пользователя
  useEffect(() => {
    let isMounted = true;
    const client = getSupabase();

    async function init() {
      const loadedContent = await siteContentService.getContent();
      if (!isMounted) return;
      setContent(loadedContent);

      if (client) {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user && siteContentService.isUserAllowedAdmin(session.user, loadedContent)) {
          setCurrentUser(session.user);
        }

        const { data: authListener } = client.auth.onAuthStateChange(
          async (_event, session) => {
            if (session?.user) {
              if (siteContentService.isUserAllowedAdmin(session.user, loadedContent)) {
                setCurrentUser(session.user);
              } else {
                setCurrentUser(null);
              }
            } else {
              setCurrentUser(null);
            }
          }
        );

        setAuthChecking(false);
        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        setAuthChecking(false);
      }
    }

    init();

    // Загрузка оттенков для вкладки палитры
    colorService.getAll().then((data) => {
      if (isMounted) setColors(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveAll = async () => {
    if (!content) return;
    setSaving(true);
    setSaveStatus("idle");

    try {
      const ok = await siteContentService.saveContent(content);
      if (ok) {
        setHasChanges(false);
        setSaveStatus("success");
        setStatusMessage("Все изменения успешно сохранены в Supabase!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage("Не удалось сохранить в Supabase. Проверьте консоль.");
      }
    } catch (e: any) {
      setSaveStatus("error");
      setStatusMessage(e.message || "Ошибка сохранения.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  // Вспомогательные методы обновления секций
  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
    setHasChanges(true);
  };

  const updateGeneral = (field: keyof SiteContent["general"], value: any) => {
    if (!content) return;
    setContent({
      ...content,
      general: { ...content.general, [field]: value },
    });
    setHasChanges(true);
  };

  const updateAbout = (field: keyof SiteContent["about"], value: any) => {
    if (!content) return;
    setContent({
      ...content,
      about: { ...content.about, [field]: value },
    });
    setHasChanges(true);
  };

  const updateContacts = (field: keyof SiteContent["contacts"], value: any) => {
    if (!content) return;
    setContent({
      ...content,
      contacts: { ...content.contacts, [field]: value },
    });
    setHasChanges(true);
  };

  // Услуги (Services)
  const handleUpdateService = (index: number, field: keyof ServiceItem, value: string) => {
    if (!content) return;
    const newItems = [...content.services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({
      ...content,
      services: { ...content.services, items: newItems },
    });
    setHasChanges(true);
  };

  const handleAddService = () => {
    if (!content) return;
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: "Новая услуга",
      description: "Описание новой процедуры и ухода.",
      price: "от 1000 ₽",
      icon: "hands",
    };
    setContent({
      ...content,
      services: {
        ...content.services,
        items: [...content.services.items, newService],
      },
    });
    setHasChanges(true);
  };

  const handleDeleteService = (index: number) => {
    if (!content) return;
    const newItems = content.services.items.filter((_, i) => i !== index);
    setContent({
      ...content,
      services: { ...content.services, items: newItems },
    });
    setHasChanges(true);
  };

  // Портфолио (Portfolio)
  const handleUpdatePortfolioItem = (index: number, field: keyof PortfolioItem, value: any) => {
    if (!content) return;
    const newItems = [...content.portfolio.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({
      ...content,
      portfolio: { ...content.portfolio, items: newItems },
    });
    setHasChanges(true);
  };

  const handleAddPortfolioItem = () => {
    if (!content) return;
    const newItem: PortfolioItem = {
      id: Date.now(),
      category: "classic",
      title: "Новая работа",
      emoji: "💅",
    };
    setContent({
      ...content,
      portfolio: {
        ...content.portfolio,
        items: [...content.portfolio.items, newItem],
      },
    });
    setHasChanges(true);
  };

  const handleDeletePortfolioItem = (index: number) => {
    if (!content) return;
    const newItems = content.portfolio.items.filter((_, i) => i !== index);
    setContent({
      ...content,
      portfolio: { ...content.portfolio, items: newItems },
    });
    setHasChanges(true);
  };

  // Отзывы (Reviews)
  const handleUpdateReview = (index: number, field: keyof ReviewItem, value: any) => {
    if (!content) return;
    const newItems = [...content.reviews.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({
      ...content,
      reviews: { ...content.reviews, items: newItems },
    });
    setHasChanges(true);
  };

  const handleAddReview = () => {
    if (!content) return;
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: "Имя клиента",
      text: "Отличный мастер! Всё очень понравилось, аккуратно и красиво.",
      rating: 5,
      date: "Недавно",
    };
    setContent({
      ...content,
      reviews: {
        ...content.reviews,
        items: [...content.reviews.items, newReview],
      },
    });
    setHasChanges(true);
  };

  const handleDeleteReview = (index: number) => {
    if (!content) return;
    const newItems = content.reviews.items.filter((_, i) => i !== index);
    setContent({
      ...content,
      reviews: { ...content.reviews, items: newItems },
    });
    setHasChanges(true);
  };

  // Обо мне: пункты преимуществ
  const handleUpdateFeature = (index: number, text: string) => {
    if (!content) return;
    const newFeatures = [...content.about.features];
    newFeatures[index] = { ...newFeatures[index], text };
    setContent({
      ...content,
      about: { ...content.about, features: newFeatures },
    });
    setHasChanges(true);
  };

  const handleAddFeature = () => {
    if (!content) return;
    const newFeat: AboutFeature = {
      id: `feat-${Date.now()}`,
      icon: "star",
      text: "Новое преимущество сервиса",
    };
    setContent({
      ...content,
      about: {
        ...content.about,
        features: [...content.about.features, newFeat],
      },
    });
    setHasChanges(true);
  };

  const handleDeleteFeature = (index: number) => {
    if (!content) return;
    const newFeat = content.about.features.filter((_, i) => i !== index);
    setContent({
      ...content,
      about: { ...content.about, features: newFeat },
    });
    setHasChanges(true);
  };

  // Удаление оттенка лака
  const handleDeleteColor = async (id: string, title: string) => {
    if (!confirm(`Удалить оттенок "${title}" из каталога?`)) return;
    try {
      await colorService.delete(id);
      setColors((prev) => prev.filter((c) => c.id !== id));
      setStatusMessage(`Оттенок "${title}" удален из Supabase.`);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (e: any) {
      setStatusMessage(e.message || "Ошибка при удалении оттенка.");
      setSaveStatus("error");
    }
  };

  // Сброс к дефолтному контенту
  const handleResetToDefault = async () => {
    if (!confirm("Внимание: это действие восстановит все тексты сайта к исходным значениям. Продолжить?")) return;
    const def = await siteContentService.resetToDefault();
    setContent(def);
    setHasChanges(false);
    setStatusMessage("Все тексты сайта сброшены к стандартным.");
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  // Бэкап
  const handleExportBackup = () => {
    if (content) {
      siteContentService.exportBackup(content);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = siteContentService.importBackup(text);
        setContent(imported);
        setHasChanges(true);
        setStatusMessage("Резервная копия успешно загружена в редактор! Нажмите 'Сохранить все изменения'.");
        setSaveStatus("success");
      } catch (err: any) {
        alert("Ошибка импорта: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (authChecking || !content) {
    return (
      <div className="admin-page-container flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Загрузка панели управления...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован — показываем окно авторизации
  if (!currentUser) {
    return (
      <AdminAuthModal
        content={content}
        onSuccess={(user) => setCurrentUser(user)}
        onClose={onBackToSite}
      />
    );
  }

  return (
    <div className="admin-page-container">
      {/* Верхний Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">
          <div className="admin-brand">
            <span className="admin-logo-icon">💅</span>
            <div>
              <h1 className="admin-brand-title">
                {content.general.brandNamePart1}
                <span className="text-amber-700">{content.general.brandNamePart2}</span>
                {" "}CMS
              </h1>
            </div>
            <span className="admin-brand-badge">Администратор</span>
          </div>

          <div className="admin-nav-actions">
            <div className="admin-user-badge" title={`Авторизован: ${currentUser.email || currentUser.user_metadata?.user_name}`}>
              <Shield size={14} className="text-amber-700" />
              <span className="admin-user-email">
                {currentUser.email || currentUser.user_metadata?.user_name || "Админ"}
              </span>
            </div>

            <button
              type="button"
              className="admin-btn secondary"
              onClick={onBackToSite}
              title="Перейти к публичной версии сайта"
            >
              <ExternalLink size={16} />
              <span>На сайт</span>
            </button>

            <button
              type="button"
              className={`admin-btn ${hasChanges ? "primary" : "secondary"}`}
              onClick={handleSaveAll}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Сохранение..." : hasChanges ? "Сохранить правки *" : "Сохранено"}</span>
            </button>

            <button
              type="button"
              className="admin-btn text-btn"
              onClick={handleSignOut}
              title="Выйти из аккаунта администратора"
            >
              <LogOut size={16} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент панели */}
      <main className="admin-main">
        {/* Сообщения статуса */}
        {saveStatus === "success" && (
          <div className="admin-alert success mb-6">
            <CheckCircle size={18} />
            <span>{statusMessage || "Изменения успешно сохранены в базе данных Supabase!"}</span>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="admin-alert error mb-6">
            <AlertCircle size={18} />
            <span>{statusMessage || "Ошибка при сохранении в базу данных."}</span>
          </div>
        )}

        {/* Навигационные вкладки разделов */}
        <div className="admin-section-tabs">
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "hero" ? "active" : ""}`}
            onClick={() => setActiveTab("hero")}
          >
            <Sparkles size={16} />
            <span>Главный экран (Hero)</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <Briefcase size={16} />
            <span>Услуги ({content.services.items.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "portfolio" ? "active" : ""}`}
            onClick={() => setActiveTab("portfolio")}
          >
            <Image size={16} />
            <span>Портфолио ({content.portfolio.items.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <User size={16} />
            <span>Обо мне</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <Star size={16} />
            <span>Отзывы ({content.reviews.items.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <Phone size={16} />
            <span>Контакты</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "palette" ? "active" : ""}`}
            onClick={() => setActiveTab("palette")}
          >
            <Palette size={16} />
            <span>Палитра цветов ({colors.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === "access" ? "active" : ""}`}
            onClick={() => setActiveTab("access")}
          >
            <Shield size={16} />
            <span>Доступ & Настройки</span>
          </button>
        </div>

        {/* Вкладка 1: Главный экран (Hero) */}
        {activeTab === "hero" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Главный экран (Hero)</h2>
                <p className="admin-card-desc">
                  Тексты первого экрана, заголовки, статистика и кнопки
                </p>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field full-width">
                <label>Бейдж над заголовком</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.badge}
                  onChange={(e) => updateHero("badge", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Заголовок (строка 1)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.titleLine1}
                  onChange={(e) => updateHero("titleLine1", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Заголовок (строка 2, акцентный цвет)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.titleLine2}
                  onChange={(e) => updateHero("titleLine2", e.target.value)}
                />
              </div>

              <div className="admin-field full-width">
                <label>Описание мастера</label>
                <textarea
                  className="admin-textarea"
                  value={content.hero.description}
                  onChange={(e) => updateHero("description", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Текст кнопки записи</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.btnBookText}
                  onChange={(e) => updateHero("btnBookText", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Текст кнопки портфолио</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.btnPortfolioText}
                  onChange={(e) => updateHero("btnPortfolioText", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Эмодзи или иконка аватара</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.avatarEmoji}
                  onChange={(e) => updateHero("avatarEmoji", e.target.value)}
                />
              </div>

              {/* Блок статистики */}
              <div className="admin-field full-width">
                <h4 className="font-semibold text-sm text-stone-700 mt-2 mb-1">
                  Блок статистики (под кнопками)
                </h4>
              </div>

              <div className="admin-field">
                <label>Опыт (число)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statYears}
                  onChange={(e) => updateHero("statYears", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Опыт (подпись)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statYearsLabel}
                  onChange={(e) => updateHero("statYearsLabel", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Клиенты (число)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statClients}
                  onChange={(e) => updateHero("statClients", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Клиенты (подпись)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statClientsLabel}
                  onChange={(e) => updateHero("statClientsLabel", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Стерильность (число)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statSterility}
                  onChange={(e) => updateHero("statSterility", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Стерильность (подпись)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.hero.statSterilityLabel}
                  onChange={(e) => updateHero("statSterilityLabel", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 2: Услуги (Services) */}
        {activeTab === "services" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Услуги и прайс-лист</h2>
                <p className="admin-card-desc">
                  Добавляйте, удаляйте и редактируйте процедуры и цены
                </p>
              </div>
              <button
                type="button"
                className="admin-btn primary"
                onClick={handleAddService}
              >
                <Plus size={16} />
                <span>Добавить услугу</span>
              </button>
            </div>

            <div className="admin-form-grid mb-6">
              <div className="admin-field">
                <label>Заголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.services.title}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      services: { ...content.services, title: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Подзаголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.services.subtitle}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      services: { ...content.services, subtitle: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>

            <div className="admin-items-list">
              {content.services.items.map((service, index) => (
                <div key={service.id || index} className="admin-item-row">
                  <div className="admin-item-header">
                    <span className="admin-item-number">Услуга #{index + 1}</span>
                    <div className="admin-item-actions">
                      <button
                        type="button"
                        className="admin-btn danger icon-only"
                        onClick={() => handleDeleteService(index)}
                        title="Удалить услугу"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label>Название услуги</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={service.title}
                        onChange={(e) => handleUpdateService(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Стоимость</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={service.price}
                        onChange={(e) => handleUpdateService(index, "price", e.target.value)}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Тип иконки</label>
                      <select
                        className="admin-select"
                        value={service.icon}
                        onChange={(e) => handleUpdateService(index, "icon", e.target.value)}
                      >
                        <option value="hands">Руки (FaHands)</option>
                        <option value="brush">Кисть (FaPaintBrush)</option>
                        <option value="magic">Магия (FaMagic)</option>
                        <option value="spa">SPA (FaSpa)</option>
                      </select>
                    </div>
                    <div className="admin-field full-width">
                      <label>Описание процедуры</label>
                      <textarea
                        className="admin-textarea"
                        value={service.description}
                        onChange={(e) => handleUpdateService(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 3: Портфолио (Portfolio) */}
        {activeTab === "portfolio" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Портфолио</h2>
                <p className="admin-card-desc">
                  Примеры работ, категории и подписи
                </p>
              </div>
              <button
                type="button"
                className="admin-btn primary"
                onClick={handleAddPortfolioItem}
              >
                <Plus size={16} />
                <span>Добавить работу</span>
              </button>
            </div>

            <div className="admin-form-grid mb-6">
              <div className="admin-field">
                <label>Заголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.portfolio.title}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      portfolio: { ...content.portfolio, title: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Подзаголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.portfolio.subtitle}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      portfolio: { ...content.portfolio, subtitle: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>

            <div className="admin-items-list">
              {content.portfolio.items.map((item, index) => (
                <div key={item.id || index} className="admin-item-row">
                  <div className="admin-item-header">
                    <span className="admin-item-number">Работа #{index + 1}</span>
                    <button
                      type="button"
                      className="admin-btn danger icon-only"
                      onClick={() => handleDeletePortfolioItem(index)}
                      title="Удалить работу"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label>Название работы</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.title}
                        onChange={(e) => handleUpdatePortfolioItem(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Категория</label>
                      <select
                        className="admin-select"
                        value={item.category}
                        onChange={(e) => handleUpdatePortfolioItem(index, "category", e.target.value)}
                      >
                        <option value="classic">Классика</option>
                        <option value="design">Дизайн</option>
                        <option value="extensions">Наращивание</option>
                      </select>
                    </div>
                    <div className="admin-field">
                      <label>Эмодзи или значок</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.emoji}
                        onChange={(e) => handleUpdatePortfolioItem(index, "emoji", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 4: Обо мне (About) */}
        {activeTab === "about" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Обо мне</h2>
                <p className="admin-card-desc">
                  Текст презентации мастера и ключевые преимущества
                </p>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field full-width">
                <label>Заголовок секции</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.about.title}
                  onChange={(e) => updateAbout("title", e.target.value)}
                />
              </div>

              <div className="admin-field full-width">
                <label>Абзац 1 (Приветствие и опыт)</label>
                <textarea
                  className="admin-textarea"
                  value={content.about.paragraph1}
                  onChange={(e) => updateAbout("paragraph1", e.target.value)}
                />
              </div>

              <div className="admin-field full-width">
                <label>Абзац 2 (Подход и философия)</label>
                <textarea
                  className="admin-textarea"
                  value={content.about.paragraph2}
                  onChange={(e) => updateAbout("paragraph2", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Эмодзи аватара мастера</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.about.avatarEmoji}
                  onChange={(e) => updateAbout("avatarEmoji", e.target.value)}
                />
              </div>
            </div>

            {/* Пункты преимуществ */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-stone-800">Преимущества (список с иконками)</h3>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={handleAddFeature}
                >
                  <Plus size={16} />
                  <span>Добавить пункт</span>
                </button>
              </div>

              <div className="admin-items-list">
                {content.about.features.map((feat, index) => (
                  <div key={feat.id || index} className="admin-item-row">
                    <div className="flex items-center justify-between gap-4">
                      <span className="admin-item-number">Пункт #{index + 1}</span>
                      <button
                        type="button"
                        className="admin-btn danger icon-only"
                        onClick={() => handleDeleteFeature(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="admin-field full-width">
                      <input
                        type="text"
                        className="admin-input"
                        value={feat.text}
                        onChange={(e) => handleUpdateFeature(index, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 5: Отзывы (Reviews) */}
        {activeTab === "reviews" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Отзывы клиентов</h2>
                <p className="admin-card-desc">
                  Добавляйте и редактируйте реальные отзывы клиентов студии
                </p>
              </div>
              <button
                type="button"
                className="admin-btn primary"
                onClick={handleAddReview}
              >
                <Plus size={16} />
                <span>Добавить отзыв</span>
              </button>
            </div>

            <div className="admin-form-grid mb-6">
              <div className="admin-field">
                <label>Заголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.reviews.title}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      reviews: { ...content.reviews, title: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Подзаголовок раздела</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.reviews.subtitle}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      reviews: { ...content.reviews, subtitle: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>

            <div className="admin-items-list">
              {content.reviews.items.map((review, index) => (
                <div key={review.id || index} className="admin-item-row">
                  <div className="admin-item-header">
                    <span className="admin-item-number">Отзыв #{index + 1} — {review.name}</span>
                    <button
                      type="button"
                      className="admin-btn danger icon-only"
                      onClick={() => handleDeleteReview(index)}
                      title="Удалить отзыв"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label>Имя клиента</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={review.name}
                        onChange={(e) => handleUpdateReview(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Оценка (звезд)</label>
                      <select
                        className="admin-select"
                        value={review.rating}
                        onChange={(e) => handleUpdateReview(index, "rating", Number(e.target.value))}
                      >
                        <option value={5}>5 звёзд (★★★★★)</option>
                        <option value={4}>4 звезды (★★★★☆)</option>
                        <option value={3}>3 звезды (★★★☆☆)</option>
                      </select>
                    </div>
                    <div className="admin-field">
                      <label>Дата или период</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={review.date}
                        onChange={(e) => handleUpdateReview(index, "date", e.target.value)}
                      />
                    </div>
                    <div className="admin-field full-width">
                      <label>Текст отзыва</label>
                      <textarea
                        className="admin-textarea"
                        value={review.text}
                        onChange={(e) => handleUpdateReview(index, "text", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 6: Контакты (Contacts) */}
        {activeTab === "contacts" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Контакты и онлайн-запись</h2>
                <p className="admin-card-desc">
                  Адрес студии, телефон, ссылка на Dikidi, социальные сети
                </p>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Заголовок страницы контактов</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.contacts.title}
                  onChange={(e) => updateContacts("title", e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Подзаголовок</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.contacts.subtitle}
                  onChange={(e) => updateContacts("subtitle", e.target.value)}
                />
              </div>

              <div className="admin-field full-width">
                <h4 className="font-semibold text-sm text-stone-700 mt-2 mb-1">
                  Контактная информация студии
                </h4>
              </div>

              {content.contacts.infoItems.map((item, index) => (
                <div key={item.id} className="admin-field full-width p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-stone-500 font-semibold">{item.title} (Заголовок)</label>
                      <input
                        type="text"
                        className="admin-input text-sm"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...content.contacts.infoItems];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          updateContacts("infoItems", newItems);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 font-semibold">Значение (Текст)</label>
                      <input
                        type="text"
                        className="admin-input text-sm"
                        value={item.details}
                        onChange={(e) => {
                          const newItems = [...content.contacts.infoItems];
                          newItems[index] = { ...newItems[index], details: e.target.value };
                          updateContacts("infoItems", newItems);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 font-semibold">Ссылка (tel:, mailto:, https:)</label>
                      <input
                        type="text"
                        className="admin-input text-sm"
                        value={item.link || ""}
                        onChange={(e) => {
                          const newItems = [...content.contacts.infoItems];
                          newItems[index] = { ...newItems[index], link: e.target.value };
                          updateContacts("infoItems", newItems);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="admin-field full-width">
                <h4 className="font-semibold text-sm text-stone-700 mt-4 mb-1">
                  Социальные сети
                </h4>
              </div>

              {content.contacts.socials.map((soc, index) => (
                <div key={soc.id} className="admin-field">
                  <label>{soc.label} (Ссылка на профиль)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={soc.url}
                    onChange={(e) => {
                      const newSocs = [...content.contacts.socials];
                      newSocs[index] = { ...newSocs[index], url: e.target.value };
                      updateContacts("socials", newSocs);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 7: Палитра оттенков (Nail Colors) */}
        {activeTab === "palette" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Палитра оттенков лака ({colors.length})</h2>
                <p className="admin-card-desc">
                  Управление базой оттенков в Supabase: свотчи, готовый маникюр и описания
                </p>
              </div>
              <button
                type="button"
                className="admin-btn primary"
                onClick={() => setIsAddColorOpen(true)}
              >
                <Plus size={16} />
                <span>Добавить оттенок</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="border border-stone-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-800">{color.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-stone-100 text-stone-700 border border-stone-200">
                        {color.shade_code || "—"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-inner"
                        style={{ backgroundColor: color.color_hex || "#ccc" }}
                      />
                      <span className="text-xs text-stone-500 font-medium">
                        {color.brand || "Без бренда"} • {color.finish || "glossy"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center">
                        <img
                          src={colorService.resolveImageUrl(color.swatch_image_url)}
                          alt="Свотч"
                          className="w-full h-24 object-cover rounded-lg border border-stone-200"
                        />
                        <span className="text-[10px] text-stone-500 mt-1 block">Образец</span>
                      </div>
                      <div className="text-center">
                        <img
                          src={colorService.resolveImageUrl(color.manicure_image_url)}
                          alt="Маникюр"
                          className="w-full h-24 object-cover rounded-lg border border-stone-200"
                        />
                        <span className="text-[10px] text-stone-500 mt-1 block">На ногтях</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {color.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">ID: {color.id}</span>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 p-1"
                      onClick={() => handleDeleteColor(color.id, color.title)}
                    >
                      <Trash2 size={13} />
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 8: Доступ & Настройки */}
        {activeTab === "access" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Безопасность & Доступ для одного пользователя</h2>
                <p className="admin-card-desc">
                  Ограничение входа только для конкретного email или GitHub-аккаунта
                </p>
              </div>
            </div>

            <div className="admin-form-grid mb-8">
              <div className="admin-field full-width">
                <label>Разрешенные Email администратора (через запятую)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.general.allowedEmails.join(", ")}
                  onChange={(e) => {
                    const emails = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    updateGeneral("allowedEmails", emails);
                  }}
                  placeholder="lty2015@mail.ru, alina_nekrut1701@mail.ru"
                />
                <span className="admin-hint">
                  Только указанные адреса электронной почты смогут авторизоваться в этой панели.
                </span>
              </div>

              <div className="admin-field full-width">
                <label>Разрешенные GitHub логины (через запятую)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.general.allowedGithubUsernames.join(", ")}
                  onChange={(e) => {
                    const logins = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    updateGeneral("allowedGithubUsernames", logins);
                  }}
                  placeholder="DenisNekrut"
                />
                <span className="admin-hint">
                  Только эти пользователи GitHub смогут войти через кнопку "Войти через GitHub".
                </span>
              </div>
            </div>

            <hr className="border-stone-200 my-6" />

            <div className="mb-6">
              <h3 className="text-base font-bold text-stone-800 mb-2">
                Резервное копирование и экспорт
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Сохраните файл со всеми текстами, ценами и настройками сайта или восстановите их в один клик.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={handleExportBackup}
                >
                  <Download size={16} />
                  <span>Скачать резервную копию (JSON)</span>
                </button>

                <label className="admin-btn secondary cursor-pointer">
                  <Upload size={16} />
                  <span>Загрузить из файла (JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>

                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={handleResetToDefault}
                >
                  <RotateCcw size={16} />
                  <span>Сбросить к исходным настройкам</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Плавающая панель быстрого сохранения */}
      {hasChanges && (
        <div className="admin-sticky-savebar">
          <div className="admin-savebar-status">
            <Clock size={18} className="text-amber-400" />
            <span>У вас есть несохраненные изменения на странице</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="admin-btn text-btn text-white opacity-80 hover:opacity-100"
              onClick={async () => {
                const refreshed = await siteContentService.getContent();
                setContent(refreshed);
                setHasChanges(false);
              }}
            >
              Отменить
            </button>

            <button
              type="button"
              className="admin-btn primary"
              onClick={handleSaveAll}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Сохранение..." : "Сохранить все изменения"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно добавления оттенка */}
      <AddColorModal
        isOpen={isAddColorOpen}
        onClose={() => setIsAddColorOpen(false)}
        isSupabaseActive={Boolean(supabase)}
        onOpenStorageGuide={() => window.open("https://github.com", "_blank")}
        onAdd={async (newColorInput) => {
          const added = await colorService.add(newColorInput);
          setColors((prev) => [added, ...prev]);
          setIsAddColorOpen(false);
          setStatusMessage(`Оттенок "${added.title}" добавлен в каталог!`);
          setSaveStatus("success");
          setTimeout(() => setSaveStatus("idle"), 4000);
        }}
      />
    </div>
  );
};
