
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/Overview';
import { ApiManagementPanel } from '@/components/dashboard/ApiManagementPanel';
import { UserManagementPanel } from '@/components/dashboard/users';
import { NumberManagementPanel } from '@/components/dashboard/NumberManagementPanel';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import AnimatedCard from '@/components/ui/AnimatedCard';

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4 p-4 md:p-8">
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        لوحة التحكم
      </h1>
      <p className="text-muted-foreground">
        نظرة عامة على النظام وإدارة الإعدادات والمستخدمين.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard>
          <CardHeader>
            <CardTitle>إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">452,031.89 ريال</div>
            <p className="text-muted-foreground">
              إجمالي الإيرادات المتراكمة من جميع الاشتراكات.
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <CardTitle>إجمالي الاشتراكات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2356</div>
            <p className="text-muted-foreground">
              عدد الاشتراكات النشطة حاليًا.
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <CardTitle>متوسط الإيرادات لكل مستخدم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">192.46 ريال</div>
            <p className="text-muted-foreground">
              متوسط الإيرادات الناتجة عن كل مستخدم مشترك.
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <CardTitle>النمو الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-muted-foreground">
              الزيادة المئوية في الإيرادات مقارنة بالشهر الماضي.
            </p>
          </CardContent>
        </AnimatedCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Overview />

        <div className="space-y-6">
          <ApiManagementPanel />
          <UserManagementPanel />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NumberManagementPanel />
        <SettingsPanel />
      </div>
    </div>
  );
};

export default Dashboard;
