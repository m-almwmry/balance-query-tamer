
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NumberManagementPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الأرقام</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">إدارة أرقام الهواتف والمستخدمين</p>
      </CardContent>
    </Card>
  );
};

export default NumberManagementPanel;
