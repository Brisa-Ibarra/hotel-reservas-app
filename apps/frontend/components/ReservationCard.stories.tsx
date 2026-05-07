import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReservationCard } from './ReservationCard';

const meta: Meta<typeof ReservationCard> = {
    title: 'Components/ReservationCard',
    component: ReservationCard,
};

export default meta;
type Story = StoryObj<typeof ReservationCard>;

export const Pending: Story = {
    args: {
        id: 'abc123',
        roomId: '101',
        startDate: '2027-06-01',
        endDate: '2027-06-05',
        status: 'pending',
        totalPrice: 400,
    },
};

export const Confirmed: Story = {
    args: {
        id: 'abc123',
        roomId: '101',
        startDate: '2027-06-01',
        endDate: '2027-06-05',
        status: 'confirmed',
        totalPrice: 400,
    },
};

export const Cancelled: Story = {
    args: {
        id: 'abc123',
        roomId: '101',
        startDate: '2027-06-01',
        endDate: '2027-06-05',
        status: 'cancelled',
        totalPrice: 400,
    },
};