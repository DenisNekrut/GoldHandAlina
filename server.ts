import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  uploadToB2,
  downloadFromB2,
  getJsonFromB2,
  saveJsonToB2,
  getB2Config,
} from "./server/b2Service.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Поддержка JSON тел запросов до 20МБ для передачи изображений
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // --- API ЭНДПОИНТЫ ---

  // Проверка статуса сервера и конфигурации Backblaze B2
  app.get("/api/health", (_req, res) => {
    const b2Config = getB2Config();
    res.json({
      status: "ok",
      storage: {
        provider: "Backblaze B2 (goldhandsbusket)",
        bucket: b2Config.bucketName,
        endpoint: b2Config.endpoint,
        region: b2Config.region,
        configured: b2Config.isConfigured,
      },
    });
  });

  // Получение цветов напрямую из Backblaze B2 (data/colors.json)
  app.get("/api/colors", async (_req, res) => {
    try {
      const colors = await getJsonFromB2("data/colors.json");
      res.json({ success: true, data: colors || [] });
    } catch (err: unknown) {
      console.error("Error fetching colors from B2:", err);
      res.status(500).json({ error: "Failed to fetch colors from B2 storage" });
    }
  });

  // Сохранение/синхронизация полного списка цветов в Backblaze B2
  app.post("/api/colors/sync", async (req, res) => {
    try {
      const { colors } = req.body;
      if (!Array.isArray(colors)) {
        res.status(400).json({ error: "Invalid colors array" });
        return;
      }
      await saveJsonToB2("data/colors.json", colors);
      res.json({ success: true, count: colors.length });
    } catch (err: unknown) {
      console.error("Error saving colors to B2:", err);
      res.status(500).json({ error: "Failed to save colors to B2 storage" });
    }
  });

  // Добавление нового цвета с сохранением в B2
  app.post("/api/colors", async (req, res) => {
    try {
      const newColor = req.body;
      const currentColors = (await getJsonFromB2<unknown[]>("data/colors.json")) || [];
      const updated = [newColor, ...currentColors];
      await saveJsonToB2("data/colors.json", updated);
      res.json({ success: true, data: newColor });
    } catch (err: unknown) {
      console.error("Error adding color to B2:", err);
      res.status(500).json({ error: "Failed to add color to B2" });
    }
  });

  // Прокси для безопасной отдачи файлов и фото из приватного бакета Backblaze B2
  // Маршрут: /api/b2/file/*
  app.get("/api/b2/file/*all", async (req, res) => {
    try {
      // Извлекаем ключ файла из URL
      const allParam = (req.params as unknown as { all?: string | string[] }).all;
      const key = Array.isArray(allParam) ? allParam.join("/") : allParam;
      if (!key) {
        res.status(400).send("File key is required");
        return;
      }

      const file = await downloadFromB2(key);
      if (!file) {
        res.status(404).send("File not found in Backblaze B2");
        return;
      }

      // Кэширование изображений в браузере
      res.setHeader("Content-Type", file.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      res.send(file.buffer);
    } catch (err: unknown) {
      console.error("Error serving B2 file:", err);
      res.status(500).send("Error downloading file from storage");
    }
  });

  // Загрузка фото в Backblaze B2
  app.post("/api/b2/upload", async (req, res) => {
    try {
      const { dataUrl, fileName, contentType } = req.body;

      if (!dataUrl || !fileName) {
        res.status(400).json({ error: "Missing dataUrl or fileName" });
        return;
      }

      // Извлечение base64 из data URL: data:image/png;base64,...
      let mimeType = contentType || "image/jpeg";
      let base64Data = dataUrl;

      if (dataUrl.includes(";base64,")) {
        const parts = dataUrl.split(";base64,");
        mimeType = parts[0].replace("data:", "") || mimeType;
        base64Data = parts[1];
      }

      const buffer = Buffer.from(base64Data, "base64");

      const result = await uploadToB2(buffer, fileName, mimeType);
      res.json({
        success: true,
        url: result.url,
        key: result.key,
        bucket: getB2Config().bucketName,
      });
    } catch (err: unknown) {
      console.error("Backblaze B2 Upload Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image to Backblaze B2";
      res.status(500).json({
        error: errorMessage,
      });
    }
  });

  // Получить статус и информацию о бакете
  app.get("/api/b2/info", (_req, res) => {
    const config = getB2Config();
    res.json({
      bucketName: config.bucketName,
      endpoint: config.endpoint,
      region: config.region,
      keyId: config.keyId ? `${config.keyId.substring(0, 4)}...` : null,
      isConfigured: config.isConfigured,
      urlTemplate: `https://${config.bucketName}.s3.${config.region}.backblazeb2.com/nail-colors/...`,
    });
  });

  // --- VITE MIDDLEWARE ---
  // Обратите внимание: в Express v5 для wildcard SPA маршрутизации используется '*all'
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
