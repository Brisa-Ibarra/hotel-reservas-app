const API_URL = 'http://localhost:3000';

export const api = {
    async post(endpoint: string, body: object) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.json();
    },

    async get(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`);
        return response.json();
    },

    async put(endpoint: string, body: object) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.json();
    },
};