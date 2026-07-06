import { LogOut, User, Crown } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
    userRole?: 'admin' | 'guest';
    onLogout?: () => void;
}

export function Navbar({ userRole, onLogout }: NavbarProps) {
    return (
        <nav className="bg-[#2D4A2D] text-white px-6 py-3 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
                <Image 
                    src="/logo.png"
                    alt="Gran Hotel Uspallata"
                    width={50}
                    height={44}
                />
                <div>
                    <h1 className="text-xl font-bold tracking-wide">Gran Hotel Uspallata</h1>
                    <p className="text-xs text-[#C4A35A] tracking-widest uppercase">Un auténtico hotel de montaña</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {userRole && (
                    <span className="text-sm bg-[#C4A35A] text-[#2D4A2D] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        {userRole === 'admin' ? <Crown size={14} /> : <User size={14} />}
                        {userRole === 'admin' ? 'Administrador' : 'Huésped'}
                    </span>
                )}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-sm border border-[#C4A35A] text-[#C4A35A] px-4 py-2 rounded-lg font-medium hover:bg-[#C4A35A] hover:text-[#2D4A2D] transition-colors flex items-center gap-2"
                    >
                        <LogOut size={14} />
                        Cerrar sesión
                    </button>
                )}
            </div>
        </nav>
    );
}
