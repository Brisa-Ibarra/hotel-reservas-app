'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface RoomFormData {
    number: string;
    type: string;
    price: number;
    description: string;
    status: string;
}

interface RoomFormModalProps {
    initialData?: RoomFormData & { id?: string };
    onClose: () => void;
    onSubmit: (data: RoomFormData) => Promise<void>;
}

export function RoomFormModal({ initialData, onClose, onSubmit }: RoomFormModalProps) {
    const [form, setForm] = useState<RoomFormData>({
        number: initialData?.number ?? '',
        type: initialData?.type ?? 'single',
        price: initialData?.price ?? 0,
        description: initialData?.description ?? '',
        status: initialData?.status ?? 'available',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const isEditing = Boolean(initialData?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.number.trim()) {
            setError('El número de habitación es obligatorio');
            return;
        }
        if (form.price <= 0) {
            setError('El precio tiene que ser mayor a 0');
            return;
        }

        setSaving(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (err: any) {
            setError(err.message ?? 'Ocurrió un error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in-scale">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-[#2D4A2D] mb-4">
                    {isEditing ? 'Editar habitación' : 'Nueva habitación'}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Número</label>
                        <input
                            type="text"
                            value={form.number}
                            onChange={(e) => setForm({ ...form, number: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A2D]/30"
                            placeholder="101"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A2D]/30"
                        >
                            <option value="single">Individual</option>
                            <option value="double">Doble</option>
                            <option value="suite">Suite</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Precio por noche</label>
                        <input
                            type="number"
                            min={0}
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A2D]/30"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A2D]/30"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Estado</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A2D]/30"
                        >
                            <option value="available">Disponible</option>
                            <option value="under_maintenance">En mantenimiento</option>
                            <option value="occupied">Ocupada</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#2D4A2D] hover:bg-[#3D5A3D] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium transition-all w-full"
                    >
                        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear habitación'}
                    </button>
                </form>
            </div>
        </div>
    );
}