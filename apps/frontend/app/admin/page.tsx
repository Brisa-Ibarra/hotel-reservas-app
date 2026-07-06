'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationCard } from '../../components/ReservationCard';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { api } from '../../services/api';
import { Settings, Inbox, ClipboardCheck } from 'lucide-react';

interface Reservation {
    id: string;
    userId: string;
    roomId: string;
    roomNumber: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
}

export default function AdminPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        const result = await api.get('/reservations?userRole=admin');
        if (!result.error) setReservations(result);
        setLoading(false);
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

    const pending = reservations.filter((r) => r.status === 'pending');
    const others = reservations.filter((r) => r.status !== 'pending');

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-[#F5F0E8]">
                <Navbar userRole="admin" onLogout={handleLogout} />

                {/* Hero section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#2D4A2D] via-[#2D4A2D] to-[#1F361F] text-white py-14 px-6 text-center">
                    <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#C4A35A]/10 blur-3xl" />
                    <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-[#C4A35A]/10 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-2 animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 text-[#C4A35A] text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[#C4A35A]/30 px-4 py-1.5 rounded-full">
                            <Settings size={14} />
                            Administración
                        </span>
                        <h2 className="text-4xl font-bold">Panel de administración</h2>
                        <p className="text-[#E8D9B5] text-lg">
                            {reservations.length} reserva(s) en total
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6 -mt-10">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-44 rounded-2xl border border-[#C4A35A]/10 skeleton-shimmer"
                                />
                            ))}
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border border-dashed border-[#C4A35A]/30 shadow-sm animate-fade-in-scale flex flex-col items-center gap-4">
                            <span className="bg-[#2D4A2D]/10 p-4 rounded-full">
                                <Inbox size={32} className="text-[#2D4A2D]" />
                            </span>
                            <p className="text-gray-500 text-lg">No hay reservas todavía</p>
                        </div>
                    ) : (
                        <>
                            {pending.length > 0 && (
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#C4A35A]/20 p-6 flex flex-col gap-4 animate-fade-in-up">
                                    <h3 className="text-[#2D4A2D] font-bold text-xl border-b border-[#C4A35A]/30 pb-2 flex items-center gap-2">
                                        <ClipboardCheck size={20} className="text-[#C4A35A]" />
                                        Reservas pendientes
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                            {pending.length}
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                                        {pending.map((reservation, index) => (
                                            <div key={reservation.id} className="flex flex-col gap-2">
                                                <ReservationCard
                                                    id={String(index + 1).padStart(4, '0')}
                                                    roomNumber={reservation.roomNumber}
                                                    startDate={reservation.startDate.slice(0, 10)}
                                                    endDate={reservation.endDate.slice(0, 10)}
                                                    status={reservation.status}
                                                    totalPrice={reservation.totalPrice}
                                                    onCancel={() => handleCancel(reservation.id)}
                                                />
                                                <button
                                                    onClick={() => handleConfirm(reservation.id)}
                                                    className="bg-[#2D4A2D] hover:bg-[#3D5A3D] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-medium transition-all w-full shadow-sm shadow-[#2D4A2D]/20"
                                                >
                                                    Confirmar reserva
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {others.length > 0 && (
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#C4A35A]/20 p-6 flex flex-col gap-4 animate-fade-in-up">
                                    <h3 className="text-[#2D4A2D] font-bold text-xl border-b border-[#C4A35A]/30 pb-2">
                                        Todas las reservas
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                                        {others.map((reservation, index) => (
                                            <div key={reservation.id} className="flex flex-col gap-2">
                                                <ReservationCard
                                                    id={String(pending.length + index + 1).padStart(4, '0')}
                                                    roomNumber={reservation.roomNumber}
                                                    startDate={reservation.startDate.slice(0, 10)}
                                                    endDate={reservation.endDate.slice(0, 10)}
                                                    status={reservation.status}
                                                    totalPrice={reservation.totalPrice}
                                                    onCancel={() => handleCancel(reservation.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}