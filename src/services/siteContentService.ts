import { getSupabase } from "../lib/supabase";
import type { SiteContent } from "../types/content";

const LOCAL_STORAGE_KEY = "goldhands_site_content_v1";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  version: 1,
  updatedAt: new Date().toISOString(),
  general: {
    brandNamePart1: "Gold",
    brandNamePart2: "Hands",
    tagline: "Студия идеального маникюра и педикюра",
    allowedEmails: ["lty2015@mail.ru", "lty8650@gmail.com", "alina_nekrut1701@mail.ru"],
    allowedGithubUsernames: ["DenisNekrut"],
  },
  hero: {
    badge: "✨ Профессиональный мастер",
    titleLine1: "Идеальный маникюр",
    titleLine2: "для ваших рук",
    description:
      "Создаю неповторимый дизайн ногтей с любовью к деталям. Индивидуальный подход и стерильность — мой главный принцип.",
    btnBookText: "Записаться",
    btnPortfolioText: "Смотреть работы",
    btnPaletteText: "Палитра цветов",
    statYears: "3+",
    statYearsLabel: "года опыта",
    statClients: "100+",
    statClientsLabel: "довольных клиентов",
    statSterility: "100%",
    statSterilityLabel: "стерильность",
    avatarEmoji: "💅",
  },
  services: {
    title: "Мои услуги",
    subtitle:
      "Выбирайте то, что подходит именно вам — каждый сеанс создаётся с заботой о вас",
    items: [
      {
        id: "srv-1",
        icon: "hands",
        title: "Классический маникюр",
        description:
          "Аккуратный уход за руками и ногтями, обрезной или европейский метод.",
        price: "от 1500 ₽",
      },
      {
        id: "srv-2",
        icon: "brush",
        title: "Дизайн ногтей",
        description:
          "Любой дизайн: френч, градиент, стемпинг, слайдеры, роспись, стразы.",
        price: "от 500 ₽",
      },
      {
        id: "srv-3",
        icon: "magic",
        title: "Наращивание ногтей",
        description:
          "Укрепление и моделирование ногтей гелем или акрилом любой длины.",
        price: "от 2500 ₽",
      },
      {
        id: "srv-4",
        icon: "spa",
        title: "SPA-уход для рук",
        description:
          "Пилинг, маски, парафинотерапия и расслабляющий массаж кистей.",
        price: "от 800 ₽",
      },
    ],
  },
  portfolio: {
    title: "Портфолио",
    subtitle: "Каждая работа — результат вдохновения и профессионализма",
    categories: [
      { id: "all", label: "Все работы" },
      { id: "classic", label: "Классика" },
      { id: "design", label: "Дизайн" },
      { id: "extensions", label: "Наращивание" },
    ],
    items: [
      { id: 1, category: "classic", title: "Френч с золотом", emoji: "✨" },
      { id: 2, category: "design", title: "Мраморный дизайн", emoji: "🖤" },
      { id: 3, category: "extensions", title: "Укрепление гелем", emoji: "💪" },
      { id: 4, category: "classic", title: "Розовый омбре", emoji: "🌸" },
      { id: 5, category: "design", title: "Стразы и блеск", emoji: "💎" },
      { id: 6, category: "extensions", title: "Длинные ногти", emoji: "🌟" },
    ],
  },
  about: {
    title: "Обо мне",
    paragraph1:
      "Привет! Меня зовут Алина, я профессиональный мастер маникюра и педикюра. Моя страсть — создавать красоту и дарить уверенность каждой женщине.",
    paragraph2:
      "Я постоянно совершенствую свои навыки, прохожу мастер-классы и слежу за новейшими трендами в нейл-индустрии. Для меня важно, чтобы каждая клиентка чувствовала себя особенной и уходила с отличным настроением.",
    avatarEmoji: "👩‍🎨",
    features: [
      {
        id: "feat-1",
        icon: "check",
        text: "Более 3 лет профессионального опыта",
      },
      {
        id: "feat-2",
        icon: "heart",
        text: "Индивидуальный подход к каждой клиентке",
      },
      {
        id: "feat-3",
        icon: "shield",
        text: "Стерильность и безопасность на 100%",
      },
      {
        id: "feat-4",
        icon: "star",
        text: "Постоянное обучение новым техникам",
      },
    ],
  },
  reviews: {
    title: "Отзывы",
    subtitle: "Что говорят мои клиенты",
    items: [
      {
        id: "rev-1",
        name: "Екатерина",
        text: "Алина — настоящий профессионал! Сделала маникюр, который держится уже 3 недели. Дизайн просто волшебный, все аккуратно и стерильно. Обязательно вернусь ещё!",
        rating: 5,
        date: "2 недели назад",
      },
      {
        id: "rev-2",
        name: "Мария",
        text: "Очень довольна результатом! Спасибо за индивидуальный подход и внимание к деталям. Парафинотерапия — это отдельное удовольствие. Рекомендую всем!",
        rating: 5,
        date: "1 месяц назад",
      },
      {
        id: "rev-3",
        name: "Ольга",
        text: "Прекрасный мастер! Нарастила ногти к свадьбе, выглядели просто шикарно. Алина учла все мои пожелания и сделала ногти идеальной формы. Спасибо огромное!",
        rating: 5,
        date: "2 месяца назад",
      },
      {
        id: "rev-4",
        name: "Светлана",
        text: "Всегда хожу только к Алине! Отличное качество, приятная атмосфера и всегда свежие идеи для дизайна. Мои любимые ногти теперь только здесь.",
        rating: 5,
        date: "3 месяца назад",
      },
    ],
  },
  contacts: {
    title: "Контакты",
    subtitle: "Свяжитесь со мной удобным способом",
    formTitle: "Записаться на приём",
    formSubtitle: "Оставьте заявку, и я свяжусь с вами",
    infoItems: [
      {
        id: "c-address",
        type: "address",
        title: "Адрес",
        details: "г. Москва, г. Троицк, ул. Новая, д. 2, студия 31",
      },
      {
        id: "c-phone",
        type: "phone",
        title: "Телефон",
        details: "+7 (995) 658-96-40",
        link: "tel:+79956589640",
      },
      {
        id: "c-email",
        type: "email",
        title: "Email",
        details: "alina_nekrut1701@mail.ru",
        link: "mailto:alina_nekrut1701@mail.ru",
      },
      {
        id: "c-booking",
        type: "booking",
        title: "Записаться онлайн",
        details: "Dikidi.ru",
        link: "https://dikidi.ru/1742415",
      },
    ],
    socials: [
      {
        id: "soc-vk",
        type: "vk",
        label: "VK",
        url: "https://vk.ru/id609435917",
      },
      {
        id: "soc-tg",
        type: "telegram",
        label: "Telegram",
        url: "https://t.me",
      },
      {
        id: "soc-ig",
        type: "instagram",
        label: "Instagram",
        url: "https://instagram.com",
      },
    ],
  },
};

// Проверка локального кэша
function getLocalContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.hero && parsed.services) {
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          general: {
            ...DEFAULT_SITE_CONTENT.general,
            ...(parsed.general || {}),
          },
        };
      }
    }
  } catch (e) {
    console.warn("Failed to load local content cache:", e);
  }
  return null;
}

function saveLocalContent(content: SiteContent): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn("Failed to save local content cache:", e);
  }
}

export const siteContentService = {
  // Загрузка всего контента сайта (Supabase -> LocalStorage -> Default)
  async getContent(): Promise<SiteContent> {
    const local = getLocalContent();
    const supabase = getSupabase();

    if (!supabase) {
      return local || DEFAULT_SITE_CONTENT;
    }

    try {
      // 1. Проверяем таблицу site_content, если она создана
      const { data: scData, error: scErr } = await supabase
        .from("site_content")
        .select("data")
        .eq("key", "main")
        .maybeSingle();

      if (!scErr && scData?.data) {
        const remoteContent = scData.data as SiteContent;
        const merged: SiteContent = {
          ...DEFAULT_SITE_CONTENT,
          ...remoteContent,
          general: {
            ...DEFAULT_SITE_CONTENT.general,
            ...(remoteContent.general || {}),
          },
        };
        saveLocalContent(merged);
        return merged;
      }

      // 2. Fallback: проверяем системную запись в nail_colors
      const { data: setRow, error: setErr } = await supabase
        .from("nail_colors")
        .select("description")
        .eq("id", "__site_settings__")
        .maybeSingle();

      if (!setErr && setRow?.description) {
        try {
          const parsed = JSON.parse(setRow.description);
          if (parsed && parsed.hero && parsed.services) {
            const merged: SiteContent = {
              ...DEFAULT_SITE_CONTENT,
              ...parsed,
              general: {
                ...DEFAULT_SITE_CONTENT.general,
                ...(parsed.general || {}),
              },
            };
            saveLocalContent(merged);
            return merged;
          }
        } catch (parseErr) {
          console.warn("Failed to parse remote __site_settings__ JSON:", parseErr);
        }
      }
    } catch (e) {
      console.warn("Supabase fetch site content error:", e);
    }

    return local || DEFAULT_SITE_CONTENT;
  },

  // Сохранение отредактированного контента в Supabase и кэш
  async saveContent(content: SiteContent): Promise<boolean> {
    const updatedContent: SiteContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };

    saveLocalContent(updatedContent);
    const supabase = getSupabase();

    if (!supabase) {
      return true;
    }

    let saved = false;

    // 1. Попытка сохранения в site_content (если таблица существует)
    try {
      const { error: scErr } = await supabase
        .from("site_content")
        .upsert({
          key: "main",
          data: updatedContent,
          updated_at: new Date().toISOString(),
        });

      if (!scErr) {
        saved = true;
      }
    } catch {
      // Игнорируем ошибку отсутствия таблицы
    }

    // 2. Гарантированное сохранение в nail_colors (__site_settings__)
    try {
      const payloadString = JSON.stringify(updatedContent);
      const { error: ncErr } = await supabase.from("nail_colors").upsert({
        id: "__site_settings__",
        title: "__SITE_SETTINGS__",
        swatch_image_url: "none",
        manicure_image_url: "none",
        description: payloadString,
      });

      if (!ncErr) {
        saved = true;
      } else {
        console.error("Failed to save __site_settings__ to Supabase:", ncErr);
      }
    } catch (e) {
      console.error("Error saving __site_settings__:", e);
    }

    return saved;
  },

  // Сброс к дефолтному контенту
  async resetToDefault(): Promise<SiteContent> {
    await this.saveContent(DEFAULT_SITE_CONTENT);
    return DEFAULT_SITE_CONTENT;
  },

  // Подписка на изменения в реальном времени
  subscribeToChanges(onUpdate: (content: SiteContent) => void): () => void {
    const supabase = getSupabase();
    if (!supabase) return () => {};

    const channel = supabase
      .channel("site_settings_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nail_colors",
          filter: "id=eq.__site_settings__",
        },
        async () => {
          const fresh = await this.getContent();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Проверка прав пользователя на доступ к панели администратора
  isUserAllowedAdmin(
    user: {
      email?: string | null;
      user_metadata?: { user_name?: string; preferred_username?: string } | null;
    } | null,
    currentContent?: SiteContent
  ): boolean {
    if (!user) return false;

    const configuredEmails = currentContent?.general?.allowedEmails || [];
    const defaultEmails = DEFAULT_SITE_CONTENT.general.allowedEmails;
    const allowedEmails = Array.from(new Set([...configuredEmails, ...defaultEmails]));

    const configuredGithub = currentContent?.general?.allowedGithubUsernames || [];
    const defaultGithub = DEFAULT_SITE_CONTENT.general.allowedGithubUsernames;
    const allowedGithub = Array.from(new Set([...configuredGithub, ...defaultGithub]));

    const userEmail = (user.email || "").trim().toLowerCase();
    const githubName = (
      user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username ||
      ""
    ).trim().toLowerCase();

    const isEmailAllowed = allowedEmails.some(
      (e) => e.trim().toLowerCase() === userEmail && userEmail.length > 0
    );
    const isGithubAllowed = allowedGithub.some(
      (g) => g.trim().toLowerCase() === githubName && githubName.length > 0
    );

    return isEmailAllowed || isGithubAllowed;
  },

  // Экспорт данных в JSON для резервного копирования
  exportBackup(content: SiteContent): void {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `goldhands-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Импорт данных из файла JSON
  importBackup(jsonString: string): SiteContent {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.hero || !parsed.services) {
      throw new Error("Неверный формат файла резервной копии.");
    }
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      general: {
        ...DEFAULT_SITE_CONTENT.general,
        ...(parsed.general || {}),
      },
    };
  },
};
