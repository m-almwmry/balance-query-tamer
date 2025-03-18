
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfig } from '@/contexts/ConfigContext';

const IntervalConfig = () => {
  const { queryInterval, reportInterval, setQueryInterval, setReportInterval } = useConfig();

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">إعدادات الفترات الزمنية</h2>
      
      <Tabs defaultValue="query">
        <TabsList className="mb-4">
          <TabsTrigger value="query">فترة الاستعلام</TabsTrigger>
          <TabsTrigger value="report">فترة التقرير</TabsTrigger>
        </TabsList>
        
        <TabsContent value="query" className="space-y-4">
          <p className="text-muted-foreground">تعيين المدة التي يجب أن يستعلم فيها النظام عن الأرصدة (بالدقائق).</p>
          
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 60, 120, 240, 480].map((interval) => (
              <Button
                key={interval}
                variant={queryInterval === interval ? "default" : "outline"}
                onClick={() => setQueryInterval(interval)}
              >
                {interval} {interval === 60 ? "ساعة" : "دقيقة"}
              </Button>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            الإعداد الحالي: استعلام كل {queryInterval} دقيقة
          </p>
        </TabsContent>
        
        <TabsContent value="report" className="space-y-4">
          <p className="text-muted-foreground">تعيين المدة التي يجب أن ينشئ فيها النظام تقارير (بالساعات).</p>
          
          <div className="grid grid-cols-3 gap-2">
            {[6, 12, 24, 48, 72, 168].map((interval) => (
              <Button
                key={interval}
                variant={reportInterval === interval ? "default" : "outline"}
                onClick={() => setReportInterval(interval)}
              >
                {interval} {interval === 24 ? "يوم" : interval === 168 ? "أسبوع" : "ساعة"}
              </Button>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            الإعداد الحالي: إنشاء تقارير كل {reportInterval} ساعة
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default IntervalConfig;
