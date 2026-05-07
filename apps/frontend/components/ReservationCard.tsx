import { Calendar, Hotel, Clock, CheckCircle, XCircle, Flag } from 'lucide-react';

interface ReservationCardProps {
    id: string;
    roomId: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
    onCancel?: () => void;
}

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
};

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
    pending: <Clock size={12} />,
    confirmed: <CheckCircle size={12} />,
    cancelled: <XCircle size={12} />,
    completed: <Flag size={12} />,
};

export function ReservationCard({ id, roomId, startDate, endDate, status, totalPrice, onCancel }: ReservationCardProps) {
    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800">Reserva #{id.slice(0, 8)}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyles[status]}`}>
                    {statusIcons[status]} {statusLabels[status]}
                </span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Hotel size={14} /> Habitación: {roomId.slice(0, 8)}...</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> Check-in: {startDate}</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> Check-out: {endDate}</p>
            </div>
            <p className="text-xl font-bold text-blue-600">Total: ${totalPrice}</p>
            {(status === 'pending' || status === 'confirmed') && (
                <button
                    onClick={onCancel}
                    className="mt-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg font-medium transition-colors w-full"
                >
                    Cancelar reserva
                </button>
            )}
        </div>
    );
}
