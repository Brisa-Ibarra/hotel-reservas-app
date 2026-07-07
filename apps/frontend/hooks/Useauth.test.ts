import { expect, it, describe, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { ApiClient } from '../services/api';

const mockApiClient: ApiClient = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
};

describe('useAuth Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('debe guardar token, role, userId y email si el login es exitoso', async () => {
            vi.mocked(mockApiClient.post).mockResolvedValueOnce({
                token: 'tok123',
                role: 'guest',
                userId: 'u1',
            });
            const { result } = renderHook(() => useAuth(mockApiClient));

            let response;
            await act(async () => {
                response = await result.current.login({ email: 'a@a.com', password: '123' });
            });

            expect(response).toEqual({ success: true, role: 'guest' });
            expect(localStorage.getItem('token')).toBe('tok123');
            expect(localStorage.getItem('role')).toBe('guest');
            expect(localStorage.getItem('userId')).toBe('u1');
            expect(localStorage.getItem('email')).toBe('a@a.com');
        });

        it('debe fallar y no guardar nada si las credenciales son inválidas', async () => {
            vi.mocked(mockApiClient.post).mockResolvedValueOnce({
                error: 'Credenciales inválidas',
            });
            const { result } = renderHook(() => useAuth(mockApiClient));

            let response;
            await act(async () => {
                response = await result.current.login({ email: 'a@a.com', password: 'mala' });
            });

            expect(response).toEqual({ success: false });
            expect(result.current.error).toBe('Credenciales inválidas');
            expect(localStorage.getItem('token')).toBeNull();
        });

        it('debe exponer loading en true mientras la petición está en curso', async () => {
            let resolvePromise: (value: unknown) => void = () => {};
            vi.mocked(mockApiClient.post).mockReturnValueOnce(
                new Promise((resolve) => {
                    resolvePromise = resolve;
                })
            );
            const { result } = renderHook(() => useAuth(mockApiClient));

            act(() => {
                result.current.login({ email: 'a@a.com', password: '123' });
            });

            await waitFor(() => expect(result.current.loading).toBe(true));

            await act(async () => {
                resolvePromise({ token: 't', role: 'guest', userId: 'u1' });
            });

            expect(result.current.loading).toBe(false);
        });
    });

    describe('register', () => {
        it('debe registrar correctamente un usuario nuevo', async () => {
            vi.mocked(mockApiClient.post).mockResolvedValueOnce({ id: 'u1' });
            const { result } = renderHook(() => useAuth(mockApiClient));

            let response;
            await act(async () => {
                response = await result.current.register({
                    nombre: 'Brisa',
                    email: 'b@b.com',
                    password: '123',
                });
            });

            expect(response).toBe(true);
            expect(result.current.error).toBe('');
        });

        it('debe fallar si el email ya está registrado', async () => {
            vi.mocked(mockApiClient.post).mockResolvedValueOnce({
                error: 'El email ya está registrado',
            });
            const { result } = renderHook(() => useAuth(mockApiClient));

            let response;
            await act(async () => {
                response = await result.current.register({
                    nombre: 'Brisa',
                    email: 'b@b.com',
                    password: '123',
                });
            });

            expect(response).toBe(false);
            expect(result.current.error).toBe('El email ya está registrado');
        });
    });
});