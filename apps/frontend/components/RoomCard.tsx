import { Bed, Wrench, Star } from 'lucide-react';

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

const typeIcons = {
    single: <Bed size={16} />,
    double: <Bed size={16} />,
    suite: <Star size={16} />,
};

export function RoomCard({ number, type, price, description, status, onReserve }: RoomCardProps) {
    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Hab. {number}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status === 'available' ? '✓ Disponible' : <><Wrench size={12} /> Mantenimiento</>}
                </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
                {typeIcons[type]}
                <span className="text-sm font-medium">{typeLabels[type]}</span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xl font-bold text-blue-600">${price}<span className="text-sm font-normal text-gray-400"> / noche</span></p>
            {status === 'available' && (
                <button
                    onClick={onReserve}
                    className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors w-full"
                >
                    Reservar ahora
                </button>
            )}
        </div>
    );
}