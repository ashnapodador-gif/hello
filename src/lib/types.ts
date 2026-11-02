export interface Product {
  id: string; name: string; category: string; description: string;
  price: string; image_url: string; featured: boolean; in_stock: boolean;
  sort_order: number; created_at: string;
}
export interface Service {
  id: string; name: string; category: string; description: string;
  image_url: string; featured: boolean; sort_order: number; created_at: string;
}
export interface GalleryImage {
  id: string; title: string; category: string; image_url: string;
  sort_order: number; created_at: string;
}
export interface Announcement {
  id: string; title: string; body: string; active: boolean; created_at: string;
}
export interface BusinessHour {
  id: string; day_of_week: number; opens_at: string; closes_at: string; is_closed: boolean;
}
export interface SiteContent { key: string; value: string; }
export interface ContactInfo {
  id: number; phone: string; whatsapp: string; email: string; address: string;
  map_embed_url: string; directions_url: string;
  facebook: string; instagram: string; twitter: string; linkedin: string; youtube: string;
  updated_at: string;
}
export interface Inquiry {
  id: string; name: string; email: string; phone: string; type: string;
  subject: string; message: string; status: string; created_at: string;
}
