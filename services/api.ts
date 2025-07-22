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
  private async testConnectivity(): Promise<boolean> {
    try {
      console.log(`🔍 [API] Testing basic connectivity...`);
      const response = await fetch('https://httpbin.org/status/200', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      console.log(`🔍 [API] Connectivity test result: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.log(`🔍 [API] Connectivity test failed:`, error);
      return false;
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔄 [API] Making request to: ${url}`);
    console.log(`🔄 [API] Platform: ${typeof window !== 'undefined' ? 'web' : 'mobile'}`);
    console.log(`🔄 [API] User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'mobile-app'}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`⏰ [API] Timeout reached for ${url}`);
        controller.abort();
      }, 15000); // 15 secondes timeout
      
      console.log(`📤 [API] Starting fetch request...`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OrbitMarket/1.1.2 (Android)',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
        // Options pour améliorer la compatibilité mobile
        cache: 'no-cache',
        redirect: 'follow',
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      console.log(`📡 [API] Response received - Status: ${response.status} (${response.statusText})`);
      console.log(`📡 [API] Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText = 'Impossible de lire la réponse d\'erreur';
        try {
          errorText = await response.text();
        } catch (e) {
          console.warn(`⚠️ [API] Could not read error response:`, e);
        }
        console.error(`❌ [API] HTTP Error ${response.status}: ${errorText}`);
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText || 'Erreur du serveur'}`);
      }

      console.log(`📥 [API] Parsing JSON response...`);
      const data = await response.json();
      console.log(`✅ [API] Successfully parsed JSON from ${endpoint}`);
      console.log(`📊 [API] Response data keys:`, Object.keys(data));
      return data;
      
    } catch (error) {
      console.error(`💥 [API] Request failed for ${endpoint}:`, error);
      console.error(`💥 [API] Error type:`, typeof error);
      console.error(`💥 [API] Error name:`, error instanceof Error ? error.name : 'unknown');
      console.error(`💥 [API] Error message:`, error instanceof Error ? error.message : String(error));
      console.error(`💥 [API] Error stack:`, error instanceof Error ? error.stack : 'no stack');
      
      // Gestion spécifique des erreurs
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('⏰ Timeout: La requête a pris trop de temps (15s)');
        } 
        
        if (error.name === 'TypeError') {
          // Erreur réseau typique sur mobile
          throw new Error('🌐 Erreur réseau: Vérifiez votre connexion internet et les paramètres de sécurité');
        }
        
        if (error.message.includes('SSL') || error.message.includes('certificate') || error.message.includes('TLS')) {
          throw new Error('🔒 Erreur de certificat SSL: Problème de sécurité réseau');
        }
        
        if (error.message.includes('Network request failed')) {
          throw new Error('📡 Requête réseau échouée: Impossible de contacter le serveur');
        }
        
        if (error.message.includes('CORS')) {
          throw new Error('🚫 Erreur CORS: Politique de sécurité bloquée');
        }
        
        // Retourner l'erreur telle quelle si elle a un message explicite
        throw error;
      }
      
      throw new Error('❓ Erreur inconnue lors de la requête API');
    }
  }

  async getXurInventory(): Promise<ApiResponse<XurData>> {
    console.log(`🎯 [API] Getting Xur inventory...`);
    
    // Test de connectivité d'abord
    const hasConnectivity = await this.testConnectivity();
    console.log(`🌐 [API] Connectivity available: ${hasConnectivity}`);
    
    if (!hasConnectivity) {
      throw new Error('🚫 Aucune connectivité réseau détectée');
    }
    
    try {
      return await this.makeRequest<ApiResponse<XurData>>('/xur');
    } catch (error) {
      console.log(`⚠️ [API] Primary Xur endpoint failed, trying alternative approach...`);
      
      // Si l'endpoint principal échoue, essayons de tester avec le debug endpoint
      try {
        await this.makeRequest('/xur/debug');
        console.log(`✅ [API] Debug endpoint works, the issue might be with response parsing`);
      } catch (debugError) {
        console.log(`❌ [API] Debug endpoint also failed:`, debugError);
      }
      
      // Re-lancer l'erreur originale
      throw error;
    }
  }

  async getXurDebugInfo(): Promise<any> {
    return this.makeRequest('/xur/debug');
  }
}

export const apiService = new ApiService();
