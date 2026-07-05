'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoomCard } from '../../components/RoomCard';
import { Navbar } from '../../components/Navbar';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { api } from '../../services/api';

interface Room {
    id: string;
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'under_maintenance';
}

export default function RoomsPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');

    const fetchRooms = useCallback(async () => {
        const result = await api.get('/rooms/available?startDate=2027-01-01&endDate=2027-12-31');
        if (!result.error) setRooms(result);
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role') as 'admin' | 'guest';
        setUserRole(role ?? 'guest');
        fetchRooms();
    }, [fetchRooms]);

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            setError('Ingresá ambas fechas');
            return;
        }
        setError('');
        const result = await api.get(`/rooms/available?startDate=${startDate}&endDate=${endDate}`);
        if (!result.error) setRooms(result);
    };

    const handleReserve = (roomId: string) => {
        router.push(`/reservations/new?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                <Navbar userRole={userRole} onLogout={handleLogout} />
                <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold">Habitaciones disponibles</h2>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-end">
                        <Input label="Check-in" type="date" value={startDate} onChange={setStartDate} />
                        <Input label="Check-out" type="date" value={endDate} onChange={setEndDate} />
                        <Button label="Buscar" onClick={handleSearch} />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map(room => (
                            <RoomCard
                                key={room.id}
                                number={room.number}
                                type={room.type}
                                price={room.price}
                                description={room.description}
                                status={room.status}
                                onReserve={() => handleReserve(room.id)}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => router.push('/reservations')}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Ver mis reservas
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}