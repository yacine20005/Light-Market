// API configuration and base functions

const getApiBaseUrl = () => {
  // URL de production sans le slash final pour éviter les problèmes de redirection
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
}

export interface ApiResponse<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
}

class ApiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔄 Making API request to: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OrbitMarket/1.1.1',
        },
        signal: controller.signal,
        // Options pour améliorer la compatibilité mobile
        cache: 'no-cache',
        redirect: 'follow',
      });

      clearTimeout(timeoutId);
      console.log(`📡 Response status: ${response.status} for ${endpoint}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Impossible de lire la réponse d\'erreur');
        console.error(`❌ HTTP Error ${response.status}: ${errorText}`);
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText || 'Erreur du serveur'}`);
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched data from ${endpoint}`);
      return data;
      
    } catch (error) {
      console.error(`💥 API request failed for ${endpoint}:`, error);
      
      // Gestion spécifique des erreurs
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: La requête a pris trop de temps (15s)');
        } 
        
        if (error.name === 'TypeError') {
          // Erreur réseau typique sur mobile
          throw new Error('Erreur réseau: Vérifiez votre connexion internet');
        }
        
        if (error.message.includes('SSL') || error.message.includes('certificate')) {
          throw new Error('Erreur de certificat SSL: Problème de sécurité réseau');
        }
        
        if (error.message.includes('Network request failed')) {
          throw new Error('Requête réseau échouée: Impossible de contacter le serveur');
        }
        
        // Retourner l'erreur telle quelle si elle a un message explicite
        throw error;
      }
      
      throw new Error('Erreur inconnue lors de la requête API');
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
