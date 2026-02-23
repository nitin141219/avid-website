/**
 * Safe API Fetch Utility
 * Handles 403 and other errors gracefully with proper logging
 */

export interface SafeFetchOptions {
  cache?: RequestCache;
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit;
}

export interface SafeFetchResult<T> {
  data: T | null;
  error: {
    status: number;
    message: string;
  } | null;
  ok: boolean;
}

/**
 * Makes a safe API fetch with comprehensive error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns SafeFetchResult with data or error
 */
export async function safeFetch<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const {
    cache = "no-store",
    headers = {},
    method = "GET",
    body,
  } = options;

  try {
    const res = await fetch(url, {
      method,
      cache,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body,
    });

    if (!res.ok) {
      // Handle specific HTTP errors
      let errorMessage = `HTTP ${res.status}`;
      
      switch (res.status) {
        case 400:
          errorMessage = "Bad Request - Invalid parameters";
          console.warn(`400 Bad Request: ${url}`);
          break;
        case 401:
          errorMessage = "Unauthorized - Authentication required";
          console.error(`401 Unauthorized: ${url}`);
          break;
        case 403:
          errorMessage = "Forbidden - Access denied";
          console.error(`403 Forbidden: ${url}`);
          console.error("Check if NEXT_PUBLIC_BASE_URL is correctly configured and API has proper CORS settings");
          break;
        case 404:
          errorMessage = "Not Found - Resource does not exist";
          console.warn(`404 Not Found: ${url}`);
          break;
        case 500:
          errorMessage = "Internal Server Error";
          console.error(`500 Internal Server Error: ${url}`);
          break;
        case 502:
          errorMessage = "Bad Gateway - Backend server issue";
          console.error(`502 Bad Gateway: ${url}`);
          break;
        case 503:
          errorMessage = "Service Unavailable";
          console.error(`503 Service Unavailable: ${url}`);
          break;
        default:
          errorMessage = `Request failed with status ${res.status}`;
          console.error(`${res.status} Error: ${url}`);
      }

      return {
        data: null,
        error: {
          status: res.status,
          message: errorMessage,
        },
        ok: false,
      };
    }

    // Parse JSON response
    const data = await res.json();

    return {
      data: data as T,
      error: null,
      ok: true,
    };
  } catch (error) {
    // Handle network errors, parsing errors, etc.
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Fetch error for ${url}:`, errorMessage);
    
    // Check for common network errors
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      console.error("Network error: Check if the API server is running and accessible");
    }

    return {
      data: null,
      error: {
        status: 0,
        message: errorMessage,
      },
      ok: false,
    };
  }
}

/**
 * Safe fetch specifically for NEXT_PUBLIC_BASE_URL endpoints
 * @param endpoint - The endpoint path (e.g., "/api/blogs/slug")
 * @param options - Fetch options
 * @returns SafeFetchResult with data or error
 */
export async function safeFetchPublic<T = any>(
  endpoint: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not configured in environment variables");
    return {
      data: null,
      error: {
        status: 0,
        message: "NEXT_PUBLIC_BASE_URL not configured",
      },
      ok: false,
    };
  }

  const url = `${baseUrl}${endpoint}`;
  return safeFetch<T>(url, options);
}

/**
 * Safe fetch specifically for backend API endpoints
 * @param endpoint - The endpoint path (e.g., "/api/v1/blogs")
 * @param options - Fetch options
 * @returns SafeFetchResult with data or error
 */
export async function safeFetchBackend<T = any>(
  endpoint: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const backendUrl = process.env.BACKEND_URL;
  
  if (!backendUrl) {
    console.warn("BACKEND_URL is not configured, using fallback behavior");
    return {
      data: null,
      error: {
        status: 0,
        message: "BACKEND_URL not configured",
      },
      ok: false,
    };
  }

  const url = `${backendUrl}${endpoint}`;
  return safeFetch<T>(url, options);
}

/**
 * Retry fetch with exponential backoff for transient errors (502, 503, 504)
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns SafeFetchResult with data or error
 */
export async function safeFetchWithRetry<T = any>(
  url: string,
  options: SafeFetchOptions = {},
  maxRetries: number = 3
): Promise<SafeFetchResult<T>> {
  let lastResult: SafeFetchResult<T> = {
    data: null,
    error: { status: 0, message: "No attempts made" },
    ok: false,
  };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    lastResult = await safeFetch<T>(url, options);

    if (lastResult.ok || !lastResult.error) {
      return lastResult;
    }

    // Only retry on transient server errors
    const shouldRetry = 
      lastResult.error.status === 502 || 
      lastResult.error.status === 503 || 
      lastResult.error.status === 504;

    if (!shouldRetry || attempt === maxRetries) {
      return lastResult;
    }

    // Exponential backoff: 100ms, 200ms, 400ms
    const delay = 100 * Math.pow(2, attempt);
    console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return lastResult;
}
