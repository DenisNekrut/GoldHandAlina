import { getSupabase, isSupabaseConfigured } from "../../lib/supabase";
import { INITIAL_NAIL_COLORS } from "./mockData";
import type { NailColor, NewNailColorInput } from "./types";

const LOCAL_STORAGE_KEY = "goldhand_alina_nail_colors";

export const colorService = {
  // Проверка статуса подключения к облачной БД
  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  },

  // Загрузка всех цветов
  async getAll(): Promise<NailColor[]> {
    // 1. Попытка загрузить из Supabase (если настроен)
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("nail_colors")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          if (data.length > 0) {
            return data as NailColor[];
          }
          // Если таблица создана, но пуста - авто-заполняем ее стартовыми оттенками
          try {
            const seedRows = INITIAL_NAIL_COLORS.map((c) => ({
              id: c.id,
              title: c.title,
              shade_code: c.shade_code,
              color_hex: c.color_hex,
              swatch_image_url: c.swatch_image_url,
              manicure_image_url: c.manicure_image_url,
              category: c.category,
              finish: c.finish,
              brand: c.brand,
              description: c.description,
              created_at: c.created_at,
            }));
            const { data: inserted, error: insertErr } = await supabase
              .from("nail_colors")
              .insert(seedRows)
              .select();

            if (!insertErr && inserted && inserted.length > 0) {
              return inserted as NailColor[];
            }
          } catch (seedErr) {
            console.warn("Auto-seed error:", seedErr);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch error, checking Backblaze B2:", err);
      }
    }

    // 2. Попытка загрузить из облачного хранилища Backblaze B2 (/api/colors)
    try {
      const b2Res = await fetch("/api/colors");
      if (b2Res.ok) {
        const json = await b2Res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data as NailColor[];
        }
      }
    } catch (err) {
      console.warn("B2 storage fetch error, checking local storage:", err);
    }

    // 3. Fallback: localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // 4. Fallback: начальные сохраненные данные
    return INITIAL_NAIL_COLORS;
  },

  // Сохранение нового цвета
  async add(input: NewNailColorInput): Promise<NailColor> {
    const supabase = getSupabase();
    const newColor: NailColor = {
      ...input,
      id: "nc-" + Date.now(),
      created_at: new Date().toISOString(),
    };

    // 1. Сохранение в Supabase (если настроен)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("nail_colors")
          .insert([
            {
              title: input.title,
              shade_code: input.shade_code,
              category: input.category,
              swatch_image_url: input.swatch_image_url,
              manicure_image_url: input.manicure_image_url,
              color_hex: input.color_hex || null,
              finish: input.finish || "glossy",
              brand: input.brand || null,
              description: input.description || null,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          newColor.id = data.id;
        }
      } catch (err) {
        console.warn("Supabase insert error, saving to B2 & locally:", err);
      }
    }

    // 2. Сохранение в Backblaze B2 хранилище
    try {
      await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      });
    } catch (err) {
      console.warn("Failed to persist new color to B2:", err);
    }

    // 3. Сохранение в локальный список в браузере
    try {
      const current = await this.getAll();
      const updated = [newColor, ...current.filter((c) => c.id !== newColor.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    return newColor;
  },

  // Удаление цвета
  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from("nail_colors").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }

    try {
      const current = await this.getAll();
      const filtered = current.filter((c) => c.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

      // Синхронизация с Backblaze B2
      await fetch("/api/colors/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: filtered }),
      });
    } catch {
      // ignore
    }
  },

  // Подписка на изменения в реальном времени (Supabase Realtime)
  subscribeToChanges(onUpdate: () => void): () => void {
    const supabase = getSupabase();
    if (!supabase) return () => {};

    const channel = supabase
      .channel("nail_colors_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nail_colors" },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Сброс к исходным демо-данным
  resetToDemo(): NailColor[] {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return INITIAL_NAIL_COLORS;
  },

  // Преобразование URL изображений с учетом базового пути (для GitHub Pages и локального хостинга)
  resolveImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const base = import.meta.env.BASE_URL || "/";
    // Если ссылка вида /api/b2/file/nail-colors/filename.jpg
    if (url.startsWith("/api/b2/file/nail-colors/")) {
      const filename = url.replace("/api/b2/file/nail-colors/", "");
      return `${base.replace(/\/$/, "")}/nail-colors/${filename}`;
    }
    // Если ссылка уже вида /nail-colors/filename.jpg
    if (url.startsWith("/nail-colors/")) {
      return `${base.replace(/\/$/, "")}${url}`;
    }
    return url;
  },
};
