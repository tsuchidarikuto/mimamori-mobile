// API Base Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
};

// Generic API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    console.log(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'ネットワークエラーが発生しました。インターネット接続を確認してください。'
    );
  }
};

// HTTP method helpers
export const apiGet = <T>(endpoint: string, headers?: Record<string, string>): Promise<T> =>
  apiRequest<T>(endpoint, { method: 'GET', headers });

export const apiPost = <T>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> =>
  apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers,
  });

export const apiPut = <T>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    headers,
  });

export const apiDelete = <T>(endpoint: string, headers?: Record<string, string>): Promise<T> =>
  apiRequest<T>(endpoint, { method: 'DELETE', headers });