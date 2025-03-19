
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import NumbersPanel from '@/components/dashboard/NumbersPanel';
import APIConfigPanel from '@/components/dashboard/APIConfigPanel';
import UserManagementPanel from '@/components/dashboard/UserManagementPanel';
import ReportsPanel from '@/components/dashboard/ReportsPanel';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  BarChart4, 
  PhoneCall, 
  Clock, 
  Server,
  Play,
  Pause
} from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { QueryService } from '@/services/queryService';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = 'dashboard' | 'numbers' | 'api' | 'users' | 'reports';

const Dashboard = () => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [isQuerying, setIsQuerying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastQueryTime, setLastQueryTime] = useState<Date | null>(null);
  const [nextQueryTime, setNextQueryTime] = useState<Date | null>(null);
  
  // In a full implementation, we would set up the polling here
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  // Control Panel component - only visible to admins
  const ControlPanel = () => {
    const { 
      numbers, 
      apiConfigs, 
      queryInterval, 
      reportInterval, 
      getActiveNumbers, 
      setQueryInterval, 
      setReportInterval
    } = useConfig();

    // Start/stop automatic queries
    const handleToggleRunning = () => {
      if (isRunning) {
        // Stop queries
        QueryService.stopAutomaticQueries();
        setIsRunning(false);
        setNextQueryTime(null);
        
        toast({
          title: "تم إيقاف الاستعلامات",
          description: "تم إيقاف الاستعلامات التلقائية عن الرصيد.",
        });
      } else {
        // Start queries
        if (apiConfigs.length < 2) {
          toast({
            title: "الإعداد مطلوب",
            description: "تحتاج إلى تكوين إعدادات كل من ADSL و Yemen Forge API قبل بدء الاستعلامات التلقائية.",
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
            title: "تكوين API مطلوب",
            description: "تحتاج إلى تكوينات نشطة لكل من ADSL و Yemen Forge APIs.",
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
              description: `تم الاستعلام عن ${results.length} أرقام بنجاح.`,
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
          title: "بدأت الاستعلامات التلقائية",
          description: `استعلام عن ${getActiveNumbers().length} أرقام كل ${queryInterval} دقائق.`,
        });
      }
    };

    // Run a manual query
    const handleManualQuery = async () => {
      if (apiConfigs.length < 2) {
        toast({
          title: "الإعداد مطلوب",
          description: "تحتاج إلى تكوين إعدادات كل من ADSL و Yemen Forge API.",
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
          title: "تكوين API مطلوب",
          description: "تحتاج إلى تكوينات نشطة لكل من ADSL و Yemen Forge APIs.",
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
          description: `تم الاستعلام عن ${results.length} أرقام بنجاح.`,
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
      <div className="space-y-6">
        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">التحكم بالاستعلامات</h2>
                
                <div className="flex gap-4">
                  <Button
                    variant={isRunning ? "destructive" : "default"}
                    className="flex-1"
                    onClick={handleToggleRunning}
                  >
                    {isRunning ? (
                      <>
                        <Pause size={16} className="ml-2" />
                        إيقاف الاستعلامات
                      </>
                    ) : (
                      <>
                        <Play size={16} className="ml-2" />
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
                        <RefreshCw size={16} className="ml-2 animate-spin" />
                        جاري الاستعلام...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="ml-2" />
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
                      <Clock size={16} className="ml-2 text-muted-foreground" />
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
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">الإحصائيات</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">الأرقام النشطة</div>
                      <PhoneCall size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{getActiveNumbers().length}</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">نقاط API</div>
                      <Server size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{apiConfigs.filter(c => c.isActive).length}</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">فترة الاستعلام</div>
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{queryInterval}د</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">فترة التقرير</div>
                      <BarChart4 size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{reportInterval}س</div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Interval Config - only visible to admins */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">إعدادات الفترات الزمنية</h2>
              
              <Tabs defaultValue="query">
                <TabsList className="mb-4">
                  <TabsTrigger value="query">فترة الاستعلام</TabsTrigger>
                  <TabsTrigger value="report">فترة التقرير</TabsTrigger>
                </TabsList>
                
                <TabsContent value="query" className="space-y-4">
                  <p className="text-muted-foreground">تعيين مدى تكرار استعلام النظام عن الأرصدة (بالدقائق).</p>
                  
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
                  <p className="text-muted-foreground">تعيين مدى تكرار إنشاء النظام للتقارير (بالساعات).</p>
                  
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
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  // Basic Dashboard content for normal users
  const BasicDashboardContent = () => {
    const { getActiveNumbers } = useConfig();
    
    return (
      <div className="space-y-6">
        <motion.h1 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          لوحة التحكم
        </motion.h1>
        
        {/* Simplified status for normal users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">حالة الحساب</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-muted/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">الأرقام النشطة</div>
                  <PhoneCall size={16} className="text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{getActiveNumbers().length}</div>
              </Card>
              
              <Card className="p-4 bg-muted/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">حالة الاستعلام</div>
                  <StatusIndicator 
                    status={isRunning ? "online" : "offline"} 
                    text={isRunning ? "قيد التشغيل" : "متوقف"} 
                  />
                </div>
              </Card>
              
              {lastQueryTime && (
                <Card className="p-4 bg-muted/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">آخر استعلام</div>
                    <Clock size={16} className="text-muted-foreground" />
                  </div>
                  <div className="text-md">{lastQueryTime.toLocaleTimeString()}</div>
                </Card>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <RefreshCw size={24} />
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <DashboardLayout 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
      >
        {currentTab === 'dashboard' && (isAdmin ? <ControlPanel /> : <BasicDashboardContent />)}
        {currentTab === 'numbers' && <NumbersPanel />}
        {currentTab === 'api' && isAdmin && <APIConfigPanel />}
        {currentTab === 'users' && isAdmin && <UserManagementPanel />}
        {currentTab === 'reports' && <ReportsPanel />}
      </DashboardLayout>
    </ConfigProvider>
  );
};

export default Dashboard;
