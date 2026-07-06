import { useState, useCallback } from 'react';
import { api } from '../services/api';

interface CreateReservationInput {
    userId: string;
    roomId: string;
    startDate: string;
    endDate: string;
}

interface UseCreateReservationResult {
    createReservation: (input: CreateReservationInput) => Promise<boolean>;
    loading: boolean;
    error: string;
}

export function useCreateReservation(): UseCreateReservationResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createReservation = useCallback(async (input: CreateReservationInput) => {
        setLoading(true);
        setError('');
        const result = await api.post('/reservations', input);
        setLoading(false);
        if (result.error) {
            setError(result.error);
            return false;
        }
        return true;
    }, []);

    return { createReservation, loading, error };
}