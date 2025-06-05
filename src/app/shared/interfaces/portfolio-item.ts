export interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  images?: string[];
  description: string;
  descriptionShort: string;
  skills: string[];
  link?: string;
  iframe?: string;
}
