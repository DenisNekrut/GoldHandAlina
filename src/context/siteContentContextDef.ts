import { createContext } from "react";
import type { SiteContent } from "../types/content";
import { DEFAULT_SITE_CONTENT } from "../services/siteContentService";

export interface SiteContentContextType {
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
