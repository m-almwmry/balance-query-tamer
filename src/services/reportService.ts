
import { QueryService, QueryHistoryEntry } from "./queryService";
import { formatDate } from "@/lib/utils";

export interface Report {
  id: string;
  title: string;
  timestamp: Date;
  summary: ReportSummary;
  details: ReportDetails;
}

interface ReportSummary {
  totalQueries: number;
  successRate: string;
  numberCount: number;
  periodFrom: Date;
  periodTo: Date;
}

interface ReportDetails {
  numberSummaries: NumberSummary[];
}

interface NumberSummary {
  number: string;
  queryCount: number;
  successRate: string;
  averageAdslBalance?: number;
  averageForgeBalance?: number;
  latestAdslBalance?: number;
  latestForgeBalance?: number;
}

export class ReportService {
  private static reports: Report[] = [];

  static generateReport(period: "day" | "week" | "month" = "day"): Report | null {
    // Load latest data
    const history = QueryService.getHistory();
    if (history.length === 0) {
      return null;
    }

    // Filter by period
    const now = new Date();
    const filteredHistory = this.filterHistoryByPeriod(history, period, now);
    if (filteredHistory.length === 0) {
      return null;
    }

    // Generate report ID, title and summary
    const id = Math.random().toString(36).substring(2, 15);
    const periodText = this.getPeriodText(period, now);
    const title = `Balance Report - ${periodText}`;
    
    const summary = this.generateSummary(filteredHistory);
    const details = this.generateDetails(filteredHistory);

    const report: Report = {
      id,
      title,
      timestamp: now,
      summary,
      details,
    };

    // Save report
    this.reports.push(report);
    this.saveReportsToStorage();

    return report;
  }

  static getReports(): Report[] {
    return [...this.reports];
  }

  static getLatestReport(): Report | null {
    if (this.reports.length === 0) return null;
    return this.reports[this.reports.length - 1];
  }

  static deleteReport(id: string): void {
    this.reports = this.reports.filter(report => report.id !== id);
    this.saveReportsToStorage();
  }

  static clearReports(): void {
    this.reports = [];
    this.saveReportsToStorage();
  }

  static loadReportsFromStorage(): void {
    try {
      const saved = localStorage.getItem("reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Convert string dates to Date objects
        parsed.forEach((report: any) => {
          report.timestamp = new Date(report.timestamp);
          report.summary.periodFrom = new Date(report.summary.periodFrom);
          report.summary.periodTo = new Date(report.summary.periodTo);
        });
        
        this.reports = parsed;
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  }

  static saveReportsToStorage(): void {
    try {
      // Limit reports to save storage space
      const limitedReports = this.reports.slice(-50);
      localStorage.setItem("reports", JSON.stringify(limitedReports));
    } catch (error) {
      console.error("Failed to save reports:", error);
    }
  }

  private static filterHistoryByPeriod(
    history: QueryHistoryEntry[],
    period: "day" | "week" | "month",
    now: Date
  ): QueryHistoryEntry[] {
    const periodInDays = period === "day" ? 1 : period === "week" ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - periodInDays * 24 * 60 * 60 * 1000);
    
    return history.filter(entry => entry.timestamp >= cutoffDate);
  }

  private static getPeriodText(period: "day" | "week" | "month", now: Date): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    
    return period === "day"
      ? formatter.format(now)
      : period === "week"
      ? `Week of ${formatter.format(now)}`
      : `Month of ${new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(now)}`;
  }

  private static generateSummary(history: QueryHistoryEntry[]): ReportSummary {
    const totalResults = history.reduce(
      (sum, entry) => sum + entry.results.length,
      0
    );
    
    let successfulResults = 0;
    const uniqueNumbers = new Set<string>();
    
    history.forEach(entry => {
      entry.results.forEach(result => {
        uniqueNumbers.add(result.number);
        if (result.success) {
          successfulResults++;
        }
      });
    });
    
    const successRate = totalResults > 0
      ? ((successfulResults / totalResults) * 100).toFixed(1) + "%"
      : "0%";
    
    return {
      totalQueries: totalResults,
      successRate,
      numberCount: uniqueNumbers.size,
      periodFrom: history[0].timestamp,
      periodTo: history[history.length - 1].timestamp,
    };
  }

  private static generateDetails(history: QueryHistoryEntry[]): ReportDetails {
    // Extract all unique numbers
    const numberMap = new Map<string, {
      queryCount: number;
      successCount: number;
      adslBalances: number[];
      forgeBalances: number[];
      latestAdslBalance?: number;
      latestForgeBalance?: number;
    }>();
    
    // Process all results
    history.forEach(entry => {
      entry.results.forEach(result => {
        const number = result.number;
        const numberStats = numberMap.get(number) || {
          queryCount: 0,
          successCount: 0,
          adslBalances: [],
          forgeBalances: [],
        };
        
        numberStats.queryCount++;
        if (result.success) {
          numberStats.successCount++;
        }
        
        if (result.adslBalance !== undefined) {
          numberStats.adslBalances.push(result.adslBalance);
          numberStats.latestAdslBalance = result.adslBalance;
        }
        
        if (result.forgeBalance !== undefined) {
          numberStats.forgeBalances.push(result.forgeBalance);
          numberStats.latestForgeBalance = result.forgeBalance;
        }
        
        numberMap.set(number, numberStats);
      });
    });
    
    // Convert to array of summaries
    const numberSummaries: NumberSummary[] = Array.from(numberMap.entries()).map(
      ([number, stats]) => {
        const successRate = stats.queryCount > 0
          ? ((stats.successCount / stats.queryCount) * 100).toFixed(1) + "%"
          : "0%";
        
        const averageAdslBalance = stats.adslBalances.length > 0
          ? Math.round(stats.adslBalances.reduce((sum, bal) => sum + bal, 0) / stats.adslBalances.length)
          : undefined;
        
        const averageForgeBalance = stats.forgeBalances.length > 0
          ? Math.round(stats.forgeBalances.reduce((sum, bal) => sum + bal, 0) / stats.forgeBalances.length)
          : undefined;
        
        return {
          number,
          queryCount: stats.queryCount,
          successRate,
          averageAdslBalance,
          averageForgeBalance,
          latestAdslBalance: stats.latestAdslBalance,
          latestForgeBalance: stats.latestForgeBalance,
        };
      }
    );
    
    return {
      numberSummaries,
    };
  }
}
