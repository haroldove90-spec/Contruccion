import React, { useState } from 'react';
import { RoleId, Equipment, Contract, WorkOrder, InventoryItem, FieldInspection, FieldIncident, InternalProject } from './types';
import {
  INITIAL_EQUIPMENT,
  INITIAL_CONTRACTS,
  INITIAL_WORK_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_INSPECTIONS,
  INITIAL_INCIDENTS,
  INITIAL_INTERNAL_PROJECTS
} from './data/mockData';

import { HomeRoleSelector } from './components/HomeRoleSelector';
import { AdminView } from './components/roles/AdminView';
import { GerenteView } from './components/roles/GerenteView';
import { TallerView } from './components/roles/TallerView';
import { OperadorView } from './components/roles/OperadorView';
import { ObrasPropiasView } from './components/roles/ObrasPropiasView';
import { WhatsAppView } from './components/roles/WhatsAppView';

import {
  ShieldCheck,
  UserCheck,
  Wrench,
  Smartphone,
  Building2,
  MessageSquareShare,
  LogOut,
  ChevronRight,
  Grid
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleId | null>(null);

  // Application Data States
  const [equipments, setEquipments] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [inspections, setInspections] = useState<FieldInspection[]>(INITIAL_INSPECTIONS);
  const [incidents, setIncidents] = useState<FieldIncident[]>(INITIAL_INCIDENTS);
  const [projects] = useState<InternalProject[]>(INITIAL_INTERNAL_PROJECTS);

  // Equipment Lock Toggle
  const handleToggleLockEquipment = (id: string) => {
    setEquipments(prev => prev.map(e => {
      if (e.id === id) {
        const nextLock = !e.isLockedForRental;
        return {
          ...e,
          isLockedForRental: nextLock,
          status: nextLock ? 'En Mantenimiento' : 'Disponible'
        };
      }
      return e;
    }));
  };

  // Field Inspections Handler
  const handleAddInspection = (inspData: Omit<FieldInspection, 'id' | 'timestamp'>) => {
    const newIns: FieldInspection = {
      ...inspData,
      id: `CHK-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setInspections(prev => [newIns, ...prev]);

    // Update equipment horometer & fuel
    setEquipments(prev => prev.map(e => {
      if (e.id === inspData.equipmentId) {
        return {
          ...e,
          horometer: inspData.horometer,
          fuelLevel: inspData.fuelLevel
        };
      }
      return e;
    }));
  };

  // Field Incident Handler
  const handleAddIncident = (incData: Omit<FieldIncident, 'id' | 'timestamp' | 'status'>) => {
    const newInc: FieldIncident = {
      ...incData,
      id: `INC-${Date.now().toString().slice(-3)}`,
      status: 'Reportado',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const roleList = [
    { id: 'admin' as RoleId, name: 'Administrador', icon: ShieldCheck },
    { id: 'gerente' as RoleId, name: 'Gerente Admin', icon: UserCheck },
    { id: 'taller' as RoleId, name: 'Taller & Mantenimiento', icon: Wrench },
    { id: 'operador' as RoleId, name: 'Operador Campo', icon: Smartphone },
    { id: 'obras' as RoleId, name: 'Obras Propias', icon: Building2 },
    { id: 'whatsapp' as RoleId, name: 'WhatsApp & PDF', icon: MessageSquareShare },
  ];

  // RULE STRICT COMPLIANCE:
  // Zero header, zero side navigation, zero bottom navigation bar when on Home (currentRole === null).
  if (currentRole === null) {
    return <HomeRoleSelector onSelectRole={(role) => setCurrentRole(role)} />;
  }

  const activeRoleObj = roleList.find(r => r.id === currentRole);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1A1C1E] flex flex-col font-sans">
      {/* 1. Header - Appears ONLY when inside a role */}
      <header className="h-16 bg-white border-b border-[#E1E4E8] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setCurrentRole(null)} 
            className="w-8 h-8 bg-[#1A1C1E] flex items-center justify-center shrink-0 cursor-pointer"
            title="Ir a Inicio"
          >
            <div className="w-4 h-4 border-2 border-white rotate-45" />
          </div>
          <span className="text-sm md:text-base font-bold tracking-tight uppercase">
            Construcción y renta de maquinaria
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase text-[#64748B]">ROL ACTIVO</span>
            <span className="font-bold text-[#1A1C1E]">{activeRoleObj?.name}</span>
          </div>

          <button
            onClick={() => setCurrentRole(null)}
            className="px-3 py-1.5 border border-[#1A1C1E] bg-[#1A1C1E] text-white hover:bg-black font-bold uppercase text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cambiar Rol</span>
          </button>
        </div>
      </header>

      {/* 2. Main Work Area with Left Sidebar & Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Bar (Desktop) - Visible inside role */}
        <aside className="hidden md:flex w-20 bg-[#1A1C1E] flex-col items-center py-6 gap-6 shrink-0 border-r border-[#E1E4E8]">
          <button
            onClick={() => setCurrentRole(null)}
            className="text-[#00FF41] opacity-90 hover:opacity-100 p-2 cursor-pointer"
            title="Inicio / Selección de Rol"
          >
            <Grid className="w-6 h-6" />
          </button>

          <div className="w-8 h-[1px] bg-[#33373B]" />

          {roleList.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`p-3 transition-all cursor-pointer rounded ${
                  isActive ? 'bg-white/10 text-[#00FF41]' : 'text-white/40 hover:text-white'
                }`}
                title={r.name}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </aside>

        {/* Main Full-Width Content Container - Zero Encapsulated Cards */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] pb-16 md:pb-0">
          {currentRole === 'admin' && (
            <AdminView equipments={equipments} contracts={contracts} />
          )}

          {currentRole === 'gerente' && (
            <GerenteView
              equipments={equipments}
              contracts={contracts}
              onUpdateEquipmentStatus={(id, status) => {
                setEquipments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
              }}
            />
          )}

          {currentRole === 'taller' && (
            <TallerView
              equipments={equipments}
              workOrders={workOrders}
              inventory={inventory}
              onToggleLockEquipment={handleToggleLockEquipment}
            />
          )}

          {currentRole === 'operador' && (
            <OperadorView
              equipments={equipments}
              inspections={inspections}
              incidents={incidents}
              onAddInspection={handleAddInspection}
              onAddIncident={handleAddIncident}
            />
          )}

          {currentRole === 'obras' && (
            <ObrasPropiasView projects={projects} equipments={equipments} />
          )}

          {currentRole === 'whatsapp' && (
            <WhatsAppView contracts={contracts} />
          )}
        </main>
      </div>

      {/* 3. Bottom Navigation Bar for Mobile & Tablet - Visible ONLY inside role */}
      <nav className="h-14 bg-[#1A1C1E] border-t border-[#E1E4E8] flex items-center justify-around shrink-0 md:hidden fixed bottom-0 left-0 right-0 z-50 text-white">
        {roleList.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                isActive ? 'text-[#00FF41]' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">
                {r.name.slice(0, 6)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
