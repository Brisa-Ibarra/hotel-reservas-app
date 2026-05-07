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

export function ReservationCard({ id, roomId, startDate, endDate, status, totalPrice, onCancel }: ReservationCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Reserva #{id.slice(0, 8)}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${statusStyles[status]}`}>
                    {statusLabels[status]}
                </span>
            </div>
            <p className="text-sm text-gray-600">Habitación: {roomId}</p>
            <p className="text-sm text-gray-600">Check-in: {startDate}</p>
            <p className="text-sm text-gray-600">Check-out: {endDate}</p>
            <p className="text-lg font-semibold text-blue-600">Total: ${totalPrice}</p>
            {status === 'pending' || status === 'confirmed' ? (
                <button
                    onClick={onCancel}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    Cancelar reserva
                </button>
            ) : null}
        </div>
    );
}
