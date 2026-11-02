export type Settings = {
  company_name: string; tagline: string; whatsapp_number: string;
  phone?: string; email?: string; address: string; city: string; state: string;
  maps_embed_url?: string; maps_link?: string;
  instagram_url?: string; facebook_url?: string; youtube_url?: string; linkedin_url?: string;
  opening_hours: { dia: string; horario: string }[];
};
export type Section = {
  eyebrow?: string; title?: string; subtitle?: string; body?: string;
  cta_label?: string; cta_url?: string; image_url?: string | null; extra?: any;
};
export type Service = {
  slug: string; title: string; short_description: string; body: string;
  image_url?: string | null; placeholder: string; features: string[];
};
export type Product = {
  slug: string; name: string; description: string; category: string; brand: string;
  image_url?: string | null; placeholder: string; in_stock: boolean;
};
export type Testimonial = { author: string; role: string; content: string };
export type Faq = { question: string; answer: string };
export type Promotion = {
  title: string; description: string; image_url?: string | null;
  ends_at?: string | null; cta_label: string; product_name?: string | null;
};
export type Post = {
  slug: string; title: string; excerpt: string; body: string;
  image_url?: string | null; category: string; published_at?: string | null;
};
export type TeamMember = {
  name: string; role: string; bio: string; certifications: string[]; photo_url?: string | null;
};
export type PortfolioItem = {
  slug: string; title: string; description: string; category: string; image_url?: string | null;
};
