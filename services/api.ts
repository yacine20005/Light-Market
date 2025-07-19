// API configuration and base functions
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

console.log('🌐 API_BASE_URL:', API_BASE_URL);

export interface XurInventoryItem {
  vendorItemIndex: number;
  itemHash: number;
  quantity: number;
  costs: Array<{
    itemHash: number;
    quantity: number;
    hasConditionalVisibility: boolean;
  }>;
  itemName: string;
  itemDescription: string;
  itemIcon: string;
  rarity: string;
}

export interface XurData {
  vendor: {
    vendorHash: number;
    nextRefreshDate: string;
    enabled: boolean;
    name: string;
    description: string;
  };
  sales: {
    saleItems: { [key: string]: XurInventoryItem };
  };
  isAvailable: boolean;
}

export interface ApiResponse<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
}

class ApiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getXurInventory(): Promise<ApiResponse<XurData>> {
    return this.makeRequest<ApiResponse<XurData>>('/xur');
  }

  async getXurDebugInfo(): Promise<any> {
    return this.makeRequest('/xur/debug');
  }
}

export const apiService = new ApiService();
