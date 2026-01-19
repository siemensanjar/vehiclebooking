
export enum VehicleType {
  TRUCK = 'Truck',
  VAN = 'Van',
  CAR = 'Car',
  MOTORCYCLE = 'Motorcycle',
  BOLERO = 'Bolero'
}

export enum VehicleStatus {
  AVAILABLE = 'Available',
  IN_TRANSIT = 'In Transit',
  MAINTENANCE = 'Maintenance'
}

export enum UserRole {
  ADMIN = 'Admin',
  DISPATCHER = 'Dispatcher',
  USER = 'User'
}

export enum BookingStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  mustChangePassword?: boolean;
}

/**
 * Added missing Booking interface to resolve export errors in constants.tsx, VehicleCard.tsx, App.tsx, and ReportsDashboard.tsx.
 */
export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  destination: string;
  purpose: string;
  status: BookingStatus;
}

// Added optional specs and guideText to Vehicle interface to resolve property access errors in VehicleGuideModal.tsx
export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  licensePlate: string;
  status: VehicleStatus;
  origin: string;
  specs?: {
    fuelType: string;
    capacity: string;
    maxRange: string;
    lastService: string;
    engineHealth: string;
  };
  guideText?: string;
}

// Added Notification interface to resolve export error in LoginPage.tsx
export interface Notification {
  id: string;
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
}

// Added SupportConfig interface to resolve export error in SupportPortal.tsx
export interface SupportConfig {
  phone: string;
  email: string;
  faqs: { q: string; a: string }[];
}
