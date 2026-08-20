const configuredApiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_BASE = configuredApiBase || '/api';

/**
 * Custom API client for Grand Hotel FastAPI Backend
 */
export async function apiClient(endpoint, { data, method, headers: customHeaders, params, ...customConfig } = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  let url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Attach query parameters if provided
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const config = {
    method: method || (data ? 'POST' : 'GET'),
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized (expired/invalid token)
    if (response.status === 401) {
      if (!endpoint.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Dispatch custom auth event to update UI reactively
        window.dispatchEvent(new Event('auth-logout'));
      }
    }

    const resData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        resData?.message ||
        resData?.detail ||
        resData?.errors?.details?.[0]?.message ||
        `Request failed with status ${response.status}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = resData;
      throw error;
    }

    // Unwrap FastAPI ResponseModel envelope if present
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return {
        data: resData.data,
        total: resData.total,
        message: resData.message,
        success: resData.success,
      };
    }

    return { data: resData };
  } catch (error) {
    console.error(`API Error [${config.method} ${url}]:`, error.message);
    throw error;
  }
}
