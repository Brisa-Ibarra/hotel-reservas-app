'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../../components/Navbar';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { AdminRoomCard } from '../../../components/AdminRoomCard';
import { RoomFormModal } from '../../../components/RoomFormModal';
import { api } from '../../../services/api';
import { BedDouble, CalendarSearch, Plus, Inbox } from 'lucide-react';

interface Room {
    id: string;
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'occupied' | 'under_maintenance';
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [availableIds, setAvailableIds] = useState<string[] | null>(null);
    const [checking, setChecking] = useState(false);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        const result = await api.get('/rooms');
        if (!result.error) setRooms(result);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleCreate = async (data: { number: string; type: string; price: number; description: string; status: string }) => {
        const result = await api.post('/rooms', data);
        if (result.error) throw new Error(result.error);
        fetchRooms();
    };

    const handleUpdate = async (id: string, data: { number: string; type: string; price: number; description: string; status: string }) => {
        const result = await api.put(`/rooms/${id}`, data);
        if (result.error) throw new Error(result.error);
        fetchRooms();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que querés eliminar esta habitación?')) return;
        await api.delete(`/rooms/${id}`);
        fetchRooms();
    };

    const handleCheckAvailability = async () => {
        if (!startDate || !endDate) return;
        setChecking(true);
        const result = await api.get(`/rooms/available?startDate=${startDate}&endDate=${endDate}`);
        if (!result.error) {
            setAvailableIds(result.map((r: Room) => r.id));
        }
        setChecking(false);
    };

    const clearAvailabilityFilter = () => {
        setAvailableIds(null);
        setStartDate('');
        setEndDate('');
    };

    const visibleRooms = availableIds === null
        ? rooms
        : rooms.filter((r) => availableIds.includes(r.id));

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-[var(--color-bg)]">
                <Navbar userRole="admin" onLogout={() => {}} />

                <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-light)] via-[var(--color-primary-light)] to-[var(--color-primary)] text-white py-14 px-6 text-center">
                    <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
                    <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-2 animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[var(--color-accent)]/30 px-4 py-1.5 rounded-full">
                            <BedDouble size={14} />
                            Habitaciones
                        </span>
                        <h2 className="text-4xl font-bold">Gestión de habitaciones</h2>
                        <p className="text-[var(--color-accent-light)] text-lg">
                            {rooms.length} habitación(es) registradas
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6 -mt-10">

                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[var(--color-accent)]/20 p-6 flex flex-col gap-4 animate-fade-in-up">
                        <h3 className="text-[var(--color-primary-light)] font-bold text-lg flex items-center gap-2">
                            <CalendarSearch size={18} className="text-[var(--color-accent)]" />
                            Verificar disponibilidad
                        </h3>
                        <div className="flex flex-col md:flex-row gap-3 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-sm text-gray-600">Desde</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]/30"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-sm text-gray-600">Hasta</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]/30"
                                />
                            </div>
                            <button
                                onClick={handleCheckAvailability}
                                disabled={checking || !startDate || !endDate}
                                className="bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all"
                            >
                                {checking ? 'Buscando...' : 'Verificar'}
                            </button>
                            {availableIds !== null && (
                                <button
                                    onClick={clearAvailabilityFilter}
                                    className="text-sm text-gray-500 underline whitespace-nowrap"
                                >
                                    Ver todas
                                </button>
                            )}
                        </div>
                        {availableIds !== null && (
                            <p className="text-sm text-[var(--color-primary-light)]">
                                Mostrando {availableIds.length} habitación(es) disponibles para ese rango.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => { setEditingRoom(null); setModalOpen(true); }}
                        className="btn-shine self-start flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] hover:text-white text-[var(--color-primary-light)] font-medium px-4 py-2.5 rounded-xl transition-all"
                    >
                        <Plus size={18} />
                        Nueva habitación
                    </button>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-44 rounded-2xl border border-[var(--color-accent)]/10 skeleton-shimmer" />
                            ))}
                        </div>
                    ) : visibleRooms.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border border-dashed border-[var(--color-accent)]/30 shadow-sm animate-fade-in-scale flex flex-col items-center gap-4">
                            <span className="bg-[var(--color-primary-light)]/10 p-4 rounded-full">
                                <Inbox size={32} className="text-[var(--color-primary-light)]" />
                            </span>
                            <p className="text-gray-500 text-lg">No hay habitaciones para mostrar</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                            {visibleRooms.map((room) => (
                                <AdminRoomCard
                                    key={room.id}
                                    number={room.number}
                                    type={room.type}
                                    price={room.price}
                                    description={room.description}
                                    status={room.status}
                                    onEdit={() => { setEditingRoom(room); setModalOpen(true); }}
                                    onDelete={() => handleDelete(room.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {modalOpen && (
                    <RoomFormModal
                        initialData={editingRoom ?? undefined}
                        onClose={() => setModalOpen(false)}
                        onSubmit={(data) =>
                            editingRoom ? handleUpdate(editingRoom.id, data) : handleCreate(data)
                        }
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}