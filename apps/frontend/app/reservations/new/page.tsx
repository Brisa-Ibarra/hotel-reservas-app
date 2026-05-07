'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import { Suspense } from 'react';

function NewReservationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userRole, setUserRole] = useState<'admin' | 'guest'>('guest');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const roomId = searchParams.get('roomId') ?? '';
    const startDate = searchParams.get('startDate') ?? '';
    const endDate = searchParams.get('endDate') ?? '';

    useEffect(() => {
        const role = localStorage.getItem('role') as 'admin' | 'guest';
        if (role) setUserRole(role);
    }, []);

    const handleReserve = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
            return;
        }
        const result = await api.post('/reservations', {
            userId,
            roomId,
            startDate,
            endDate,
        });
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/reservations'), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userRole={userRole} onLogout={handleLogout} />
            <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Confirmar reserva</h2>
                <p className="text-gray-600">Habitación: {roomId}</p>
                <p className="text-gray-600">Check-in: {startDate}</p>
                <p className="text-gray-600">Check-out: {endDate}</p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">Reserva creada correctamente!</p>}
                <Button label="Confirmar reserva" onClick={handleReserve} />
                <Button label="Volver" variant="secondary" onClick={() => router.push('/rooms')} />
            </div>
        </div>
    );
}

export default function NewReservationPage() {
    return (
        <Suspense>
            <NewReservationContent />
        </Suspense>
    );
}