const API_URL = 'http://localhost:3000';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token'); 
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
    async post(endpoint: string, body: object) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch {
            return { error: 'No se pudo conectar con el servidor' };
        }
    },

    async get(endpoint: string) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { ...authHeaders() },
            });
            return await response.json();
        } catch {
            return { error: 'No se pudo conectar con el servidor' };
        }
    },

    async put(endpoint: string, body: object) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch {
            return { error: 'No se pudo conectar con el servidor' };
        }
    },

    async delete(endpoint: string) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: { ...authHeaders() },
            });
            return await response.json();
        } catch {
            return { error: 'No se pudo conectar con el servidor' };
        }
    },
};