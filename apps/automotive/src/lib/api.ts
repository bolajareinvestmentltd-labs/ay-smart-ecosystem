export interface Branch {
  id: number;
  name: string;
  address: string;
  contact_phone: string;
}

export interface Vehicle {
  id: number;
  title: string;
  brand: string;
  model_year: number;
  outright_price: string | null;
  daily_hire_rate: string | null;
  status: string;
  status_display: string;
  main_image_url: string;
  assigned_branch_details?: Branch;
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/`, {
      next: { revalidate: 10 },
    });
    if (!response.ok) throw new Error("Failed to fetch vehicles");
    return await response.json();
  } catch (error) {
    console.error("Automotive API Fetch Error:", error);
    return [];
  }
}
