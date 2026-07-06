import { useState, useCallback } from 'react';
import { api } from '../services/api';

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    nombre: string;
    email: string;
    password: string;
}

interface UseAuthResult {
    login: (input: LoginInput) => Promise<{ success: boolean; role?: 'admin' | 'guest' }>;
    register: (input: RegisterInput) => Promise<boolean>;
    loading: boolean;
    error: string;
}

export function useAuth(): UseAuthResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = useCallback(async ({ email, password }: LoginInput) => {
        setLoading(true);
        setError('');
        const result = await api.post('/users/login', { email, password });
        setLoading(false);

        if (result.error) {
            setError(result.error);
            return { success: false };
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('email', email);

        return { success: true, role: result.role as 'admin' | 'guest' };
    }, []);

    const register = useCallback(async ({ nombre, email, password }: RegisterInput) => {
        setLoading(true);
        setError('');
        const result = await api.post('/users/register', { nombre, email, password });
        setLoading(false);

        if (result.error) {
            setError(result.error);
            return false;
        }
        return true;
    }, []);

    return { login, register, loading, error };
}