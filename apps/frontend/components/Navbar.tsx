import { Hotel, LogOut, User, Crown } from 'lucide-react';

interface NavbarProps {
    userRole?: 'admin' | 'guest';
    onLogout?: () => void;
}

export function Navbar({ userRole, onLogout }: NavbarProps) {
    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <Hotel className="text-blue-600" size={24} />
                <h1 className="text-xl font-bold text-gray-800">Hotel Reservas</h1>
            </div>
            <div className="flex items-center gap-4">
                {userRole && (
                    <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        {userRole === 'admin' ? <Crown size={14} /> : <User size={14} />}
                        {userRole === 'admin' ? 'Administrador' : 'Huésped'}
                    </span>
                )}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <LogOut size={14} />
                        Cerrar sesión
                    </button>
                )}
            </div>
        </nav>
    );
}