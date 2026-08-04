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
  Truck,
  FileText,
  MapPin,
  DollarSign,
  Percent,
  Sliders,
  PackageCheck,
  CheckSquare,
  AlertOctagon,
  ArrowLeft
} from 'lucide-react';

interface ModuleDef {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
}

const ROLE_MODULES: Record<RoleId, ModuleDef[]> = {
  admin: [
    { id: 'dashboard', name: 'Dashboard Ejecutivo & Analítica', shortName: 'Dashboard', icon: Percent },
    { id: 'config', name: 'Configuración & Usuarios', shortName: 'Config', icon: Sliders },
  ],
  gerente: [
    { id: 'catalogo', name: 'Catálogo & Semáforo', shortName: 'Catálogo', icon: Truck },
    { id: 'contratos', name: 'Cotizaciones & Contratos', shortName: 'Contratos', icon: FileText },
    { id: 'logistica', name: 'Control de Logística', shortName: 'Logística', icon: MapPin },
    { id: 'cobranza', name: 'Facturación & Cobranza', shortName: 'Cobranza', icon: DollarSign },
  ],
  taller: [
    { id: 'mantenimiento', name: 'Mantenimiento & OTs', shortName: 'Mantenimiento', icon: Wrench },
    { id: 'inventario', name: 'Inventario Refacciones', shortName: 'Inventario', icon: PackageCheck },
  ],
  operador: [
    { id: 'checkin', name: 'Check-in / Check-out', shortName: 'Checklist', icon: CheckSquare },
    { id: 'incidencias', name: 'Reporte Incidencias', shortName: 'Incidencias', icon: AlertOctagon },
  ],
  obras: [
    { id: 'proyectos', name: 'Obras Propias', shortName: 'Obras', icon: Building2 },
  ],
  whatsapp: [
    { id: 'envios', name: 'WhatsApp & PDF', shortName: 'WhatsApp', icon: MessageSquareShare },
  ]
};

const ROLE_NAMES: Record<RoleId, string> = {
  admin: 'Administrador General',
  gerente: 'Gerente Administrativo',
  taller: 'Taller & Mantenimiento',
  operador: 'Operador de Campo',
  obras: 'Obras Propias',
  whatsapp: 'WhatsApp & PDF',
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleId | null>(null);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Application Data States
  const [equipments, setEquipments] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [workOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [inspections, setInspections] = useState<FieldInspection[]>(INITIAL_INSPECTIONS);
  const [incidents, setIncidents] = useState<FieldIncident[]>(INITIAL_INCIDENTS);
  const [projects] = useState<InternalProject[]>(INITIAL_INTERNAL_PROJECTS);

  // When changing role, set active module to first module of that role
  const handleSelectRole = (role: RoleId | null) => {
    setCurrentRole(role);
    if (role && ROLE_MODULES[role] && ROLE_MODULES[role].length > 0) {
      setActiveModule(ROLE_MODULES[role][0].id);
    }
  };

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

  // RULE STRICT COMPLIANCE:
  // Zero header, zero side navigation, zero bottom navigation bar when on Home (currentRole === null).
  if (currentRole === null) {
    return <HomeRoleSelector onSelectRole={(role) => handleSelectRole(role)} />;
  }

  const currentModules = ROLE_MODULES[currentRole] || [];

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1A1C1E] flex flex-col font-sans">
      {/* 1. Header - Appears ONLY when inside a role */}
      <header className="h-16 bg-white border-b border-[#E1E4E8] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleSelectRole(null)} 
            className="w-8 h-8 bg-[#1A1C1E] flex items-center justify-center shrink-0 cursor-pointer hover:bg-black transition-colors"
            title="Cerrar Sesión / Salir al Inicio"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-sm md:text-base font-bold tracking-tight uppercase text-[#1A1C1E]">
            Construcción y renta de maquinaria
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase text-[#64748B]">ROL ACTIVO</span>
            <span className="font-bold text-[#1A1C1E]">{ROLE_NAMES[currentRole]}</span>
          </div>

          <button
            onClick={() => handleSelectRole(null)}
            className="px-3.5 py-2 border border-red-600 bg-red-600 text-white hover:bg-red-700 font-bold uppercase text-[11px] flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            title="Cerrar sesión de este rol"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* 2. Main Work Area with Dedicated Left Sidebar & Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Bar (Desktop) - Shows ONLY Modules of Current Role */}
        <aside className="hidden md:flex w-60 bg-[#1A1C1E] flex-col justify-between py-5 px-3 shrink-0 border-r border-[#E1E4E8] font-mono text-xs">
          <div className="space-y-4">
            {/* Active Role Header Badge */}
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded">
              <span className="text-[9px] uppercase text-[#64748B] font-bold block">SISTEMA DE MÓDULOS</span>
              <span className="text-xs font-bold text-[#00FF41] uppercase tracking-wider block">
                {ROLE_NAMES[currentRole]}
              </span>
            </div>

            {/* Role Modules List */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 block mb-2">
                MÓDULOS DE ACCESO
              </span>
              {currentModules.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id)}
                    className={`w-full px-3 py-3 rounded text-left flex items-center gap-3 transition-all cursor-pointer font-bold ${
                      isActive
                        ? 'bg-white/15 text-[#00FF41] border-l-4 border-[#00FF41] pl-2.5'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{mod.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout / Exit Action Button at bottom of Sidebar */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => handleSelectRole(null)}
              className="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600 border border-red-500/50 hover:border-red-600 text-red-200 hover:text-white transition-all font-bold uppercase text-[11px] flex items-center justify-center gap-2 cursor-pointer rounded"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Full-Width Content Container */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] pb-16 md:pb-0">
          {currentRole === 'admin' && (
            <AdminView
              equipments={equipments}
              contracts={contracts}
              activeTab={activeModule as any}
              onSelectTab={(tab) => setActiveModule(tab)}
            />
          )}

          {currentRole === 'gerente' && (
            <GerenteView
              equipments={equipments}
              contracts={contracts}
              activeTab={activeModule as any}
              onSelectTab={(tab) => setActiveModule(tab)}
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
              activeTab={activeModule as any}
              onSelectTab={(tab) => setActiveModule(tab)}
              onToggleLockEquipment={handleToggleLockEquipment}
            />
          )}

          {currentRole === 'operador' && (
            <OperadorView
              equipments={equipments}
              inspections={inspections}
              incidents={incidents}
              activeTab={activeModule as any}
              onSelectTab={(tab) => setActiveModule(tab)}
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

      {/* 3. Bottom Navigation Bar for Mobile & Tablet - Shows ONLY Modules of Current Role + Logout */}
      <nav className="h-14 bg-[#1A1C1E] border-t border-[#E1E4E8] flex items-center justify-around shrink-0 md:hidden fixed bottom-0 left-0 right-0 z-50 text-white px-2">
        {currentModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 px-2 ${
                isActive ? 'text-[#00FF41]' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-tighter">
                {mod.shortName}
              </span>
            </button>
          );
        })}

        {/* Exit/Logout Icon Button */}
        <button
          onClick={() => handleSelectRole(null)}
          className="flex flex-col items-center gap-1 cursor-pointer py-1 px-2 text-red-400 hover:text-red-300"
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-tighter">
            Salir
          </span>
        </button>
      </nav>
    </div>
  );
}
