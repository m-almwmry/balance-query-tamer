
import { ApiConfig } from "@/contexts/ConfigContext";

interface BalanceResponse {
  success: boolean;
  balance?: number;
  error?: string;
  timestamp: Date;
  source: string;
}

export interface QueryResult {
  number: string;
  adslBalance?: number;
  forgeBalance?: number;
  timestamp: Date;
  error?: string;
  success: boolean;
}

export class ApiService {
  static async queryAdslBalance(
    number: string,
    apiConfig: ApiConfig
  ): Promise<BalanceResponse> {
    try {
      // In a real application, this would be an actual API call
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API response
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        const balance = Math.floor(Math.random() * 50000);
        return {
          success: true,
          balance,
          timestamp: new Date(),
          source: 'ADSL',
        };
      } else {
        return {
          success: false,
          error: "Failed to query ADSL balance",
          timestamp: new Date(),
          source: 'ADSL',
        };
      }
    } catch (error) {
      console.error("ADSL balance query error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
        source: 'ADSL',
      };
    }
  }

  static async queryForgeBalance(
    number: string,
    apiConfig: ApiConfig
  ): Promise<BalanceResponse> {
    try {
      // In a real application, this would be an actual API call
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate API response
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        const balance = Math.floor(Math.random() * 10000);
        return {
          success: true,
          balance,
          timestamp: new Date(),
          source: 'Forge',
        };
      } else {
        return {
          success: false,
          error: "Failed to query Forge balance",
          timestamp: new Date(),
          source: 'Forge',
        };
      }
    } catch (error) {
      console.error("Forge balance query error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
        source: 'Forge',
      };
    }
  }

  static async queryAllBalances(
    number: string,
    adslConfig: ApiConfig,
    forgeConfig: ApiConfig
  ): Promise<QueryResult> {
    try {
      const [adslResponse, forgeResponse] = await Promise.all([
        this.queryAdslBalance(number, adslConfig),
        this.queryForgeBalance(number, forgeConfig),
      ]);

      return {
        number,
        adslBalance: adslResponse.success ? adslResponse.balance : undefined,
        forgeBalance: forgeResponse.success ? forgeResponse.balance : undefined,
        timestamp: new Date(),
        error: !adslResponse.success || !forgeResponse.success 
          ? "Some queries failed" 
          : undefined,
        success: adslResponse.success && forgeResponse.success,
      };
    } catch (error) {
      console.error("Balance query error:", error);
      return {
        number,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }
}
