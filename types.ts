
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

// UserRole enum for access control and navigation logic
export enum UserRole {
  ADMIN = 'Admin',
  DISPATCHER = 'Dispatcher',
  USER = 'User'
}

// BookingStatus enum for mission lifecycle management
export enum BookingStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

// User interface for identity and session management
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

// Notification interface for the system mailbox feature
export interface Notification {
  id: string;
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
}

// FAQ interface for help center content
export interface FAQ {
  q: string;
  a: string;
}

// SupportConfig interface for portal settings and contact info
export interface SupportConfig {
  phone: string;
  email: string;
  faqs: FAQ[];
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  licensePlate: string;
  status: VehicleStatus;
  origin: string;
}

// Updated Booking interface with status and optional userId for reporting
export interface Booking {
  id: string;
  vehicleId: string;
  userId?: string;
  userName: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  destination: string;
  purpose: string;
  status: BookingStatus;
}
