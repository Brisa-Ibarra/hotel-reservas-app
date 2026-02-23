export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ReservationProps {
    id: string;
    userId: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    status: ReservationStatus;
    totalPrice: number;
    createdAt: Date;
}

export class Reservation {
    readonly id: string;
    readonly userId: string;
    readonly roomId: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly status: ReservationStatus;
    readonly totalPrice: number;
    readonly createdAt: Date;

    constructor(props: ReservationProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.roomId = props.roomId;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.totalPrice = props.totalPrice;
        this.createdAt = props.createdAt;
    }

    isPending(): boolean {
        return this.status === 'pending';
    }

    isConfirmed(): boolean {
        return this.status === 'confirmed';
    }

    isCancelled(): boolean {
        return this.status === 'cancelled';
    }

    isCompleted(): boolean {
        return this.status === 'completed';
    }

    getNights(): number {
        const diff = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}