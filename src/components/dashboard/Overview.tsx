
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Overview = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>نظرة عامة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">الرسم البياني للإيرادات الشهرية</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;
