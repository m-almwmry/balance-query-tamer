
import React from 'react';
import { motion } from 'framer-motion';
import StatisticsPanel from './StatisticsPanel';
import QueryControl from './QueryControl';
import IntervalConfig from './IntervalConfig';
import { Card } from '@/components/ui/card';

const DashboardContent = () => {
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
      
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QueryControl />
            <StatisticsPanel />
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
          <IntervalConfig />
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardContent;
