/**
 * Lightweight API fetch wrapper
 * Handles uniform error extraction, headers, and query parameters
 */

const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
    const { method = 'GET', body, params } = options;
    
    let url = `${API_BASE}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                searchParams.append(key, val);
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const headers = {
        'Accept': 'application/json',
        ...(options.headers || {})
    };

    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body && !(body instanceof FormData) ? JSON.stringify(body) : body
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.details = data?.details;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        if (!err.status) {
            err.message = err.message === 'Failed to fetch' 
                ? 'Cannot connect to backend server. Ensure API is running on port 5000.'
                : err.message;
        }
        throw err;
    }
}

export const api = {
    get: (endpoint, params) => apiRequest(endpoint, { method: 'GET', params }),
    post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
