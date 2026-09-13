import crypto from "crypto";

// Backblaze B2 конфигурация (по умолчанию используются переданные пользователем данные)
const BUCKET_NAME = process.env.B2_BUCKET_NAME || "goldhandsbusket";
const KEY_ID = process.env.B2_KEY_ID || "cb25a6bc1ddd";
const APPLICATION_KEY =
  process.env.B2_APPLICATION_KEY || "0034630cb42440c0e35eb244bd1adb24cbbeb8dc69";

interface B2AuthData {
  accountId: string;
  apiUrl: string;
  downloadUrl: string;
  authorizationToken: string;
  expiresAt: number;
}

let cachedAuth: B2AuthData | null = null;
let cachedBucketId: string | null = null;

/**
 * Авторизация в Backblaze B2 Native API
 */
export async function authorizeB2(): Promise<B2AuthData> {
  const now = Date.now();
  // Кэш валиден 23 часа (токен действует 24 часа)
  if (cachedAuth && cachedAuth.expiresAt > now) {
    return cachedAuth;
  }

  const authHeader =
    "Basic " + Buffer.from(`${KEY_ID}:${APPLICATION_KEY}`).toString("base64");

  const response = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      headers: { Authorization: authHeader },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`B2 Authorization failed: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    accountId: string;
    authorizationToken: string;
    apiInfo: {
      storageApi: {
        apiUrl: string;
        downloadUrl: string;
      };
    };
  };

  cachedAuth = {
    accountId: data.accountId,
    apiUrl: data.apiInfo.storageApi.apiUrl,
    downloadUrl: data.apiInfo.storageApi.downloadUrl,
    authorizationToken: data.authorizationToken,
    expiresAt: now + 23 * 3600 * 1000,
  };

  return cachedAuth;
}

/**
 * Получение ID бакета по имени
 */
export async function getBucketId(): Promise<string> {
  if (cachedBucketId) {
    return cachedBucketId;
  }

  const auth = await authorizeB2();
  const res = await fetch(`${auth.apiUrl}/b2api/v3/b2_list_buckets`, {
    method: "POST",
    headers: {
      Authorization: auth.authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accountId: auth.accountId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to list buckets: ${text}`);
  }

  const data = (await res.json()) as {
    buckets: Array<{ bucketId: string; bucketName: string }>;
  };

  const target = data.buckets.find((b) => b.bucketName === BUCKET_NAME);
  if (!target) {
    throw new Error(`Bucket ${BUCKET_NAME} not found`);
  }

  cachedBucketId = target.bucketId;
  return target.bucketId;
}

/**
 * Загрузка файла (Buffer) в Backblaze B2
 */
export async function uploadToB2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; key: string; fileId: string }> {
  const auth = await authorizeB2();
  const bucketId = await getBucketId();

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = fileName.startsWith("nail-colors/") || fileName.startsWith("data/")
    ? fileName
    : `nail-colors/${Date.now()}-${cleanFileName}`;

  // Считаем SHA1 хэш
  const sha1 = crypto.createHash("sha1").update(fileBuffer).digest("hex");

  let uploadRes: Response | null = null;
  let lastErrText = "";

  for (let attempt = 1; attempt <= 3; attempt++) {
    // Получаем свежий upload URL
    const uploadUrlRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId }),
    });

    if (!uploadUrlRes.ok) {
      const text = await uploadUrlRes.text();
      throw new Error(`Failed to get upload URL: ${text}`);
    }

    const uploadUrlData = (await uploadUrlRes.json()) as {
      uploadUrl: string;
      authorizationToken: string;
    };

    uploadRes = await fetch(uploadUrlData.uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadUrlData.authorizationToken,
        "X-Bz-File-Name": encodeURIComponent(key),
        "Content-Type": contentType || "application/octet-stream",
        "Content-Length": String(fileBuffer.length),
        "X-Bz-Content-Sha1": sha1,
      },
      body: fileBuffer,
    });

    if (uploadRes.ok) {
      break;
    }

    lastErrText = await uploadRes.text();
    console.warn(`B2 upload attempt ${attempt} failed with ${uploadRes.status}: ${lastErrText}. Retrying...`);
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }

  if (!uploadRes || !uploadRes.ok) {
    throw new Error(`B2 file upload failed after retries: ${lastErrText}`);
  }

  const uploadResult = (await uploadRes.json()) as {
    fileId: string;
    fileName: string;
  };

  // URL через наш прокси для безопасной и быстрой отдачи в браузере:
  // /api/b2/file/<key>
  const url = `/api/b2/file/${key}`;

  return {
    url,
    key,
    fileId: uploadResult.fileId,
  };
}

/**
 * Получение файла из B2 (Buffer + ContentType)
 */
export async function downloadFromB2(
  key: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const auth = await authorizeB2();
  const downloadUrl = `${auth.downloadUrl}/file/${BUCKET_NAME}/${encodeURI(key)}`;

  const res = await fetch(downloadUrl, {
    headers: {
      Authorization: auth.authorizationToken,
    },
  });

  if (!res.ok) {
    return null;
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: res.headers.get("content-type") || "application/octet-stream",
  };
}

/**
 * Сохранение JSON данных (например, colors.json) в бакет
 */
export async function saveJsonToB2(
  key: string,
  data: unknown
): Promise<{ url: string; key: string }> {
  const jsonString = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(jsonString, "utf-8");
  const res = await uploadToB2(buffer, key, "application/json; charset=utf-8");
  return { url: res.url, key: res.key };
}

/**
 * Чтение JSON данных из бакета
 */
export async function getJsonFromB2<T>(key: string): Promise<T | null> {
  try {
    const file = await downloadFromB2(key);
    if (!file) return null;
    const jsonStr = file.buffer.toString("utf-8");
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.error(`Error reading ${key} from B2:`, err);
    return null;
  }
}

export function getB2Config() {
  return {
    bucketName: BUCKET_NAME,
    endpoint: "https://s3.eu-central-003.backblazeb2.com",
    region: "eu-central-003",
    keyId: KEY_ID,
    isConfigured: Boolean(KEY_ID && APPLICATION_KEY),
  };
}
