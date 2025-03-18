
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
          title: "تم إنشاء التقرير",
          description: `تم إنشاء ${report.title} بنجاح.`,
        });
      } else {
        toast({
          title: "فشل إنشاء التقرير",
          description: "لا توجد بيانات متاحة للفترة المحددة.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "فشل إنشاء التقرير",
        description: "حدث خطأ أثناء إنشاء التقرير.",
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
        title: "تم حذف التقرير",
        description: "تم حذف التقرير بنجاح.",
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
        title: "تم تنزيل التقرير",
        description: "تم تنزيل التقرير بنجاح.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "فشل التنزيل",
        description: "حدث خطأ أثناء تنزيل التقرير.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatedCard className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">تقارير الرصيد</h2>
          <div className="flex gap-2">
            <Select
              value={reportPeriod}
              onValueChange={(value: "day" | "week" | "month") => setReportPeriod(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">يوم</SelectItem>
                <SelectItem value="week">أسبوع</SelectItem>
                <SelectItem value="month">شهر</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw size={16} className="ml-2 animate-spin" />
              ) : (
                <FileText size={16} className="ml-2" />
              )}
              إنشاء تقرير
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">التقارير الأخيرة</h3>
          
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              لم يتم إنشاء تقارير بعد. قم بإنشاء أول تقرير باستخدام الزر أعلاه.
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
                            تم الإنشاء: {formatDate(report.timestamp)}
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
                          <h5 className="text-sm font-medium">ملخص</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">إجمالي الاستعلامات</div>
                              <div className="text-lg font-semibold">{report.summary.totalQueries}</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">معدل النجاح</div>
                              <div className="text-lg font-semibold">{report.summary.successRate}</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">عدد الأرقام</div>
                              <div className="text-lg font-semibold">{report.summary.numberCount}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            الفترة: {formatDate(report.summary.periodFrom)} - {formatDate(report.summary.periodTo)}
                          </div>
                        </div>
                        
                        {/* Details Section */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">التفاصيل حسب الرقم</h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="py-2 px-3 text-right font-medium">الرقم</th>
                                  <th className="py-2 px-3 text-right font-medium">الاستعلامات</th>
                                  <th className="py-2 px-3 text-right font-medium">النجاح</th>
                                  <th className="py-2 px-3 text-right font-medium">متوسط ADSL</th>
                                  <th className="py-2 px-3 text-right font-medium">متوسط Forge</th>
                                  <th className="py-2 px-3 text-right font-medium">آخر ADSL</th>
                                  <th className="py-2 px-3 text-right font-medium">آخر Forge</th>
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
            <DialogTitle>حذف التقرير</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف التقرير{' '}
              <span className="font-medium">{reportToDelete?.title}</span>؟
              لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedCard>
  );
};

export default ReportsPanel;
