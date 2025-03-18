
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Pause, Clock } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { QueryService } from '@/services/queryService';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { toast } from '@/components/ui/use-toast';

const QueryControl = () => {
  const { 
    apiConfigs, 
    getActiveNumbers,
  } = useConfig();

  const [isQuerying, setIsQuerying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastQueryTime, setLastQueryTime] = useState<Date | null>(null);
  const [nextQueryTime, setNextQueryTime] = useState<Date | null>(null);

  // Initialize UI update interval
  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        if (nextQueryTime) {
          // Force a re-render to update countdown
          setNextQueryTime(new Date(nextQueryTime.getTime()));
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [isRunning, nextQueryTime]);

  // Start/stop automatic queries
  const handleToggleRunning = () => {
    if (isRunning) {
      // Stop queries
      QueryService.stopAutomaticQueries();
      setIsRunning(false);
      setNextQueryTime(null);
      
      toast({
        title: "تم إيقاف الاستعلامات التلقائية",
        description: "تم إيقاف استعلامات الرصيد التلقائية.",
      });
    } else {
      // Start queries
      const { queryInterval, reportInterval } = useConfig();
      
      if (apiConfigs.length < 2) {
        toast({
          title: "التكوين مطلوب",
          description: "تحتاج إلى تكوين إعدادات واجهة برمجة تطبيقات كل من ADSL و Yemen Forge قبل بدء الاستعلامات التلقائية.",
          variant: "destructive",
        });
        return;
      }
      
      if (getActiveNumbers().length === 0) {
        toast({
          title: "لا توجد أرقام نشطة",
          description: "تحتاج إلى إضافة رقم نشط واحد على الأقل قبل بدء الاستعلامات التلقائية.",
          variant: "destructive",
        });
        return;
      }
      
      const adslConfig = apiConfigs.find(config => 
        config.isActive && config.name.toLowerCase().includes('adsl')
      );
      
      const forgeConfig = apiConfigs.find(config => 
        config.isActive && config.name.toLowerCase().includes('forge')
      );
      
      if (!adslConfig || !forgeConfig) {
        toast({
          title: "تكوين واجهة برمجة التطبيقات مطلوب",
          description: "تحتاج إلى تكوينات نشطة لكل من واجهات برمجة تطبيقات ADSL و Yemen Forge.",
          variant: "destructive",
        });
        return;
      }
      
      // Set next query time
      const next = new Date();
      next.setMinutes(next.getMinutes() + queryInterval);
      setNextQueryTime(next);
      setLastQueryTime(new Date());
      
      // Start automatic queries
      QueryService.startAutomaticQueries(
        getActiveNumbers(),
        adslConfig,
        forgeConfig,
        queryInterval,
        reportInterval,
        (results) => {
          console.log("Query completed:", results);
          setLastQueryTime(new Date());
          
          // Update next query time
          const next = new Date();
          next.setMinutes(next.getMinutes() + queryInterval);
          setNextQueryTime(next);
          
          toast({
            title: "اكتمل الاستعلام",
            description: `تم الاستعلام عن ${results.length} رقمًا بنجاح.`,
          });
        },
        (report) => {
          console.log("Report generated:", report);
          toast({
            title: "تم إنشاء التقرير",
            description: "تم إنشاء تقرير رصيد جديد.",
          });
        }
      );
      
      setIsRunning(true);
      
      toast({
        title: "تم بدء الاستعلامات التلقائية",
        description: `الاستعلام عن ${getActiveNumbers().length} رقمًا كل ${queryInterval} دقيقة.`,
      });
    }
  };

  // Run a manual query
  const handleManualQuery = async () => {
    const { queryInterval } = useConfig();
    
    if (apiConfigs.length < 2) {
      toast({
        title: "التكوين مطلوب",
        description: "تحتاج إلى تكوين إعدادات واجهة برمجة تطبيقات كل من ADSL و Yemen Forge.",
        variant: "destructive",
      });
      return;
    }
    
    if (getActiveNumbers().length === 0) {
      toast({
        title: "لا توجد أرقام نشطة",
        description: "تحتاج إلى إضافة رقم نشط واحد على الأقل.",
        variant: "destructive",
      });
      return;
    }
    
    const adslConfig = apiConfigs.find(config => 
      config.isActive && config.name.toLowerCase().includes('adsl')
    );
    
    const forgeConfig = apiConfigs.find(config => 
      config.isActive && config.name.toLowerCase().includes('forge')
    );
    
    if (!adslConfig || !forgeConfig) {
      toast({
        title: "تكوين واجهة برمجة التطبيقات مطلوب",
        description: "تحتاج إلى تكوينات نشطة لكل من واجهات برمجة تطبيقات ADSL و Yemen Forge.",
        variant: "destructive",
      });
      return;
    }
    
    setIsQuerying(true);
    
    try {
      const results = await QueryService.runQuery(
        getActiveNumbers(),
        adslConfig,
        forgeConfig
      );
      
      setLastQueryTime(new Date());
      
      toast({
        title: "اكتمل الاستعلام",
        description: `تم الاستعلام عن ${results.length} رقمًا بنجاح.`,
      });
    } catch (error) {
      console.error("Manual query error:", error);
      toast({
        title: "فشل الاستعلام",
        description: "حدث خطأ أثناء الاستعلام.",
        variant: "destructive",
      });
    } finally {
      setIsQuerying(false);
    }
  };

  // Format time remaining
  const formatTimeRemaining = () => {
    if (!nextQueryTime) return "غير مجدول";
    
    const now = new Date();
    const diffMs = nextQueryTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return "جاري الاستعلام...";
    
    const diffSecs = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffSecs / 60);
    const seconds = diffSecs % 60;
    
    return `${minutes}د ${seconds}ث`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">التحكم بالاستعلام</h2>
      
      <div className="flex gap-4">
        <Button
          variant={isRunning ? "destructive" : "default"}
          className="flex-1"
          onClick={handleToggleRunning}
        >
          {isRunning ? (
            <>
              <Pause size={16} className="mr-2" />
              إيقاف الاستعلامات
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              بدء الاستعلامات التلقائية
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleManualQuery}
          disabled={isQuerying}
        >
          {isQuerying ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              جاري الاستعلام...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              تشغيل الاستعلام الآن
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">حالة الاستعلام</div>
          <div className="flex items-center">
            <StatusIndicator 
              status={isRunning ? "online" : "offline"} 
              text={isRunning ? "قيد التشغيل" : "متوقف"} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">الاستعلام التالي</div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-muted-foreground" />
            <span>{isRunning ? formatTimeRemaining() : "غير مجدول"}</span>
          </div>
        </div>
      </div>
      
      {lastQueryTime && (
        <div className="text-sm text-muted-foreground">
          آخر استعلام: {lastQueryTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default QueryControl;
