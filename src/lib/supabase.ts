import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Переменные окружения для Supabase с предустановленными параметрами проекта
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://inzrvcskvxjfpgzmnjno.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_6Ces7ezHFcFyAj1PaVe1TA_vxxbIiZT";

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project")
  );
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    try {
      client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn("Supabase init error:", e);
      return null;
    }
  }
  return client;
};

// SQL-скрипт для создания таблицы и политик в Supabase SQL Editor
export const SUPABASE_SCHEMA_SQL = `-- ============================================================
-- 1. Таблица для каталога оттенков (nail_colors)
-- ============================================================
create table if not exists public.nail_colors (
  id text primary key default ('nc-' || extract(epoch from now())::bigint::text || '-' || floor(random() * 1000)::text),
  title text not null,
  shade_code text,
  color_hex text,
  swatch_image_url text not null,
  manicure_image_url text not null,
  category text default 'nude',
  finish text default 'glossy',
  brand text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.nail_colors enable row level security;

-- Политики безопасности для nail_colors (SELECT, INSERT, UPDATE, DELETE)
drop policy if exists "Public can view nail colors" on public.nail_colors;
create policy "Public can view nail colors" 
  on public.nail_colors for select 
  using (true);

drop policy if exists "Public can insert colors" on public.nail_colors;
create policy "Public can insert colors" 
  on public.nail_colors for insert 
  with check (true);

drop policy if exists "Public can update colors" on public.nail_colors;
create policy "Public can update colors" 
  on public.nail_colors for update 
  using (true)
  with check (true);

drop policy if exists "Public can delete colors" on public.nail_colors;
create policy "Public can delete colors" 
  on public.nail_colors for delete 
  using (true);

-- ============================================================
-- 2. Таблица для настроек и контента сайта (site_content)
-- ============================================================
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.site_content enable row level security;

-- Политики безопасности для site_content (SELECT, INSERT, UPDATE, DELETE)
drop policy if exists "Allow all on site_content" on public.site_content;
create policy "Allow all on site_content" 
  on public.site_content for all 
  using (true) 
  with check (true);

-- Включение real-time уведомлений
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'nail_colors') then
    alter publication supabase_realtime add table public.nail_colors;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_content') then
    alter publication supabase_realtime add table public.site_content;
  end if;
exception when others then
  null;
end $$;

-- 3. Заполнение стартовыми оттенками палитры
insert into public.nail_colors (id, title, shade_code, color_hex, swatch_image_url, manicure_image_url, category, finish, brand, description, created_at)
values
  ('nc-1', 'Нежный молочный нюд', 'N-01', '#F5EBE6', '/api/b2/file/nail-colors/1789291410514-swatch_nc-1_N-01.jpg', '/api/b2/file/nail-colors/1789291410801-manicure_nc-1_N-01.jpg', 'nude', 'glossy', 'Luxio', 'Универсальный полупрозрачный молочно-розовый оттенок. Идеальная база под френч и для утонченного естественного покрытия.', '2026-03-01T10:00:00Z'),
  ('nc-2', 'Винный бургунди & рубин', 'R-08', '#6B1D2F', '/api/b2/file/nail-colors/1789291411051-swatch_nc-2_R-08.jpg', '/api/b2/file/nail-colors/1789291411267-manicure_nc-2_R-08.jpg', 'red', 'glossy', 'Uno Super', 'Глубокий винный оттенок спелой черешни. Роскошная классика, подчеркивающая ухоженность и статус.', '2026-03-02T11:00:00Z'),
  ('nc-3', 'Кашемировый пудровый розовый', 'P-14', '#E8C5C8', '/api/b2/file/nail-colors/1789291412021-swatch_nc-3_P-14.jpg', '/api/b2/file/nail-colors/1789291416428-manicure_nc-3_P-14.jpg', 'nude', 'glossy', 'Kodi Professional', 'Пыльно-розовый теплый оттенок с кремовой текстурой. Прекрасно гармонирует с любым тоном кожи.', '2026-03-03T12:00:00Z'),
  ('nc-4', 'Искрящееся розовое шампанское', 'G-05', '#D4AF37', '/api/b2/file/nail-colors/1789291417123-swatch_nc-4_G-05.jpg', '/api/b2/file/nail-colors/1789291417889-manicure_nc-4_G-05.jpg', 'glitter', 'shimmer', 'E.Mi', 'Мельчайший золотисто-розовый шиммер с ослепительным сиянием при искусственном и солнечном свете.', '2026-03-04T13:00:00Z'),
  ('nc-5', 'Шоколадный вельвет', 'D-19', '#3E2723', '/api/b2/file/nail-colors/1789291418218-swatch_nc-5_D-19.jpg', '/api/b2/file/nail-colors/1789291418412-manicure_nc-5_D-19.jpg', 'dark', 'glossy', 'Luxio', 'Богатый оттенок горького шоколада и кофе эспрессо. Смотрится дорого, стильно и современно.', '2026-03-05T14:00:00Z'),
  ('nc-6', 'Лавандовая пастель', 'L-07', '#D1C4E9', '/api/b2/file/nail-colors/1789291419024-swatch_nc-6_L-07.jpg', '/api/b2/file/nail-colors/1789291419367-manicure_nc-6_L-07.jpg', 'pastel', 'glossy', 'Vogue Nails', 'Воздушный пастельно-сиреневый оттенок весенней свежести. Создает романтичный и легкий образ.', '2026-03-06T15:00:00Z'),
  ('nc-7', 'Алый голливудский классик', 'R-01', '#C62828', '/api/b2/file/nail-colors/1789291420005-swatch_nc-7_R-01.jpg', '/api/b2/file/nail-colors/1789291422219-manicure_nc-7_R-01.jpg', 'red', 'glossy', 'OPI GelColor', 'Безупречный чисто-красный цвет без ухода в рыжину или синеву. Настоящая икона стильного маникюра.', '2026-03-07T16:00:00Z'),
  ('nc-8', 'Светоотражающий серебряный флеш', 'G-11', '#B0BEC5', '/api/b2/file/nail-colors/1789291422707-swatch_nc-8_G-11.jpg', '/api/b2/file/nail-colors/1789291423020-manicure_nc-8_G-11.jpg', 'glitter', 'reflective', 'Flash Diamond', 'Хит сезона! При дневном свете — сдержанный серебристый блеск, а со вспышкой взрывается ослепительными искрами.', '2026-03-08T17:00:00Z')
on conflict (id) do nothing;
`;
