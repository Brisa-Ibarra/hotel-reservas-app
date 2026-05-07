interface NavbarProps {
    userRole?: 'admin' | 'guest';
    onLogout?: () => void;
}

export function Navbar({ userRole, onLogout }: NavbarProps) {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Hotel Reservas</h1>
            <div className="flex items-center gap-4">
                {userRole && (
                    <span className="text-sm bg-blue-700 px-2 py-1 rounded-full">
                        {userRole === 'admin' ? 'Administrador' : 'Huésped'}
                    </span>
                )}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-sm bg-white text-blue-600 px-3 py-1 rounded-md font-medium hover:bg-blue-50 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                )}
            </div>
        </nav>
    );
}
