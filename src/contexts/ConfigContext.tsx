
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { generateId } from '@/lib/utils';

export interface ApiConfig {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  isActive: boolean;
}

export interface UserConfig {
  id: string;
  username: string;
  maxNumbers: number;
  sessionLength: number; // in hours
  isActive: boolean;
}

export interface NumberEntry {
  id: string;
  number: string;
  description: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
}

interface ConfigContextType {
  apiConfigs: ApiConfig[];
  userConfigs: UserConfig[];
  numbers: NumberEntry[];
  queryInterval: number; // in minutes
  reportInterval: number; // in hours
  addApiConfig: (config: Omit<ApiConfig, 'id'>) => void;
  updateApiConfig: (id: string, config: Partial<ApiConfig>) => void;
  deleteApiConfig: (id: string) => void;
  addUserConfig: (config: Omit<UserConfig, 'id'>) => void;
  updateUserConfig: (id: string, config: Partial<UserConfig>) => void;
  deleteUserConfig: (id: string) => void;
  addNumber: (number: Omit<NumberEntry, 'id' | 'createdAt'>) => void;
  updateNumber: (id: string, number: Partial<NumberEntry>) => void;
  deleteNumber: (id: string) => void;
  setQueryInterval: (interval: number) => void;
  setReportInterval: (interval: number) => void;
  getUserNumbers: (userId: string) => NumberEntry[];
  getActiveNumbers: () => NumberEntry[];
  getNumberCount: (userId: string) => number;
  isUserAtNumberLimit: (userId: string) => boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([]);
  const [userConfigs, setUserConfigs] = useState<UserConfig[]>([]);
  const [numbers, setNumbers] = useState<NumberEntry[]>([]);
  const [queryInterval, setQueryInterval] = useState<number>(60); // 60 minutes
  const [reportInterval, setReportInterval] = useState<number>(24); // 24 hours

  // Load saved configurations on initial load
  useEffect(() => {
    const savedApiConfigs = localStorage.getItem('apiConfigs');
    const savedUserConfigs = localStorage.getItem('userConfigs');
    const savedNumbers = localStorage.getItem('numbers');
    const savedQueryInterval = localStorage.getItem('queryInterval');
    const savedReportInterval = localStorage.getItem('reportInterval');

    if (savedApiConfigs) {
      try {
        setApiConfigs(JSON.parse(savedApiConfigs));
      } catch (error) {
        console.error('Failed to parse saved API configs', error);
      }
    }

    if (savedUserConfigs) {
      try {
        setUserConfigs(JSON.parse(savedUserConfigs));
      } catch (error) {
        console.error('Failed to parse saved user configs', error);
      }
    }

    if (savedNumbers) {
      try {
        const parsedNumbers = JSON.parse(savedNumbers);
        // Convert string dates to Date objects
        parsedNumbers.forEach((number: any) => {
          number.createdAt = new Date(number.createdAt);
        });
        setNumbers(parsedNumbers);
      } catch (error) {
        console.error('Failed to parse saved numbers', error);
      }
    }

    if (savedQueryInterval) {
      try {
        setQueryInterval(parseInt(savedQueryInterval, 10));
      } catch (error) {
        console.error('Failed to parse saved query interval', error);
      }
    }

    if (savedReportInterval) {
      try {
        setReportInterval(parseInt(savedReportInterval, 10));
      } catch (error) {
        console.error('Failed to parse saved report interval', error);
      }
    }
  }, []);

  // Save configurations when they change
  useEffect(() => {
    localStorage.setItem('apiConfigs', JSON.stringify(apiConfigs));
  }, [apiConfigs]);

  useEffect(() => {
    localStorage.setItem('userConfigs', JSON.stringify(userConfigs));
  }, [userConfigs]);

  useEffect(() => {
    localStorage.setItem('numbers', JSON.stringify(numbers));
  }, [numbers]);

  useEffect(() => {
    localStorage.setItem('queryInterval', queryInterval.toString());
  }, [queryInterval]);

  useEffect(() => {
    localStorage.setItem('reportInterval', reportInterval.toString());
  }, [reportInterval]);

  // API configuration functions
  const addApiConfig = (config: Omit<ApiConfig, 'id'>) => {
    const newConfig = { ...config, id: generateId() };
    setApiConfigs(prev => [...prev, newConfig]);
    toast({
      title: "API configuration added",
      description: `${config.name} has been added to the API configurations.`,
    });
  };

  const updateApiConfig = (id: string, config: Partial<ApiConfig>) => {
    setApiConfigs(prev => 
      prev.map(item => (item.id === id ? { ...item, ...config } : item))
    );
    toast({
      title: "API configuration updated",
      description: "The API configuration has been updated successfully.",
    });
  };

  const deleteApiConfig = (id: string) => {
    const configToDelete = apiConfigs.find(config => config.id === id);
    setApiConfigs(prev => prev.filter(item => item.id !== id));
    toast({
      title: "API configuration deleted",
      description: configToDelete 
        ? `${configToDelete.name} has been deleted.` 
        : "The API configuration has been deleted.",
    });
  };

  // User configuration functions
  const addUserConfig = (config: Omit<UserConfig, 'id'>) => {
    const newConfig = { ...config, id: generateId() };
    setUserConfigs(prev => [...prev, newConfig]);
    toast({
      title: "User configuration added",
      description: `${config.username} has been added with a limit of ${config.maxNumbers} numbers.`,
    });
  };

  const updateUserConfig = (id: string, config: Partial<UserConfig>) => {
    setUserConfigs(prev => 
      prev.map(item => (item.id === id ? { ...item, ...config } : item))
    );
    toast({
      title: "User configuration updated",
      description: "The user configuration has been updated successfully.",
    });
  };

  const deleteUserConfig = (id: string) => {
    const configToDelete = userConfigs.find(config => config.id === id);
    setUserConfigs(prev => prev.filter(item => item.id !== id));
    toast({
      title: "User configuration deleted",
      description: configToDelete 
        ? `${configToDelete.username} has been deleted.` 
        : "The user configuration has been deleted.",
    });
  };

  // Number management functions
  const addNumber = (number: Omit<NumberEntry, 'id' | 'createdAt'>) => {
    const newNumber = { 
      ...number, 
      id: generateId(), 
      createdAt: new Date() 
    };
    
    setNumbers(prev => [...prev, newNumber]);
    toast({
      title: "Number added",
      description: `${number.number} has been added to the system.`,
    });
  };

  const updateNumber = (id: string, number: Partial<NumberEntry>) => {
    setNumbers(prev => 
      prev.map(item => (item.id === id ? { ...item, ...number } : item))
    );
    toast({
      title: "Number updated",
      description: "The number has been updated successfully.",
    });
  };

  const deleteNumber = (id: string) => {
    const numberToDelete = numbers.find(number => number.id === id);
    setNumbers(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Number deleted",
      description: numberToDelete 
        ? `${numberToDelete.number} has been deleted.` 
        : "The number has been deleted.",
    });
  };

  // Interval management
  const handleSetQueryInterval = (interval: number) => {
    setQueryInterval(interval);
    toast({
      title: "Query interval updated",
      description: `Query interval set to ${interval} minutes.`,
    });
  };

  const handleSetReportInterval = (interval: number) => {
    setReportInterval(interval);
    toast({
      title: "Report interval updated",
      description: `Report interval set to ${interval} hours.`,
    });
  };

  // Helper functions
  const getUserNumbers = (userId: string) => {
    return numbers.filter(number => number.userId === userId);
  };

  const getActiveNumbers = () => {
    return numbers.filter(number => number.isActive);
  };

  const getNumberCount = (userId: string) => {
    return numbers.filter(number => number.userId === userId).length;
  };

  const isUserAtNumberLimit = (userId: string) => {
    const userConfig = userConfigs.find(config => config.id === userId);
    if (!userConfig) return true; // No config means no permission
    
    const count = getNumberCount(userId);
    return count >= userConfig.maxNumbers;
  };

  return (
    <ConfigContext.Provider
      value={{
        apiConfigs,
        userConfigs,
        numbers,
        queryInterval,
        reportInterval,
        addApiConfig,
        updateApiConfig,
        deleteApiConfig,
        addUserConfig,
        updateUserConfig,
        deleteUserConfig,
        addNumber,
        updateNumber,
        deleteNumber,
        setQueryInterval: handleSetQueryInterval,
        setReportInterval: handleSetReportInterval,
        getUserNumbers,
        getActiveNumbers,
        getNumberCount,
        isUserAtNumberLimit,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
