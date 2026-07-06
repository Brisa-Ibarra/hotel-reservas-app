import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Room {
    id: string;
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'under_maintenance';
}

interface UseAvailableRoomsResult {
    rooms: Room[];
    loading: boolean;
    error: string;
    search: (startDate: string, endDate: string) => Promise<void>;
}

const DEFAULT_START = '2027-01-01';
const DEFAULT_END = '2027-12-31';

export function useAvailableRooms(): UseAvailableRoomsResult {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const search = useCallback(async (startDate: string, endDate: string) => {
        setLoading(true);
        setError('');
        const result = await api.get(`/rooms/available?startDate=${startDate}&endDate=${endDate}`);
        if (result.error) {
            setError(result.error);
        } else {
            setRooms(result);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        search(DEFAULT_START, DEFAULT_END);
    }, [search]);

    return { rooms, loading, error, search };
}