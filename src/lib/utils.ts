
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from 'crypto-js';

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
  // Basic validation based on the PDF requirements - numeric length 8+
  return /^\d{8,}$/.test(phone);
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

// Generate token as per API documentation
export function generateToken(transId: string, mobile: string, username: string, password: string): string {
  // MD5 hash the password
  const hashPassword = CryptoJS.MD5(password).toString();
  
  // MD5 hash the combination of hashPassword + transId + username + mobile
  const token = CryptoJS.MD5(hashPassword + transId + username + mobile).toString();
  
  return token;
}

// Updated API endpoints based on PDF
export const API_ENDPOINTS = {
  ADSL: {
    base: "https://kdabra.yemoney.net/api/yr/",
    query: "post?action=query",
    bill: "post?action=bill",
  },
  YEMENFORGE: {
    base: "https://domainname/api/yr/yem4g",
    query: "?action=query",
  }
};

// API credentials structure based on PDF
export interface APICredentials {
  userId: string;
  domainName: string;
  username: string;
  password: string;
}

// Default API credentials
export const DEFAULT_API_CREDENTIALS: APICredentials = {
  userId: "youruserid",
  domainName: "domainname",
  username: "yourloginName",
  password: "yourpassword"
};
