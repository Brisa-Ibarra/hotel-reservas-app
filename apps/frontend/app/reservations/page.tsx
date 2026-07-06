'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationCard } from '../../components/ReservationCard';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { TopoLines } from '../../components/TopoLines';
import { useReservations } from '../../hooks/Usereservations';
import { useReservationActions } from '../../hooks/Usereservationactions';
import { ClipboardList, ArrowLeft, CalendarX } from 'lucide-react';

export default function ReservationsPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setUserRole((localStorage.getItem('role') as 'admin' | 'guest') ?? 'guest');
        setUserId(localStorage.getItem('userId') ?? '');
    }, []);

    const { reservations, loading, refetch } = useReservations(userId, userRole);
    const { cancelReservation } = useReservationActions(userRole);

    const handleCancel = async (reservationId: string) => {
        const success = await cancelReservation(reservationId, userId);
        if (success) refetch();
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const active = reservations.filter((r) => r.status === 'pending' || r.status === 'confirmed');
    const past = reservations.filter((r) => r.status === 'cancelled' || r.status === 'completed');

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F5F0E8] paper-grain">
                <Navbar userRole={userRole} onLogout={handleLogout} />

                <div className="relative overflow-hidden bg-gradient-to-b from-[#16281A] via-[#1F3A1F] to-[#0F1F12] text-white py-14 px-6 text-center">
                    <TopoLines />

                    <div className="relative flex flex-col items-center gap-2 animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 text-[#C4A35A] text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[#C4A35A]/30 px-4 py-1.5 rounded-full">
                            <ClipboardList size={14} />
                            {userRole === 'admin' ? 'Vista administrador' : 'Tu historial'}
                        </span>
                        <h2 className="font-heading italic text-4xl font-medium">
                            {userRole === 'admin' ? 'Todas las reservas' : 'Mis reservas'}
                        </h2>
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
                            <span className="bg-[#1F3A1F]/10 p-4 rounded-full">
                                <CalendarX size={32} className="text-[#1F3A1F]" />
                            </span>
                            <p className="text-gray-500 text-lg">No tenés reservas todavía</p>
                            <button
                                onClick={() => router.push('/rooms')}
                                className="btn-shine bg-[#1F3A1F] hover:bg-[#2D4A2D] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-[#1F3A1F]/20"
                            >
                                Ver habitaciones
                            </button>
                        </div>
                    ) : (
                        <>
                            {active.length > 0 && (
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#C4A35A]/20 p-6 flex flex-col gap-4 animate-fade-in-up">
                                    <h3 className="text-[#1F3A1F] font-heading italic text-xl border-b border-[#C4A35A]/30 pb-2 flex items-center gap-2">
                                        Reservas activas
                                        <span className="text-xs bg-[#1F3A1F]/10 text-[#1F3A1F] px-2 py-0.5 rounded-full font-medium not-italic font-body">
                                            {active.length}
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                                        {active.map((reservation, index) => (
                                            <ReservationCard
                                                key={reservation.id}
                                                id={String(index + 1).padStart(4, '0')}
                                                roomNumber={reservation.roomNumber}
                                                startDate={reservation.startDate.slice(0, 10)}
                                                endDate={reservation.endDate.slice(0, 10)}
                                                status={reservation.status}
                                                totalPrice={reservation.totalPrice}
                                                onCancel={() => handleCancel(reservation.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {past.length > 0 && (
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#C4A35A]/20 p-6 flex flex-col gap-4 animate-fade-in-up">
                                    <h3 className="text-[#1F3A1F] font-heading italic text-xl border-b border-[#C4A35A]/30 pb-2 flex items-center gap-2">
                                        Historial
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium not-italic font-body">
                                            {past.length}
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                                        {past.map((reservation, index) => (
                                            <ReservationCard
                                                key={reservation.id}
                                                id={String(active.length + index + 1).padStart(4, '0')}
                                                roomNumber={reservation.roomNumber}
                                                startDate={reservation.startDate.slice(0, 10)}
                                                endDate={reservation.endDate.slice(0, 10)}
                                                status={reservation.status}
                                                totalPrice={reservation.totalPrice}
                                                onCancel={() => handleCancel(reservation.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <button
                        onClick={() => router.push('/rooms')}
                        className="group flex items-center justify-center gap-2 text-[#8B6914] hover:text-[#1F3A1F] text-sm font-medium transition-colors py-2"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Ver habitaciones
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}