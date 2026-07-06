import { Bed, Star, Wrench } from 'lucide-react';

interface RoomCardProps {
    number: string;
    type: 'single' | 'double' | 'suite';
    price: number;
    description: string;
    status: 'available' | 'under_maintenance';
    onReserve?: () => void;
}

const typeLabels = {
    single: 'Habitación Individual',
    double: 'Habitación Doble',
    suite: 'Suite Premium',
};

const typeIcons = {
    single: <Bed size={18} />,
    double: <Bed size={18} />,
    suite: <Star size={18} />,
};

export function RoomCard({ number, type, price, description, status, onReserve }: RoomCardProps) {
    return (
        <div className="border border-[#C4A35A]/30 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            <div className="bg-[#2D4A2D] px-5 py-3 flex justify-between items-center">
                <h3 className="text-white font-bold">Habitación {number}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${status === 'available' ? 'bg-[#C4A35A] text-[#2D4A2D]' : 'bg-red-100 text-red-700'}`}>
                    {status === 'available' ? 'Disponible' : <span className="flex items-center gap-1"><Wrench size={12} /> Mantenimiento</span>}
                </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#8B6914]">
                    {typeIcons[type]}
                    <span className="text-sm font-medium">{typeLabels[type]}</span>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-2xl font-bold text-[#2D4A2D]">${price}<span className="text-sm font-normal text-gray-400"> / noche</span></p>
                {status === 'available' && (
                    <button
                        onClick={onReserve}
                        className="mt-1 bg-[#2D4A2D] hover:bg-[#3D5A3D] text-white px-4 py-2.5 rounded-lg font-medium transition-colors w-full tracking-wide"
                    >
                        Reservar ahora
                    </button>
                )}
            </div>
        </div>
    );
}