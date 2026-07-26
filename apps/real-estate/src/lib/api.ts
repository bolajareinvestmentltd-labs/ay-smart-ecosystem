export interface Property {
  id: number;
  title: string;
  property_type: string;
  property_type_display: string;
  price: string;
  location_address: string;
  is_for_lease: boolean;
  virtual_tour_url: string | null;
  main_image_url: string;
  is_available: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/`, {
      next: { revalidate: 10 },
    });
    if (!response.ok) throw new Error("Failed to fetch properties");
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}
