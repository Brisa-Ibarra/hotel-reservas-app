import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Reservation {
    id: string;
    userId: string;
    roomId: string;
    roomNumber: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
}

interface UseReservationsResult {
    reservations: Reservation[];
    loading: boolean;
    error: string;
    refetch: () => Promise<void>;
}

export function useReservations(userId: string, role: 'admin' | 'guest'): UseReservationsResult {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        setError('');
        const endpoint =
            role === 'admin' ? '/reservations?userRole=admin' : `/reservations/my/${userId}`;
        const result = await api.get(endpoint);
        if (result.error) {
            setError(result.error);
        } else {
            setReservations(result);
        }
        setLoading(false);
    }, [userId, role]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return { reservations, loading, error, refetch: fetchReservations };
}