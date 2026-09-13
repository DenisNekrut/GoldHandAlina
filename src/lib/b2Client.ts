export interface B2UploadResponse {
  success: boolean;
  url: string;
  key: string;
  bucket: string;
  error?: string;
}

export interface B2InfoResponse {
  bucketName: string;
  endpoint: string;
  region: string;
  keyId: string | null;
  isConfigured: boolean;
  urlTemplate: string;
}

export const b2ClientService = {
  /**
   * Загрузка файла (File или base64 DataURL) на сервер с отправкой в Backblaze B2 bucket
   */
  async uploadFile(file: File): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return this.uploadDataUrl(dataUrl, file.name, file.type);
  },

  async uploadDataUrl(
    dataUrl: string,
    fileName: string,
    contentType?: string
  ): Promise<string> {
    const response = await fetch("/api/b2/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataUrl,
        fileName: fileName || `photo_${Date.now()}.jpg`,
        contentType: contentType || "image/jpeg",
      }),
    });

    const data: B2UploadResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Не удалось загрузить файл в Backblaze B2");
    }

    return data.url;
  },

  /**
   * Получение информации о подключенном бакете B2
   */
  async getInfo(): Promise<B2InfoResponse | null> {
    try {
      const res = await fetch("/api/b2/info");
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  },
};
