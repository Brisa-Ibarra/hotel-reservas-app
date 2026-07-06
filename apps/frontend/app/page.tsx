'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '../components/Input';
import { api } from '../services/api';
import { Mountain, ArrowRight, Loader2 } from 'lucide-react';

const TAGLINES = [
    'Rodeado de las majestuosas montañas de Mendoza',
    'A 130 km de la ciudad, en el corazón de los Andes',
    'Donde el silencio de la cordillera es el mejor lujo',
];

function TopoLines() {
    return (
        <svg className="topo-lines" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <path
                    key={i}
                    d={`M -50 ${120 + i * 90} Q 200 ${60 + i * 90} 400 ${140 + i * 90} T 850 ${100 + i * 90}`}
                    fill="none"
                    stroke="#C4A35A"
                    strokeWidth="1.2"
                />
            ))}
        </svg>
    );
}

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [taglineIdx, setTaglineIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setTaglineIdx((prev) => (prev + 1) % TAGLINES.length);
        }, 4500);
        return () => clearInterval(id);
    }, []);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await api.post('/users/register', { nombre, email, password });
                setIsRegister(false);
            } else {
                const result = await api.post('/users/login', { email, password });
                if (result.error) {
                    setError(result.error);
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('email', email);
                window.location.href = result.role === 'admin' ? '/admin' : '/rooms';
                return;
            }
        } catch (e) {
            setError('Ocurrió un error, intentá de nuevo');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo */}
            <div className="hidden md:flex relative w-1/2 items-center justify-center flex-col gap-6 p-12 overflow-hidden bg-gradient-to-b from-[#16281A] via-[#1F3A1F] to-[#0F1F12]">
                <TopoLines />

                <div className="relative flex flex-col items-center gap-5 animate-fade-in-up text-center">
                    <Image
                        src="/logo.png"
                        alt="Gran Hotel Uspallata"
                        width={140}
                        height={122}
                        className="drop-shadow-lg"
                    />

                    <div className="w-10 h-px bg-[#C4A35A]/60" />

                    <h1 className="font-heading text-5xl font-medium italic text-white leading-tight">
                        Gran Hotel<br />Uspallata
                    </h1>

                    <p className="text-[#C4A35A] text-xs tracking-[0.25em] uppercase">
                        Un auténtico hotel de montaña
                    </p>

                    <p
                        key={taglineIdx}
                        className="text-white/50 text-sm max-w-xs mt-3 animate-fade-in-up italic font-heading"
                    >
                        {TAGLINES[taglineIdx]}
                    </p>

                    <div className="flex items-center gap-2 text-white/35 text-xs mt-6">
                        <Mountain size={13} />
                        <span className="tracking-wide">Mendoza, Argentina</span>
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div className="w-full md:w-1/2 bg-[#F5F0E8] paper-grain flex items-center justify-center p-8 relative">
                <div className="relative bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-[#C4A35A]/15 w-full max-w-md flex flex-col gap-5 animate-fade-in-scale">
                    <div className="md:hidden flex justify-center mb-1">
                        <Image src="/logo.png" alt="Gran Hotel Uspallata" width={64} height={56} />
                    </div>

                    {/* Toggle tipo tab */}
                    <div className="flex bg-[#F5F0E8] rounded-xl p-1 gap-1">
                        <button
                            onClick={() => { setError(''); setIsRegister(false); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                !isRegister ? 'bg-white text-[#1F3A1F] shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => { setError(''); setIsRegister(true); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                isRegister ? 'bg-white text-[#1F3A1F] shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            Crear cuenta
                        </button>
                    </div>

                    <div className="text-left">
                        <h2 className="font-heading text-2xl italic text-[#1F3A1F]">
                            {isRegister ? 'Creá tu cuenta' : 'Bienvenido de nuevo'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isRegister
                                ? 'Registrate para hacer tu reserva'
                                : 'Iniciá sesión para continuar'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isRegister && (
                            <div className="animate-fade-in-up input-underline">
                                <Input
                                    label="Nombre"
                                    value={nombre}
                                    onChange={setNombre}
                                    placeholder="Tu nombre"
                                />
                            </div>
                        )}
                        <div className="input-underline">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div className="input-underline">
                            <Input
                                label="Contraseña"
                                type="password"
                                value={password}
                                onChange={setPassword}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-shine group bg-[#1F3A1F] hover:bg-[#2D4A2D] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-white px-4 py-3 rounded-xl font-medium w-full flex items-center justify-center gap-2 shadow-md shadow-[#1F3A1F]/20 transition-all"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}