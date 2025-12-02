/**
 * Python Backend API Service
 * Provides integration with the advanced Python backend features
 */

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

// Get auth token from localStorage or cookies
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
}

// Create headers with authentication
function getHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${PYTHON_API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============= Analytics API =============

export interface AnalyticsDashboard {
  success: boolean;
  data: {
    period: string;
    inquiries: TimeSeriesData;
    subscribers: TimeSeriesData;
    metrics: {
      total_inquiries: number;
      conversion_rate: number;
      avg_daily_inquiries: number;
      growth_rate: number;
    };
    insights: string[];
  };
}

export interface TimeSeriesData {
  labels: string[];
  values: number[];
  trend: 'up' | 'down' | 'stable';
  change_percent: number;
}

export const analyticsAPI = {
  getDashboard: (period: string = '30d'): Promise<AnalyticsDashboard> =>
    apiRequest(`/api/analytics/dashboard?period=${period}`),

  getInquiryBreakdown: () =>
    apiRequest('/api/analytics/inquiries/breakdown'),

  getRevenueForecast: (months: number = 3) =>
    apiRequest(`/api/analytics/revenue/forecast?months=${months}`),
};

// ============= Reports API =============

export interface ReportRequest {
  report_type: 'inquiries' | 'subscribers' | 'revenue' | 'comprehensive';
  period: string;
  format: 'pdf' | 'excel' | 'csv';
}

export const reportsAPI = {
  generateReport: async (request: ReportRequest): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${PYTHON_API_URL}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.blob();
  },

  getReportTypes: () =>
    apiRequest('/api/reports/types'),
};

// ============= AI Assistant API =============

export interface ContentRequest {
  prompt: string;
  content_type: 'email' | 'blog' | 'social' | 'response';
  tone?: 'professional' | 'casual' | 'friendly';
  length?: 'short' | 'medium' | 'long';
}

export interface ContentResponse {
  success: boolean;
  content: string;
  model: string;
  tokens_used?: number;
}

export const aiAPI = {
  generateContent: (request: ContentRequest): Promise<ContentResponse> =>
    apiRequest('/api/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  analyzeText: (text: string, analysis_type: 'sentiment' | 'keywords' | 'summary') =>
    apiRequest('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, analysis_type }),
    }),

  generateInquiryResponse: (inquiry_id: number, custom_context?: string) =>
    apiRequest('/api/ai/generate-inquiry-response', {
      method: 'POST',
      body: JSON.stringify({ inquiry_id, custom_context }),
    }),

  getCapabilities: () =>
    apiRequest('/api/ai/capabilities'),
};

// ============= Email API =============

export interface EmailRequest {
  to: string[];
  subject: string;
  body: string;
  html?: boolean;
}

export interface CampaignRequest {
  name: string;
  subject: string;
  body: string;
  target?: 'all' | 'active' | 'new';
}

export const emailAPI = {
  sendEmail: (request: EmailRequest) =>
    apiRequest('/api/email/send', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  createCampaign: (request: CampaignRequest) =>
    apiRequest('/api/email/campaign', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getTemplates: () =>
    apiRequest('/api/email/templates'),

  getStatus: () =>
    apiRequest('/api/email/status'),
};

// ============= Data Export API =============

export interface ExportRequest {
  data_type: 'inquiries' | 'subscribers' | 'team' | 'services' | 'all';
  format: 'json' | 'csv' | 'excel';
}

export const exportAPI = {
  exportData: async (request: ExportRequest): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${PYTHON_API_URL}/api/export/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    return response.blob();
  },

  createBackup: async (include: string[] = ['inquiries', 'subscribers', 'team', 'services']): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${PYTHON_API_URL}/api/export/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ include }),
    });

    if (!response.ok) {
      throw new Error('Failed to create backup');
    }

    return response.blob();
  },

  getStats: () =>
    apiRequest('/api/export/stats'),

  getAvailableExports: () =>
    apiRequest('/api/export/available'),
};

// ============= Health Check =============

export const healthAPI = {
  check: () =>
    apiRequest<{ status: string; version: string; service: string }>('/api/health'),
};

// ============= Utility Functions =============

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function checkPythonBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
