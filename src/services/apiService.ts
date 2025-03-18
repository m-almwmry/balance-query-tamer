
import { ApiConfig } from "@/contexts/ConfigContext";
import { generateToken } from "@/lib/utils";
import CryptoJS from 'crypto-js';

interface BalanceResponse {
  success: boolean;
  balance?: number;
  error?: string;
  timestamp: Date;
  source: string;
  resultCode?: string;
  resultDesc?: string;
  remainAmount?: number;
}

export interface QueryResult {
  number: string;
  adslBalance?: number;
  forgeBalance?: number;
  timestamp: Date;
  error?: string;
  success: boolean;
  resultCode?: string;
  resultDesc?: string;
}

export class ApiService {
  static async queryAdslBalance(
    number: string,
    apiConfig: ApiConfig
  ): Promise<BalanceResponse> {
    try {
      // Create a unique transaction ID
      const transId = Date.now().toString();
      
      // Generate token as per API documentation
      const token = generateToken(
        transId,
        number,
        apiConfig.username,
        apiConfig.password
      );
      
      // In a real application, this would be an actual API call
      const url = `${apiConfig.url}post?action=query&userid=${apiConfig.username}&mobile=${number}&transid=${transId}&token=${token}`;
      
      console.log("ADSL query URL:", url);
      
      // This is a mock implementation - in production, use fetch or axios
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
          resultCode: "0",
          resultDesc: "success",
          remainAmount: balance
        };
      } else {
        // Simulate error response
        const errorCode = Math.random() > 0.5 ? "10" + Math.floor(Math.random() * 99) : "-2";
        const errorDesc = errorCode.startsWith("-") ? "قيد المعالجة" : "خطأ في الاستعلام";
        
        return {
          success: false,
          error: errorDesc,
          timestamp: new Date(),
          source: 'ADSL',
          resultCode: errorCode,
          resultDesc: errorDesc
        };
      }
    } catch (error) {
      console.error("ADSL balance query error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        timestamp: new Date(),
        source: 'ADSL',
        resultCode: "999",
        resultDesc: "خطأ في النظام"
      };
    }
  }

  static async queryForgeBalance(
    number: string,
    apiConfig: ApiConfig
  ): Promise<BalanceResponse> {
    try {
      // Create a unique transaction ID
      const transId = Date.now().toString();
      
      // Generate token as per API documentation
      const token = generateToken(
        transId,
        number,
        apiConfig.username,
        apiConfig.password
      );
      
      // In a real application, this would be an actual API call
      const url = `${apiConfig.url}?mobile=${number}&transid=${transId}&token=${token}&userid=${apiConfig.username}&action=query`;
      
      console.log("Forge query URL:", url);
      
      // This is a mock implementation - in production, use fetch or axios
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
          resultCode: "0",
          resultDesc: "success",
          remainAmount: balance
        };
      } else {
        // Simulate error response
        const errorCode = Math.random() > 0.5 ? "10" + Math.floor(Math.random() * 99) : "-2";
        const errorDesc = errorCode.startsWith("-") ? "قيد المعالجة" : "خطأ في الاستعلام";
        
        return {
          success: false,
          error: errorDesc,
          timestamp: new Date(),
          source: 'Forge',
          resultCode: errorCode,
          resultDesc: errorDesc
        };
      }
    } catch (error) {
      console.error("Forge balance query error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        timestamp: new Date(),
        source: 'Forge',
        resultCode: "999",
        resultDesc: "خطأ في النظام"
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
          ? "بعض الاستعلامات فشلت" 
          : undefined,
        success: adslResponse.success && forgeResponse.success,
        resultCode: adslResponse.resultCode || forgeResponse.resultCode,
        resultDesc: adslResponse.resultDesc || forgeResponse.resultDesc
      };
    } catch (error) {
      console.error("Balance query error:", error);
      return {
        number,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        success: false,
        resultCode: "999",
        resultDesc: "خطأ في النظام"
      };
    }
  }
}
