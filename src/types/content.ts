export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  btnBookText: string;
  btnPortfolioText: string;
  btnPaletteText: string;
  statYears: string;
  statYearsLabel: string;
  statClients: string;
  statClientsLabel: string;
  statSterility: string;
  statSterilityLabel: string;
  avatarEmoji: string;
  avatarUrl?: string;
  badgeImageUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string; // 'hands' | 'brush' | 'magic' | 'spa' or custom string
  imageUrl?: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface PortfolioCategory {
  id: string;
  label: string;
}

export interface PortfolioItem {
  id: string | number;
  category: string;
  title: string;
  emoji?: string;
  imageUrl?: string;
}

export interface PortfolioContent {
  title: string;
  subtitle: string;
  categories: PortfolioCategory[];
  items: PortfolioItem[];
}

export interface AboutFeature {
  id: string;
  icon: string; // 'check' | 'heart' | 'shield' | 'star'
  text: string;
}

export interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  features: AboutFeature[];
  avatarEmoji: string;
  avatarUrl?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  avatarUrl?: string;
}

export interface ReviewsContent {
  title: string;
  subtitle: string;
  items: ReviewItem[];
}

export interface ContactInfoItem {
  id: string;
  type: "address" | "phone" | "email" | "booking" | "other";
  title: string;
  details: string;
  link?: string;
}

export interface SocialLinkItem {
  id: string;
  type: "vk" | "telegram" | "instagram" | "whatsapp" | "other";
  label: string;
  url: string;
}

export interface ContactsContent {
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  infoItems: ContactInfoItem[];
  socials: SocialLinkItem[];
}

export interface PaletteCategoryItem {
  id: string;
  label: string;
}

export interface PalettePageContent {
  badge: string;
  title: string;
  subtitle: string;
  backButtonText: string;
  searchPlaceholder: string;
  categories: PaletteCategoryItem[];
  viewModeLabel: string;
  viewModeSplitText: string;
  viewModeToggleText: string;
  viewModeSliderText: string;
  bookButtonText: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyButtonText: string;
  emptyImageUrl?: string;
  emptyEmoji?: string;
}

export interface GeneralSettings {
  brandNamePart1: string;
  brandNamePart2: string;
  tagline: string;
  logoImageUrl?: string;
  allowedEmails: string[];
  allowedGithubUsernames: string[];
}

export interface SiteContent {
  version: number;
  updatedAt: string;
  general: GeneralSettings;
  hero: HeroContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  about: AboutContent;
  reviews: ReviewsContent;
  contacts: ContactsContent;
  palette: PalettePageContent;
}

