'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '../components/Input';
import { api } from '../services/api';
import { Mountain, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const toggleMode = () => {
        setError('');
        setIsRegister((prev) => !prev);
    };

    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo */}
            <div className="hidden md:flex relative w-1/2 items-center justify-center flex-col gap-4 p-12 overflow-hidden bg-gradient-to-br from-[#2D4A2D] via-[#2D4A2D] to-[#1F361F]">
                {/* Blobs decorativos */}
                <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#C4A35A]/10 blur-3xl animate-float" />
                <div
                    className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-[#C4A35A]/10 blur-3xl animate-float"
                    style={{ animationDelay: '1.5s' }}
                />

                <div className="relative flex flex-col items-center gap-4 animate-fade-in-up">
                    <span className="inline-flex items-center gap-2 text-[#C4A35A] text-xs font-semibold tracking-widest uppercase bg-white/5 border border-[#C4A35A]/30 px-4 py-1.5 rounded-full">
                        <Sparkles size={14} />
                        Bienvenido
                    </span>

                    <Image
                        src="/logo.png"
                        alt="Gran Hotel Uspallata"
                        width={180}
                        height={157}
                        className="drop-shadow-lg"
                    />

                    <h1 className="text-4xl font-bold text-white text-center">
                        Gran Hotel Uspallata
                    </h1>
                    <p className="text-[#C4A35A] text-center text-lg tracking-widest uppercase">
                        Un auténtico hotel de montaña
                    </p>
                    <p className="text-white/60 text-center mt-2 text-sm max-w-sm">
                        Rodeado de las majestuosas montañas de Mendoza, te esperamos para una
                        experiencia única.
                    </p>

                    <div className="flex items-center gap-2 text-white/40 text-xs mt-4">
                        <Mountain size={14} />
                        <span>Mendoza, Argentina</span>
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div className="w-full md:w-1/2 bg-[#F5F0E8] flex items-center justify-center p-8 relative overflow-hidden">
                <div className="md:hidden absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#2D4A2D]/5 blur-3xl" />

                <div className="relative bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-[#C4A35A]/10 w-full max-w-md flex flex-col gap-5 animate-fade-in-scale">
                    {/* Logo mobile */}
                    <div className="md:hidden flex justify-center mb-1">
                        <Image src="/logo.png" alt="Gran Hotel Uspallata" width={64} height={56} />
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#2D4A2D]">
                            {isRegister ? 'Crear cuenta' : 'Bienvenido'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isRegister
                                ? 'Registrate para hacer tu reserva'
                                : 'Iniciá sesión para continuar'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isRegister && (
                            <div className="animate-fade-in-up">
                                <Input
                                    label="Nombre"
                                    value={nombre}
                                    onChange={setNombre}
                                    placeholder="Tu nombre"
                                />
                            </div>
                        )}
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="tu@email.com"
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group bg-[#2D4A2D] hover:bg-[#3D5A3D] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-white px-4 py-3 rounded-xl font-medium w-full flex items-center justify-center gap-2 shadow-md shadow-[#2D4A2D]/20 transition-all"
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

                    <button
                        onClick={toggleMode}
                        className="text-sm text-[#8B6914] hover:text-[#2D4A2D] hover:underline text-center transition-colors"
                    >
                        {isRegister
                            ? '¿Ya tenés cuenta? Iniciá sesión'
                            : '¿No tenés cuenta? Registrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}