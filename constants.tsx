import { Vehicle, VehicleType, VehicleStatus, Booking, BookingStatus } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    name: 'Freightliner M2',
    type: VehicleType.TRUCK,
    licensePlate: 'TX-4402',
    status: VehicleStatus.AVAILABLE,
    origin: 'Central Hub'
  },
  {
    id: 'v2',
    name: 'Sprinter Van 3500',
    type: VehicleType.VAN,
    licensePlate: 'CA-8891',
    status: VehicleStatus.AVAILABLE,
    origin: 'East Depot'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];