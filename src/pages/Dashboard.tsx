
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

  // Dashboard components
  const DashboardContent = () => {
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
          title: "Automatic queries stopped",
          description: "Automatic balance queries have been stopped.",
        });
      } else {
        // Start queries
        if (apiConfigs.length < 2) {
          toast({
            title: "Configuration required",
            description: "You need to configure both ADSL and Yemen Forge API settings before starting automatic queries.",
            variant: "destructive",
          });
          return;
        }
        
        if (getActiveNumbers().length === 0) {
          toast({
            title: "No active numbers",
            description: "You need to add at least one active number before starting automatic queries.",
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
            title: "API configuration required",
            description: "You need active configurations for both ADSL and Yemen Forge APIs.",
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
              title: "Query completed",
              description: `Queried ${results.length} numbers successfully.`,
            });
          },
          (report) => {
            console.log("Report generated:", report);
            toast({
              title: "Report generated",
              description: "A new balance report has been generated.",
            });
          }
        );
        
        setIsRunning(true);
        
        toast({
          title: "Automatic queries started",
          description: `Querying ${getActiveNumbers().length} numbers every ${queryInterval} minutes.`,
        });
      }
    };

    // Run a manual query
    const handleManualQuery = async () => {
      if (apiConfigs.length < 2) {
        toast({
          title: "Configuration required",
          description: "You need to configure both ADSL and Yemen Forge API settings.",
          variant: "destructive",
        });
        return;
      }
      
      if (getActiveNumbers().length === 0) {
        toast({
          title: "No active numbers",
          description: "You need to add at least one active number.",
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
          title: "API configuration required",
          description: "You need active configurations for both ADSL and Yemen Forge APIs.",
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
          title: "Query completed",
          description: `Queried ${results.length} numbers successfully.`,
        });
      } catch (error) {
        console.error("Manual query error:", error);
        toast({
          title: "Query failed",
          description: "An error occurred during the query.",
          variant: "destructive",
        });
      } finally {
        setIsQuerying(false);
      }
    };

    // Format time remaining
    const formatTimeRemaining = () => {
      if (!nextQueryTime) return "Not scheduled";
      
      const now = new Date();
      const diffMs = nextQueryTime.getTime() - now.getTime();
      
      if (diffMs <= 0) return "Querying...";
      
      const diffSecs = Math.floor(diffMs / 1000);
      const minutes = Math.floor(diffSecs / 60);
      const seconds = diffSecs % 60;
      
      return `${minutes}m ${seconds}s`;
    };

    return (
      <div className="space-y-6">
        <motion.h1 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Dashboard
        </motion.h1>
        
        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Query Control</h2>
                
                <div className="flex gap-4">
                  <Button
                    variant={isRunning ? "destructive" : "default"}
                    className="flex-1"
                    onClick={handleToggleRunning}
                  >
                    {isRunning ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Stop Queries
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Start Automatic Queries
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
                        Querying...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Run Query Now
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Query Status</div>
                    <div className="flex items-center">
                      <StatusIndicator 
                        status={isRunning ? "online" : "offline"} 
                        text={isRunning ? "Running" : "Stopped"} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Next Query</div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>{isRunning ? formatTimeRemaining() : "Not scheduled"}</span>
                    </div>
                  </div>
                </div>
                
                {lastQueryTime && (
                  <div className="text-sm text-muted-foreground">
                    Last query: {lastQueryTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Statistics</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Active Numbers</div>
                      <PhoneCall size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{getActiveNumbers().length}</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">API Endpoints</div>
                      <Server size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{apiConfigs.filter(c => c.isActive).length}</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Query Interval</div>
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{queryInterval}m</div>
                  </Card>
                  
                  <Card className="p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Report Interval</div>
                      <BarChart4 size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{reportInterval}h</div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Interval Config */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interval Configuration</h2>
            
            <Tabs defaultValue="query">
              <TabsList className="mb-4">
                <TabsTrigger value="query">Query Interval</TabsTrigger>
                <TabsTrigger value="report">Report Interval</TabsTrigger>
              </TabsList>
              
              <TabsContent value="query" className="space-y-4">
                <p className="text-muted-foreground">Set how frequently the system should query balances (in minutes).</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60, 120, 240, 480].map((interval) => (
                    <Button
                      key={interval}
                      variant={queryInterval === interval ? "default" : "outline"}
                      onClick={() => setQueryInterval(interval)}
                    >
                      {interval} {interval === 60 ? "hour" : "minutes"}
                    </Button>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Current setting: Query every {queryInterval} minutes
                </p>
              </TabsContent>
              
              <TabsContent value="report" className="space-y-4">
                <p className="text-muted-foreground">Set how frequently the system should generate reports (in hours).</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {[6, 12, 24, 48, 72, 168].map((interval) => (
                    <Button
                      key={interval}
                      variant={reportInterval === interval ? "default" : "outline"}
                      onClick={() => setReportInterval(interval)}
                    >
                      {interval} {interval === 24 ? "day" : interval === 168 ? "week" : "hours"}
                    </Button>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Current setting: Generate reports every {reportInterval} hours
                </p>
              </TabsContent>
            </Tabs>
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
        {currentTab === 'dashboard' && <DashboardContent />}
        {currentTab === 'numbers' && <NumbersPanel />}
        {currentTab === 'api' && isAdmin && <APIConfigPanel />}
        {currentTab === 'users' && isAdmin && <UserManagementPanel />}
        {currentTab === 'reports' && <ReportsPanel />}
      </DashboardLayout>
    </ConfigProvider>
  );
};

export default Dashboard;
