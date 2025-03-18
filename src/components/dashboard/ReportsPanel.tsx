
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trash, RefreshCw, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Report, ReportService } from '@/services/reportService';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportsPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [reportPeriod, setReportPeriod] = useState<"day" | "week" | "month">("day");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load reports on initial render
  useEffect(() => {
    ReportService.loadReportsFromStorage();
    setReports(ReportService.getReports());
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = ReportService.generateReport(reportPeriod);
      
      if (report) {
        setReports(ReportService.getReports());
        toast({
          title: "Report generated",
          description: `${report.title} has been generated successfully.`,
        });
      } else {
        toast({
          title: "Report generation failed",
          description: "No data available for the selected period.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Report generation failed",
        description: "An error occurred while generating the report.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      ReportService.deleteReport(reportToDelete.id);
      setReports(ReportService.getReports());
      setDeleteDialogOpen(false);
      setReportToDelete(null);
      
      toast({
        title: "Report deleted",
        description: "The report has been deleted successfully.",
      });
    }
  };

  const handleToggleExpand = (reportId: string) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

  const downloadReport = (report: Report) => {
    try {
      // Convert report to JSON string
      const reportJson = JSON.stringify(report, null, 2);
      
      // Create a blob
      const blob = new Blob([reportJson], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.id}.json`;
      
      // Trigger a click on the anchor
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report downloaded",
        description: "The report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatedCard className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Balance Reports</h2>
          <div className="flex gap-2">
            <Select
              value={reportPeriod}
              onValueChange={(value: "day" | "week" | "month") => setReportPeriod(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
              ) : (
                <FileText size={16} className="mr-2" />
              )}
              Generate Report
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Recent Reports</h3>
          
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              No reports generated yet. Generate your first report using the button above.
            </div>
          ) : (
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {reports.slice().reverse().map((report) => (
                <motion.div
                  key={report.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  {/* Report Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => handleToggleExpand(report.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(report.id);
                          }}
                        >
                          {expandedReportId === report.id ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </Button>
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Generated: {formatDate(report.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadReport(report);
                          }}
                          className="h-8 w-8 rounded-full"
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(report);
                          }}
                          className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Details */}
                  {expandedReportId === report.id && (
                    <div className="border-t border-border bg-muted/10 p-4">
                      <div className="space-y-4">
                        {/* Summary Section */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Summary</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Total Queries</div>
                              <div className="text-lg font-semibold">{report.summary.totalQueries}</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                              <div className="text-lg font-semibold">{report.summary.successRate}</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Number Count</div>
                              <div className="text-lg font-semibold">{report.summary.numberCount}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Period: {formatDate(report.summary.periodFrom)} - {formatDate(report.summary.periodTo)}
                          </div>
                        </div>
                        
                        {/* Details Section */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Details by Number</h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="py-2 px-3 text-left font-medium">Number</th>
                                  <th className="py-2 px-3 text-left font-medium">Queries</th>
                                  <th className="py-2 px-3 text-left font-medium">Success</th>
                                  <th className="py-2 px-3 text-left font-medium">Avg. ADSL</th>
                                  <th className="py-2 px-3 text-left font-medium">Avg. Forge</th>
                                  <th className="py-2 px-3 text-left font-medium">Latest ADSL</th>
                                  <th className="py-2 px-3 text-left font-medium">Latest Forge</th>
                                </tr>
                              </thead>
                              <tbody>
                                {report.details.numberSummaries.map((summary, index) => (
                                  <tr 
                                    key={summary.number + index} 
                                    className="border-b border-border/50 hover:bg-muted/20"
                                  >
                                    <td className="py-2 px-3">{summary.number}</td>
                                    <td className="py-2 px-3">{summary.queryCount}</td>
                                    <td className="py-2 px-3">{summary.successRate}</td>
                                    <td className="py-2 px-3">
                                      {summary.averageAdslBalance !== undefined 
                                        ? summary.averageAdslBalance.toLocaleString() 
                                        : '-'}
                                    </td>
                                    <td className="py-2 px-3">
                                      {summary.averageForgeBalance !== undefined 
                                        ? summary.averageForgeBalance.toLocaleString() 
                                        : '-'}
                                    </td>
                                    <td className="py-2 px-3">
                                      {summary.latestAdslBalance !== undefined 
                                        ? summary.latestAdslBalance.toLocaleString() 
                                        : '-'}
                                    </td>
                                    <td className="py-2 px-3">
                                      {summary.latestForgeBalance !== undefined 
                                        ? summary.latestForgeBalance.toLocaleString() 
                                        : '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the report{' '}
              <span className="font-medium">{reportToDelete?.title}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedCard>
  );
};

export default ReportsPanel;
