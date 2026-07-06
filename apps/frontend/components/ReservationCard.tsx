import { Calendar, Hotel, Clock, CheckCircle, XCircle, Flag } from 'lucide-react';

interface ReservationCardProps {
    id: string;
    roomNumber: string;
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
    confirmed: 'bg-[#C4A35A] text-[#2D4A2D]',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
    pending: <Clock size={12} />,
    confirmed: <CheckCircle size={12} />,
    cancelled: <XCircle size={12} />,
    completed: <Flag size={12} />,
};

const headerAccent = {
    pending: 'from-[#2D4A2D] to-[#3D5A3D]',
    confirmed: 'from-[#2D4A2D] to-[#3D5A3D]',
    cancelled: 'from-gray-500 to-gray-600',
    completed: 'from-gray-500 to-gray-600',
};

export function ReservationCard({
    id,
    roomNumber,
    startDate,
    endDate,
    status,
    totalPrice,
    onCancel,
}: ReservationCardProps) {
    const isCancelable = status === 'pending' || status === 'confirmed';

    return (
        <div className="group border border-[#C4A35A]/20 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:shadow-[#2D4A2D]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            <div
                className={`relative bg-gradient-to-r ${headerAccent[status]} px-5 py-3 flex justify-between items-center overflow-hidden`}
            >
                <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-white/5 blur-xl" />
                <h3 className="relative text-white font-bold text-sm">Reserva #{id}</h3>
                <span
                    className={`relative text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyles[status]}`}
                >
                    {statusIcons[status]} {statusLabels[status]}
                </span>
            </div>

            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                        <Hotel size={14} className="text-[#8B6914]" /> Habitación {roomNumber}
                    </p>
                    <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#8B6914]" /> Check-in: {startDate}
                    </p>
                    <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#8B6914]" /> Check-out: {endDate}
                    </p>
                </div>

                <p className="text-2xl font-bold text-[#2D4A2D] mt-auto">Total: ${totalPrice}</p>

                {isCancelable && (
                    <button
                        onClick={onCancel}
                        className="mt-1 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-medium transition-all w-full"
                    >
                        Cancelar reserva
                    </button>
                )}
            </div>
        </div>
    );
}