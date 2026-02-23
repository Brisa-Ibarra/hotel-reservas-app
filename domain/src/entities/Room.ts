export type RoomType = 'single' | 'double' | 'suite';
export type RoomStatus = 'available' | 'occupied' | 'under_maintenance';

export interface RoomProps {
    id: string;
    number: string;
    type: RoomType;
    price: number;
    description: string;
    status: RoomStatus;
}

export class Room {
    readonly id: string;
    readonly number: string;
    readonly type: RoomType;
    readonly price: number;
    readonly description: string;
    readonly status: RoomStatus;    
    
    constructor (props: RoomProps) {
        this.id = props.id;
        this.number = props.number;
        this.type = props.type;
        this.price = props.price;
        this.description = props.description;
        this.status = props.status;
    }

    isAvailable(): boolean {
        return this.status === 'available';
    }

    isOccupied(): boolean {
        return this.status === 'occupied';
    }   
    
    isUnderMaintenance(): boolean {
        return this.status === 'under_maintenance';
    }
}       