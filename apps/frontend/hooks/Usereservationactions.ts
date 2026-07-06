import { useState, useCallback } from 'react';
import { api } from '../services/api';

interface UseReservationActionsResult {
    confirmReservation: (reservationId: string) => Promise<boolean>;
    cancelReservation: (reservationId: string, userId?: string) => Promise<boolean>;
    loading: boolean;
    error: string;
}

export function useReservationActions(role: 'admin' | 'guest'): UseReservationActionsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const confirmReservation = useCallback(
        async (reservationId: string) => {
            setLoading(true);
            setError('');
            const result = await api.put(`/reservations/${reservationId}/confirm`, {
                userRole: role,
            });
            setLoading(false);
            if (result.error) {
                setError(result.error);
                return false;
            }
            return true;
        },
        [role]
    );

    const cancelReservation = useCallback(
        async (reservationId: string, userId?: string) => {
            setLoading(true);
            setError('');
            const body = role === 'admin' ? { userRole: 'admin' } : { userId };
            const result = await api.put(`/reservations/${reservationId}/cancel`, body);
            setLoading(false);
            if (result.error) {
                setError(result.error);
                return false;
            }
            return true;
        },
        [role]
    );

    return { confirmReservation, cancelReservation, loading, error };
}