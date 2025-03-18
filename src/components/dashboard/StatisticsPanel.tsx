
import React from 'react';
import { PhoneCall, Server, Clock, BarChart4 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useConfig } from '@/contexts/ConfigContext';

const StatisticsPanel = () => {
  const { 
    apiConfigs, 
    queryInterval, 
    reportInterval, 
    getActiveNumbers 
  } = useConfig();

  return (
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
            <div className="text-sm font-medium">واجهات برمجة التطبيقات</div>
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
  );
};

export default StatisticsPanel;
