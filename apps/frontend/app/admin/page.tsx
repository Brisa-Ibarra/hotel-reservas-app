'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationCard } from '../../components/ReservationCard';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
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

export default function AdminPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const fetchReservations = useCallback(async () => {
        const result = await api.get('/reservations?userRole=admin');
        if (!result.error) setReservations(result);
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleConfirm = async (reservationId: string) => {
        await api.put(`/reservations/${reservationId}/confirm`, { userRole: 'admin' });
        fetchReservations();
    };

    const handleCancel = async (reservationId: string) => {
        await api.put(`/reservations/${reservationId}/cancel`, { userRole: 'admin' });
        fetchReservations();
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-100">
                <Navbar userRole="admin" onLogout={handleLogout} />
                <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold">Panel de administración</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reservations.length === 0 && (
                            <p className="text-gray-500">No hay reservas</p>
                        )}
                        {reservations.map(reservation => (
                            <div key={reservation.id} className="flex flex-col gap-2">
                                <ReservationCard
                                    id={reservation.id}
                                    roomId={reservation.roomId}
                                    startDate={reservation.startDate.slice(0, 10)}
                                    endDate={reservation.endDate.slice(0, 10)}
                                    status={reservation.status}
                                    totalPrice={reservation.totalPrice}
                                    onCancel={() => handleCancel(reservation.id)}
                                />
                                {reservation.status === 'pending' && (
                                    <button
                                        onClick={() => handleConfirm(reservation.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full"
                                    >
                                        Confirmar reserva
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}