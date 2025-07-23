// API configuration and base functions
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  /*if (__DEV__) {
    const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envApiUrl) {
      console.log('🔧 Using EXPO_PUBLIC_API_URL:', envApiUrl);
      return envApiUrl;
    }
    
    // Fallback pour web development
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    }
    // Fallback for mobile development
    return 'http://192.168.1.112:8000';
  }
  */
  // In production, use HTTPS directly (no redirections)
  return 'https://api.yacine-hamadouche.me';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API_BASE_URL:', API_BASE_URL);

export interface ItemPerk {
  hash: number;
  name: string;
  description: string;
  icon: string;
  isDefault?: boolean;
  isEquipped?: boolean;
  isExotic?: boolean;
}

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
  classType: number;
  supportedClasses: string[];
  flavorText: string;
  perks: ItemPerk[];
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
  message?: string;
}

export interface ApiResponse<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, retryCount = 0): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      console.log(`🌐 Making request to: ${url}`);
      
      // Configuration spécifique pour les applications mobiles
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Ajouter User-Agent pour éviter certains blocages
          'User-Agent': 'OrbitMarket/1.0',
        },
        // Gestion des redirections
        redirect: 'follow',
      };

      const response = await fetch(url, fetchOptions);

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response URL: ${response.url}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      
      // Type guard pour error
      const errorObj = error as Error;
      console.error(`❌ Error details:`, {
        name: errorObj.name || 'Unknown',
        message: errorObj.message || 'Unknown error',
        stack: errorObj.stack || 'No stack trace'
      });
      
      // Retry logic simple pour les erreurs réseau
      if (retryCount < 2 && (errorObj.name === 'TypeError' || errorObj.message?.includes('fetch'))) {
        console.log(`🔄 Retrying request (attempt ${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return this.makeRequest(endpoint, retryCount + 1);
      }
      
      throw error;
    }
  }

  async getXurInventory(): Promise<ApiResponse<XurData>> {
    return this.makeRequest<ApiResponse<XurData>>('/xur');
  }

  async getXurDebugInfo(): Promise<any> {
    return this.makeRequest('/xur/debug');
  }

  // Méthode de test simple pour diagnostiquer les problèmes de connexion
  async testConnection(): Promise<any> {
    try {
      console.log('🔧 Testing basic connection...');
      
      const response = await fetch(`${API_BASE_URL}/xur`, {
        method: 'HEAD', // Juste tester la connectivité
      });
      
      return {
        success: true,
        status: response.status,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      const errorObj = error as Error;
      return {
        success: false,
        error: errorObj.message || 'Unknown error',
        name: errorObj.name || 'Unknown'
      };
    }
  }
}

export const apiService = new ApiService();
