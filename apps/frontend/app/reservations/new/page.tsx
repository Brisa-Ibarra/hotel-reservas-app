'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { api } from '../../../services/api';
import { Suspense } from 'react';
import { Calendar, Hotel, CheckCircle, ArrowLeft, Moon } from 'lucide-react';

interface Room {
    id: string;
    number: string;
    type: string;
    price: number;
    description: string;
    status: string;
}

function NewReservationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(searchParams.get('startDate') ?? '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') ?? '');
    const [roomNumber, setRoomNumber] = useState('');
    const [room, setRoom] = useState<Room | null>(null);

    const roomId = searchParams.get('roomId') ?? '';

    const nights =
        startDate && endDate
            ? Math.ceil(
                  (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
              )
            : 0;

    const total = room ? nights * room.price : 0;

    useEffect(() => {
        const role = localStorage.getItem('role') as 'admin' | 'guest';
        if (role) setUserRole(role);

        api.get('/rooms/available?startDate=2027-01-01&endDate=2027-12-31').then((rooms) => {
            const foundRoom = rooms.find((r: Room) => r.id === roomId);
            if (foundRoom) {
                setRoom(foundRoom);
                setRoomNumber(foundRoom.number);
            }
        });
    }, [roomId]);

    const handleReserve = async () => {
        if (!startDate || !endDate) {
            setError('Seleccioná las fechas de check-in y check-out');
            return;
        }
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
            return;
        }
        setError('');
        setLoading(true);
        const result = await api.post('/reservations', {
            userId,
            roomId,
            startDate,
            endDate,
        });
        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/reservations'), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <Navbar userRole={userRole} onLogout={handleLogout} />

            <div className="max-w-2xl mx-auto p-6 mt-10 flex flex-col gap-6 animate-fade-in-up">
                <div>
                    <h2 className="text-3xl font-bold text-[#2D4A2D]">Confirmar reserva</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Revisá los detalles antes de confirmar
                    </p>
                </div>

                {/* Info de la habitación */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#C4A35A]/20 overflow-hidden">
                    <div className="relative bg-gradient-to-r from-[#2D4A2D] to-[#3D5A3D] px-6 py-4 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                        <h3 className="relative text-white font-bold text-lg flex items-center gap-2">
                            <Hotel size={20} />
                            Habitación {roomNumber}
                        </h3>
                    </div>
                    <div className="p-6 flex flex-col gap-2">
                        <p className="text-gray-600">{room?.description}</p>
                        <p className="text-[#2D4A2D] font-bold text-xl">
                            ${room?.price}{' '}
                            <span className="text-sm font-normal text-gray-400">/ noche</span>
                        </p>
                    </div>
                </div>

                {/* Selector de fechas */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#C4A35A]/20 p-6 flex flex-col gap-4">
                    <h3 className="text-[#2D4A2D] font-bold text-lg flex items-center gap-2">
                        <span className="bg-[#2D4A2D]/10 p-1.5 rounded-lg">
                            <Calendar size={18} className="text-[#2D4A2D]" />
                        </span>
                        Seleccioná tus fechas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Check-in
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2D4A2D]/40 focus:border-[#2D4A2D] bg-[#FAF8F4]"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Check-out
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2D4A2D]/40 focus:border-[#2D4A2D] bg-[#FAF8F4]"
                            />
                        </div>
                    </div>
                    {nights > 0 && (
                        <div className="bg-[#F5F0E8] rounded-xl p-4 flex justify-between items-center animate-fade-in-up">
                            <p className="text-gray-600 flex items-center gap-2">
                                <Moon size={16} className="text-[#C4A35A]" />
                                {nights} {nights === 1 ? 'noche' : 'noches'}
                            </p>
                            <p className="text-2xl font-bold text-[#2D4A2D]">Total: ${total}</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in-up">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-scale">
                        <CheckCircle size={18} />
                        Reserva creada correctamente. Redirigiendo...
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleReserve}
                        disabled={loading || success}
                        className="bg-[#2D4A2D] hover:bg-[#3D5A3D] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-white px-4 py-3 rounded-xl font-medium transition-all w-full text-lg shadow-md shadow-[#2D4A2D]/20"
                    >
                        {loading ? 'Confirmando...' : 'Confirmar reserva'}
                    </button>
                    <button
                        onClick={() => router.push('/rooms')}
                        className="group bg-[#F5F0E8] hover:bg-[#E8E0D0] text-[#2D4A2D] border border-[#C4A35A] px-4 py-3 rounded-xl font-medium transition-all w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function NewReservationPage() {
    return (
        <Suspense>
            <NewReservationContent />
        </Suspense>
    );
}