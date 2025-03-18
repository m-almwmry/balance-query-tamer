
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation - can be expanded based on specific requirements
  return /^\d{7,15}$/.test(phone);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `قبل ${diffInSeconds} ثانية`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `قبل ${diffInMinutes} دقيقة${diffInMinutes > 1 && diffInMinutes < 11 ? '' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `قبل ${diffInHours} ساعة${diffInHours > 1 && diffInHours < 11 ? '' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `قبل ${diffInDays} يوم${diffInDays > 1 && diffInDays < 11 ? '' : ''}`;
}

// Add API endpoints based on PDF
export const API_ENDPOINTS = {
  ADSL: {
    balance: "https://api.example.com/adsl/balance",
    usage: "https://api.example.com/adsl/usage",
    history: "https://api.example.com/adsl/history",
  },
  YEMENFORGE: {
    balance: "https://api.example.com/yemenforge/balance",
    usage: "https://api.example.com/yemenforge/usage",
    history: "https://api.example.com/yemenforge/history",
  }
};

// API credentials structure based on PDF
export interface APICredentials {
  username: string;
  password: string;
  apiKey?: string;
}

// Default API credentials (to be replaced with actual credentials)
export const DEFAULT_API_CREDENTIALS: APICredentials = {
  username: "demo_user",
  password: "demo_password",
  apiKey: "demo_api_key"
};
