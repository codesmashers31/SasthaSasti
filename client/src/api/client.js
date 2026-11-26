import axios from 'axios';

const resolveBaseUrl = () => {
  let url = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
  url = url.replace(/\/+$/, '');
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// High-speed In-Memory Cache & In-Flight Request Deduplication
const apiCache = new Map();
const inFlightRequests = new Map();
const DEFAULT_TTL_MS = 30000; // 30 seconds

export const clearApiCache = () => {
  apiCache.clear();
  inFlightRequests.clear();
};

const originalGet = api.get.bind(api);

api.get = (url, config = {}) => {
  // Allow bypassing cache if requested
  if (config.skipCache) {
    return originalGet(url, config);
  }

  const cacheKey = `${url}?${JSON.stringify(config.params || {})}`;
  const now = Date.now();

  // Return cached result if valid
  const cached = apiCache.get(cacheKey);
  if (cached && now - cached.timestamp < (config.ttl || DEFAULT_TTL_MS)) {
    return Promise.resolve(cached.data);
  }

  // Deduplicate in-flight requests to avoid concurrent duplicate network calls
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const promise = originalGet(url, config)
    .then((data) => {
      apiCache.set(cacheKey, { timestamp: Date.now(), data });
      inFlightRequests.delete(cacheKey);
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

// Automatically invalidate cache on mutating requests
['post', 'put', 'patch', 'delete'].forEach((method) => {
  const originalMethod = api[method].bind(api);
  api[method] = async (...args) => {
    clearApiCache();
    return originalMethod(...args);
  };
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
