'use client';

import { LogOut, User, Crown, BedDouble, ClipboardList } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    userRole?: 'admin' | 'guest';
    onLogout?: () => void;
}

export function Navbar({ userRole, onLogout }: NavbarProps) {
    const pathname = usePathname();

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
                {userRole === 'admin' && (
                    <div className="flex items-center gap-1 bg-black/10 rounded-lg p-1">
                        <Link
                            href="/admin"
                            className={`text-sm px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                                pathname === '/admin'
                                    ? 'bg-[#C4A35A] text-[#2D4A2D]'
                                    : 'text-[#E8D9B5] hover:bg-white/10'
                            }`}
                        >
                            <ClipboardList size={14} />
                            Reservas
                        </Link>
                        <Link
                            href="/admin/rooms"
                            className={`text-sm px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                                pathname === '/admin/rooms'
                                    ? 'bg-[#C4A35A] text-[#2D4A2D]'
                                    : 'text-[#E8D9B5] hover:bg-white/10'
                            }`}
                        >
                            <BedDouble size={14} />
                            Habitaciones
                        </Link>
                    </div>
                )}

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