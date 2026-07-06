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
    const isAvailable = status === 'available';

    return (
        <div className="group border border-[#C4A35A]/20 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:shadow-[#2D4A2D]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#2D4A2D] to-[#3D5A3D] px-5 py-4 flex justify-between items-center overflow-hidden">
                {/* Detalle decorativo sutil */}
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/5 blur-xl" />

                <h3 className="relative text-white font-bold">Habitación {number}</h3>
                <span
                    className={`relative text-xs px-3 py-1 rounded-full font-semibold ${
                        isAvailable ? 'bg-[#C4A35A] text-[#2D4A2D]' : 'bg-red-500/90 text-white'
                    }`}
                >
                    {isAvailable ? (
                        'Disponible'
                    ) : (
                        <span className="flex items-center gap-1">
                            <Wrench size={12} /> Mantenimiento
                        </span>
                    )}
                </span>
            </div>

            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2 text-[#8B6914]">
                    <span className="bg-[#8B6914]/10 p-1.5 rounded-lg">{typeIcons[type]}</span>
                    <span className="text-sm font-medium">{typeLabels[type]}</span>
                </div>

                <p className="text-sm text-gray-600 flex-1">{description}</p>

                <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-[#2D4A2D]">
                        ${price}
                        <span className="text-sm font-normal text-gray-400"> / noche</span>
                    </p>
                </div>

                {isAvailable && (
                    <button
                        onClick={onReserve}
                        className="mt-1 bg-[#2D4A2D] hover:bg-[#3D5A3D] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-medium transition-all w-full tracking-wide shadow-sm shadow-[#2D4A2D]/20 group-hover:shadow-md"
                    >
                        Reservar ahora
                    </button>
                )}
            </div>
        </div>
    );
}