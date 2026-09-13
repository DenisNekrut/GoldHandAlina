import React, { useEffect, useState, useCallback } from "react";
import type { SiteContent } from "../types/content";
import { siteContentService, DEFAULT_SITE_CONTENT } from "../services/siteContentService";
import { SiteContentContext } from "./siteContentContextDef";

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    try {
      const data = await siteContentService.getContent();
      setContent(data);
    } catch (e) {
      console.error("Failed to load site content:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    siteContentService.getContent().then((data) => {
      if (active) {
        setContent(data);
        setLoading(false);
      }
    }).catch((e) => {
      console.error("Failed to load site content:", e);
      if (active) {
        setLoading(false);
      }
    });

    // Подписка на обновление контента в реальном времени
    const unsubscribe = siteContentService.subscribeToChanges((fresh) => {
      if (active) {
        setContent(fresh);
      }
    });

    return () => {
      active = false;
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

