/**
 * API Client for Quantalyze
 * 
 * This client handles API calls for both:
 * - Static site on ServerByt (calls Railway API)
 * - Dynamic site on Railway (calls local API)
 * 
 * In static build, NEXT_PUBLIC_API_URL points to Railway
 * In Railway build, it uses relative paths (same origin)
 */

// Get the API base URL
// - On static site: points to Railway (e.g., https://quantalyze-api.up.railway.app)
// - On Railway: empty string (same origin)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper to build full API URL
function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============= Public API Functions =============

/**
 * Submit contact form inquiry
 */
export async function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(data: {
  email: string;
  name?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiFetch('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get website content (for dynamic content blocks)
 */
export async function getContent(key: string): Promise<{ value: string } | null> {
  try {
    return await apiFetch(`/api/content?key=${encodeURIComponent(key)}`);
  } catch {
    return null;
  }
}

/**
 * Get all services
 */
export async function getServices(): Promise<any[]> {
  try {
    const response = await apiFetch<{ success: boolean; services: any[] }>('/api/services');
    return response.services || [];
  } catch {
    return [];
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{
  status: string;
  database: { type: string; status: string };
}> {
  return apiFetch('/api/health');
}

// ============= Admin API Functions =============

/**
 * Admin login
 */
export async function adminLogin(credentials: {
  username: string;
  password: string;
}): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}> {
  return apiFetch('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Verify admin token
 */
export async function verifyAdminToken(token: string): Promise<{
  success: boolean;
  user?: any;
}> {
  return apiFetch('/api/admin/auth/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Export the base URL for debugging
export { API_BASE_URL };
