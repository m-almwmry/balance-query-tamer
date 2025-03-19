
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الإعدادات</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">إدارة إعدادات النظام والتفضيلات</p>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
