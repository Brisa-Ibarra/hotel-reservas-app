'use client';

import { Bed, Pencil, Trash2 } from 'lucide-react';

interface AdminRoomCardProps {
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'occupied' | 'under_maintenance';
    onEdit: () => void;
    onDelete: () => void;
}

const statusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    occupied: 'bg-blue-100 text-blue-700',
    under_maintenance: 'bg-yellow-100 text-yellow-700',
};

const statusLabels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    under_maintenance: 'En mantenimiento',
};

const typeLabels: Record<string, string> = {
    single: 'Individual',
    double: 'Doble',
    suite: 'Suite',
};

export function AdminRoomCard({ number, type, price, description, status, onEdit, onDelete }: AdminRoomCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-[#C4A35A]/20 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-[#2D4A2D]/10 p-2 rounded-full">
                        <Bed size={18} className="text-[#2D4A2D]" />
                    </span>
                    <div>
                        <h4 className="font-bold text-[#2D4A2D] text-lg">Habitación {number}</h4>
                        <p className="text-xs text-gray-500">{typeLabels[type]}</p>
                    </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusStyles[status]}`}>
                    {statusLabels[status]}
                </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#C4A35A]/20">
                <span className="font-bold text-[#2D4A2D]">
                    ${price.toLocaleString('es-AR')} <span className="text-xs font-normal text-gray-500">/ noche</span>
                </span>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="p-2 rounded-lg hover:bg-[#2D4A2D]/10 text-[#2D4A2D] transition-colors" aria-label="Editar habitación">
                        <Pencil size={16} />
                    </button>
                    <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" aria-label="Eliminar habitación">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}