export type RoleId = 'admin' | 'gerente' | 'taller' | 'operador' | 'obras' | 'whatsapp';

export interface RoleInfo {
  id: RoleId;
  name: string;
  iconName: string;
  badge?: string;
  userContext?: string;
}

export type EquipmentStatus = 'Disponible' | 'En Renta' | 'En Mantenimiento' | 'Fuera de Servicio' | 'En Tránsito';

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  year: number;
  status: EquipmentStatus;
  horometer: number;
  nextServiceHorometer: number;
  fuelLevel: number; // percentage
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  hourlyRate: number;
  insurancePolicy: string;
  registrationCard: string;
  isLockedForRental: boolean;
  internalProjectId?: string;
  currentLocation: string;
  image: string;
  revenue: number;
  maintenanceCost: number;
  fuelCost: number;
}

export interface Contract {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  equipmentId: string;
  periodType: 'hora' | 'día' | 'semana' | 'mes';
  duration: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  guaranteeDeposit: number;
  depositStatus: 'cobrado' | 'devuelto' | 'retenido';
  paymentStatus: 'al_dia' | 'vencido' | 'pendiente';
  status: 'cotizacion' | 'activo' | 'vencido' | 'finalizado';
  operatorIncluded: boolean;
  assignedDriver?: string;
  deliveryAddress: string;
}

export interface WorkOrder {
  id: string;
  code: string;
  equipmentId: string;
  type: 'Preventivo' | 'Correctivo';
  description: string;
  technician: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  laborHours: number;
  totalCost: number;
  partsUsed: Array<{ name: string; qty: number; cost: number }>;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  unit: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Activo' | 'Inactivo';
}

export interface FieldInspection {
  id: string;
  equipmentId: string;
  type: 'Check-in (Entrega)' | 'Check-out (Recepción)';
  clientName: string;
  horometer: number;
  fuelLevel: number;
  damageNotes: string;
  photosCount: number;
  clientSignature?: string;
  timestamp: string;
  operatorName: string;
}

export interface FieldIncident {
  id: string;
  equipmentId: string;
  description: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  gpsLocation: string;
  photoUploaded: boolean;
  timestamp: string;
  status: 'Reportado' | 'En Revisión' | 'Resuelto';
  operatorName: string;
}

export interface InternalProject {
  id: string;
  code: string;
  name: string;
  location: string;
  manager: string;
  assignedEquipmentIds: string[];
  budget: number;
  startDate: string;
}
