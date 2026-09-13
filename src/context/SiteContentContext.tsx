import React, { createContext, useContext, useEffect, useState } from "react";
import type { SiteContent } from "../types/content";
import { siteContentService, DEFAULT_SITE_CONTENT } from "../services/siteContentService";

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  updateContent: (newContent: SiteContent) => Promise<boolean>;
  resetContent: () => Promise<void>;
  reloadContent: () => Promise<void>;
}

export const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
  updateContent: async () => false,
  resetContent: async () => {},
  reloadContent: async () => {},
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await siteContentService.getContent();
      setContent(data);
    } catch (e) {
      console.error("Failed to load site content:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();

    // Подписка на обновление контента в реальном времени
    const unsubscribe = siteContentService.subscribeToChanges((fresh) => {
      setContent(fresh);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateContent = async (newContent: SiteContent): Promise<boolean> => {
    setContent(newContent);
    return await siteContentService.saveContent(newContent);
  };

  const resetContent = async () => {
    const def = await siteContentService.resetToDefault();
    setContent(def);
  };

  const reloadContent = async () => {
    setLoading(true);
    await loadContent();
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        updateContent,
        resetContent,
        reloadContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
