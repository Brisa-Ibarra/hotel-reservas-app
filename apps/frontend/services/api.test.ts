import { expect, it, describe, vi, beforeEach } from 'vitest';
import { api } from './api';

function mockFetchOnce(jsonResponse: unknown) {
    global.fetch = vi.fn().mockResolvedValueOnce({
        json: async () => jsonResponse,
    }) as unknown as typeof fetch;
}

describe('api service', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('post', () => {
        it('debe enviar método, headers y body correctos', async () => {
            mockFetchOnce({ ok: true });

            await api.post('/users/login', { email: 'a@a.com', password: '123' });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/users/login'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ email: 'a@a.com', password: '123' }),
                })
            );
        });

        it('debe incluir el header Authorization si hay token guardado', async () => {
            localStorage.setItem('token', 'abc123');
            mockFetchOnce({ ok: true });

            await api.post('/reservations', {});

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: 'Bearer abc123' }),
                })
            );
        });

        it('no debe incluir Authorization si no hay token', async () => {
            mockFetchOnce({ ok: true });

            await api.post('/reservations', {});

            const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
            const headers = call[1].headers as Record<string, string>;
            expect(headers.Authorization).toBeUndefined();
        });

        it('debe devolver un error controlado si el fetch falla', async () => {
            global.fetch = vi.fn().mockRejectedValueOnce(new Error('network down'));

            const result = await api.post('/users/login', {});

            expect(result).toEqual({ error: 'No se pudo conectar con el servidor' });
        });

        it('debe devolver el JSON parseado de la respuesta', async () => {
            mockFetchOnce({ token: 'xyz', role: 'admin' });

            const result = await api.post('/users/login', {});

            expect(result).toEqual({ token: 'xyz', role: 'admin' });
        });
    });

    describe('get', () => {
        it('no debe enviar Content-Type ni body', async () => {
            mockFetchOnce([]);

            await api.get('/rooms/available?startDate=2027-01-01&endDate=2027-01-05');

            const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
            expect(call[1].body).toBeUndefined();
        });

        it('debe devolver un error controlado ante falla de red', async () => {
            global.fetch = vi.fn().mockRejectedValueOnce(new Error('offline'));

            const result = await api.get('/reservations');

            expect(result).toEqual({ error: 'No se pudo conectar con el servidor' });
        });
    });

    describe('put', () => {
        it('debe enviar método PUT con el body serializado', async () => {
            mockFetchOnce({ ok: true });

            await api.put('/reservations/1/confirm', { userRole: 'admin' });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/reservations/1/confirm'),
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify({ userRole: 'admin' }),
                })
            );
        });
    });

    describe('delete', () => {
        it('debe enviar método DELETE sin body', async () => {
            mockFetchOnce({ ok: true });

            await api.delete('/reservations/1');

            const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
            expect(call[1].method).toBe('DELETE');
            expect(call[1].body).toBeUndefined();
        });
    });
});