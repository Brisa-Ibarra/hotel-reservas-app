interface RoomCardProps {
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'under_maintenance';
    onReserve?: () => void;
}

const typeLabels = {
    single: 'Individual',
    double: 'Doble',
    suite: 'Suite',
};

export function RoomCard({ number, type, price, description, status, onReserve }: RoomCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Habitación {number}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status === 'available' ? 'Disponible' : 'En mantenimiento'}
                </span>
            </div>
            <p className="text-sm text-gray-500">{typeLabels[type]}</p>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-lg font-semibold text-blue-600">${price} / noche</p>
            {status === 'available' && (
                <button
                    onClick={onReserve}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    Reservar
                </button>
            )}
        </div>
    );
}
