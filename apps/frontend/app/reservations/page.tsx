'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationCard } from '../../components/ReservationCard';
import { Navbar } from '../../components/Navbar';
import { api } from '../../services/api';

interface Reservation {
    id: string;
    userId: string;
    roomId: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
}

export default function ReservationsPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');
    const [userId, setUserId] = useState('');

    const fetchReservations = useCallback(async (id: string, role: string) => {
        if (role === 'admin') {
            const result = await api.get('/reservations?userRole=admin');
            if (!result.error) setReservations(result);
        } else {
            const result = await api.get(`/reservations/my/${id}`);
            if (!result.error) setReservations(result);
        }
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role') as 'admin' | 'guest';
        const id = localStorage.getItem('userId') ?? '';
        setUserRole(role ?? 'guest');
        setUserId(id);
        fetchReservations(id, role ?? 'guest');
    }, [fetchReservations]);

    const handleCancel = async (reservationId: string) => {
        await api.put(`/reservations/${reservationId}/cancel`, { userId });
        fetchReservations(userId, userRole);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userRole={userRole} onLogout={handleLogout} />
            <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
                <h2 className="text-2xl font-bold">
                    {userRole === 'admin' ? 'Todas las reservas' : 'Mis reservas'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservations.length === 0 && (
                        <p className="text-gray-500">No hay reservas</p>
                    )}
                    {reservations.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            id={reservation.id}
                            roomId={reservation.roomId}
                            startDate={reservation.startDate.slice(0, 10)}
                            endDate={reservation.endDate.slice(0, 10)}
                            status={reservation.status}
                            totalPrice={reservation.totalPrice}
                            onCancel={() => handleCancel(reservation.id)}
                        />
                    ))}
                </div>
                <button
                    onClick={() => router.push('/rooms')}
                    className="text-blue-600 hover:underline text-sm"
                >
                    Ver habitaciones
                </button>
            </div>
        </div>
    );
}