// API configuration and base functions
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export interface XurInventoryItem {
  name: string;
  hash: string;
  itemType: number;
  itemSubType: number;
  classType: number;
  rarity: string;
  tierType: number;
  costs: Array<{
    itemHash: string;
    quantity: number;
  }>;
  quantity: number;
}

export interface XurData {
  vendor: {
    vendorHash: string;
    nextRefreshDate: string;
    enabled: boolean;
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
