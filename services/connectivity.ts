import NetInfo from '@react-native-community/netinfo';

export class ConnectivityService {
  static async isConnected(): Promise<boolean> {
    try {
      const netInfoState = await NetInfo.fetch();
      console.log('🌐 [Connectivity] NetInfo state:', netInfoState);
      
      // Vérifier si on a une connexion et qu'elle est accessible
      return netInfoState.isConnected === true && netInfoState.isInternetReachable !== false;
    } catch (error) {
      console.warn('⚠️ [Connectivity] NetInfo failed, falling back to fetch test:', error);
      
      // Fallback avec test de fetch
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://dns.google/resolve?name=google.com', {
          method: 'GET',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (fetchError) {
        console.warn('⚠️ [Connectivity] Fetch test also failed:', fetchError);
        return false;
      }
    }
  }

  static async waitForConnection(maxAttempts: number = 5, delayMs: number = 1000): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 [Connectivity] Attempt ${attempt}/${maxAttempts} to check connectivity...`);
      
      const isConnected = await this.isConnected();
      if (isConnected) {
        console.log(`✅ [Connectivity] Connection established on attempt ${attempt}`);
        return true;
      }
      
      if (attempt < maxAttempts) {
        console.log(`⏳ [Connectivity] Waiting ${delayMs}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    console.log(`❌ [Connectivity] Failed to establish connection after ${maxAttempts} attempts`);
    return false;
  }
}
