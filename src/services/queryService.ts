
import { NumberEntry, ApiConfig } from "@/contexts/ConfigContext";
import { ApiService, QueryResult } from "./apiService";

export interface QueryHistoryEntry {
  id: string;
  timestamp: Date;
  results: QueryResult[];
}

export class QueryService {
  private static history: QueryHistoryEntry[] = [];
  private static queryIntervalId: NodeJS.Timeout | null = null;
  private static reportIntervalId: NodeJS.Timeout | null = null;

  static async queryAllNumbers(
    numbers: NumberEntry[],
    adslConfig: ApiConfig | undefined,
    forgeConfig: ApiConfig | undefined
  ): Promise<QueryResult[]> {
    if (!adslConfig || !forgeConfig) {
      throw new Error("API configurations not found");
    }

    const results: QueryResult[] = [];

    for (const number of numbers) {
      if (number.isActive) {
        try {
          const result = await ApiService.queryAllBalances(
            number.number,
            adslConfig,
            forgeConfig
          );
          results.push(result);
        } catch (error) {
          console.error(`Error querying number ${number.number}:`, error);
          results.push({
            number: number.number,
            timestamp: new Date(),
            error: error instanceof Error ? error.message : "Unknown error",
            success: false,
          });
        }
      }
    }

    return results;
  }

  static async runQuery(
    numbers: NumberEntry[],
    adslConfig: ApiConfig | undefined,
    forgeConfig: ApiConfig | undefined,
    saveToHistory: boolean = true
  ): Promise<QueryResult[]> {
    try {
      const results = await this.queryAllNumbers(
        numbers,
        adslConfig,
        forgeConfig
      );

      if (saveToHistory) {
        this.saveQueryToHistory(results);
      }

      return results;
    } catch (error) {
      console.error("Run query error:", error);
      throw error;
    }
  }

  static saveQueryToHistory(results: QueryResult[]): void {
    if (results.length === 0) return;

    const historyEntry: QueryHistoryEntry = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date(),
      results,
    };

    this.history.push(historyEntry);

    // Save to localStorage
    this.saveHistoryToStorage();
  }

  static getHistory(): QueryHistoryEntry[] {
    return [...this.history];
  }

  static getLatestQuery(): QueryHistoryEntry | null {
    if (this.history.length === 0) return null;
    return this.history[this.history.length - 1];
  }

  static clearHistory(): void {
    this.history = [];
    this.saveHistoryToStorage();
  }

  static loadHistoryFromStorage(): void {
    try {
      const saved = localStorage.getItem("queryHistory");
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Convert string dates to Date objects
        parsed.forEach((entry: any) => {
          entry.timestamp = new Date(entry.timestamp);
          entry.results.forEach((result: any) => {
            result.timestamp = new Date(result.timestamp);
          });
        });
        
        this.history = parsed;
      }
    } catch (error) {
      console.error("Failed to load query history:", error);
    }
  }

  static saveHistoryToStorage(): void {
    try {
      // Limit history size to prevent localStorage from getting too large
      const limitedHistory = this.history.slice(-100);
      localStorage.setItem("queryHistory", JSON.stringify(limitedHistory));
    } catch (error) {
      console.error("Failed to save query history:", error);
    }
  }

  static startAutomaticQueries(
    numbers: NumberEntry[],
    adslConfig: ApiConfig | undefined,
    forgeConfig: ApiConfig | undefined,
    queryInterval: number,
    reportInterval: number,
    onQueryComplete?: (results: QueryResult[]) => void,
    onReportGenerated?: (report: any) => void
  ): void {
    // Load history first
    this.loadHistoryFromStorage();

    // Stop any existing intervals
    this.stopAutomaticQueries();

    // Start query interval (in minutes)
    this.queryIntervalId = setInterval(async () => {
      try {
        console.log("Running automatic query...");
        const results = await this.runQuery(numbers, adslConfig, forgeConfig);
        if (onQueryComplete) {
          onQueryComplete(results);
        }
      } catch (error) {
        console.error("Automatic query error:", error);
      }
    }, queryInterval * 60 * 1000);

    // Start report interval (in hours)
    this.reportIntervalId = setInterval(() => {
      try {
        console.log("Generating report...");
        // Get the latest 24 queries (or less if we don't have that many)
        const queries = this.history.slice(-24);
        
        if (queries.length === 0) {
          console.log("No data available for report generation");
          return;
        }
        
        const report = {
          generatedAt: new Date(),
          period: {
            from: queries[0].timestamp,
            to: queries[queries.length - 1].timestamp,
          },
          queryCount: queries.length,
          numberSummaries: this.generateNumberSummaries(queries),
        };
        
        if (onReportGenerated) {
          onReportGenerated(report);
        }
      } catch (error) {
        console.error("Report generation error:", error);
      }
    }, reportInterval * 60 * 60 * 1000);
  }

  static stopAutomaticQueries(): void {
    if (this.queryIntervalId) {
      clearInterval(this.queryIntervalId);
      this.queryIntervalId = null;
    }

    if (this.reportIntervalId) {
      clearInterval(this.reportIntervalId);
      this.reportIntervalId = null;
    }
  }

  private static generateNumberSummaries(queries: QueryHistoryEntry[]): any[] {
    // Extract all unique numbers from queries
    const numberSet = new Set<string>();
    queries.forEach(query => {
      query.results.forEach(result => {
        numberSet.add(result.number);
      });
    });

    const numberSummaries = Array.from(numberSet).map(number => {
      // Get all results for this number
      const numberResults: QueryResult[] = [];
      queries.forEach(query => {
        const result = query.results.find(r => r.number === number);
        if (result) {
          numberResults.push(result);
        }
      });

      // Calculate success rate
      const successCount = numberResults.filter(r => r.success).length;
      const successRate = numberResults.length > 0 
        ? (successCount / numberResults.length) * 100 
        : 0;

      // Get latest ADSL and Forge balances
      const latestResult = numberResults.length > 0 
        ? numberResults[numberResults.length - 1] 
        : null;

      return {
        number,
        queryCount: numberResults.length,
        successRate: successRate.toFixed(1) + '%',
        latestAdslBalance: latestResult?.adslBalance,
        latestForgeBalance: latestResult?.forgeBalance,
        latestTimestamp: latestResult?.timestamp,
      };
    });

    return numberSummaries;
  }
}
