'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomCard } from '../../components/RoomCard';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { TopoLines } from '../../components/TopoLines';
import { useAvailableRooms } from '../../hooks/Useavailablerooms';
import {
    Search,
    Calendar,
    BedDouble,
    SlidersHorizontal,
    CalendarCheck,
    ArrowRight,
} from 'lucide-react';

export default function RoomsPage() {
    const router = useRouter();
    const { rooms, loading, error: searchError, search } = useAvailableRooms();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validationError, setValidationError] = useState('');
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');

    useEffect(() => {
        const role = localStorage.getItem('role') as 'admin' | 'guest';
        setUserRole(role ?? 'guest');
    }, []);

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            setValidationError('Ingresá ambas fechas');
            return;
        }
        setValidationError('');
        await search(startDate, endDate);
    };

    const handleReserve = (roomId: string) => {
        router.push(`/reservations/new?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const error = validationError || searchError;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F5F0E8] paper-grain">
                <Navbar userRole={userRole} onLogout={handleLogout} />

                <div className="relative overflow-hidden bg-gradient-to-b from-[#16281A] via-[#1F3A1F] to-[#0F1F12] text-white py-16 px-6 text-center">
                    <TopoLines />

                    <div className="relative flex flex-col items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-[#C4A35A] text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[#C4A35A]/30 px-4 py-1.5 rounded-full">
                            <BedDouble size={14} />
                            Alojamiento premium
                        </span>
                        <h2 className="font-heading italic text-4xl md:text-5xl font-medium">
                            Nuestras Habitaciones
                        </h2>
                        <p className="text-[#E8D9B5] text-lg max-w-md">
                            Encontrá la habitación perfecta para tu estadía
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8 -mt-10">
                    <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-7 rounded-2xl shadow-xl shadow-black/5 border border-[#C4A35A]/20 flex flex-col gap-4">
                        <h3 className="text-[#1F3A1F] font-heading italic text-lg flex items-center gap-2">
                            <span className="bg-[#1F3A1F]/10 p-1.5 rounded-lg">
                                <Calendar size={16} className="text-[#1F3A1F]" />
                            </span>
                            Buscá por fechas
                        </h3>
                        <div className="flex gap-4 items-end flex-wrap">
                            <div className="flex flex-col gap-1.5 flex-1 min-w-[160px] input-underline">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Check-in
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#1F3A1F]/40 focus:border-[#1F3A1F] bg-[#FAF8F4]"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1 min-w-[160px] input-underline">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Check-out
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#1F3A1F]/40 focus:border-[#1F3A1F] bg-[#FAF8F4]"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="btn-shine bg-[#1F3A1F] hover:bg-[#2D4A2D] active:scale-[0.97] text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md shadow-[#1F3A1F]/20"
                            >
                                <Search size={16} />
                                Buscar
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-lg w-fit">
                                {error}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-500 text-sm flex items-center gap-1.5">
                                <SlidersHorizontal size={14} className="text-[#C4A35A]" />
                                {rooms.length} habitación(es) disponible(s)
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-48 rounded-2xl border border-[#C4A35A]/10 skeleton-shimmer"
                                    />
                                ))}
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white/50 rounded-2xl border border-dashed border-[#C4A35A]/30 animate-fade-in">
                                <BedDouble size={32} className="text-[#C4A35A]" />
                                <p className="text-gray-500 text-sm">
                                    No hay habitaciones disponibles para esas fechas.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="transition-transform duration-200 hover:-translate-y-1"
                                    >
                                        <RoomCard
                                            number={room.number}
                                            type={room.type}
                                            price={room.price}
                                            description={room.description}
                                            status={room.status}
                                            onReserve={() => handleReserve(room.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push('/reservations')}
                        className="group relative flex items-center justify-between gap-4 bg-white hover:bg-[#1F3A1F] border border-[#C4A35A]/30 hover:border-[#1F3A1F] rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#1F3A1F]/20"
                    >
                        <div className="flex items-center gap-4">
                            <span className="bg-[#1F3A1F]/10 group-hover:bg-white/10 p-3 rounded-xl transition-colors">
                                <CalendarCheck
                                    size={22}
                                    className="text-[#1F3A1F] group-hover:text-[#C4A35A] transition-colors"
                                />
                            </span>
                            <div className="text-left">
                                <p className="font-heading italic text-[#1F3A1F] group-hover:text-white transition-colors">
                                    Ver mis reservas
                                </p>
                                <p className="text-sm text-gray-500 group-hover:text-[#E8D9B5] transition-colors">
                                    Revisá el estado de tus reservas activas
                                </p>
                            </div>
                        </div>
                        <ArrowRight
                            size={20}
                            className="text-[#C4A35A] group-hover:text-white group-hover:translate-x-1 transition-all"
                        />
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}