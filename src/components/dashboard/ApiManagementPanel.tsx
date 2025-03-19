
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ApiManagementPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات API</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">إدارة مفاتيح API وإعدادات الواجهة البرمجية</p>
      </CardContent>
    </Card>
  );
};

export default ApiManagementPanel;
