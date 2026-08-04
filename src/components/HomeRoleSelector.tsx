import React from 'react';
import { RoleId } from '../types';
import { ShieldCheck, UserCheck, Wrench, Smartphone, Building2, MessageSquareShare } from 'lucide-react';

interface Props {
  onSelectRole: (roleId: RoleId) => void;
}

export const HomeRoleSelector: React.FC<Props> = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'admin' as RoleId,
      name: 'Administrador General',
      icon: ShieldCheck,
      code: 'ROL-01'
    },
    {
      id: 'gerente' as RoleId,
      name: 'Gerente Administrativo',
      icon: UserCheck,
      code: 'ROL-02'
    },
    {
      id: 'taller' as RoleId,
      name: 'Encargado de Taller',
      icon: Wrench,
      code: 'ROL-03'
    },
    {
      id: 'operador' as RoleId,
      name: 'Operador / Campo',
      icon: Smartphone,
      code: 'ROL-04'
    },
    {
      id: 'obras' as RoleId,
      name: 'Obras Propias',
      icon: Building2,
      code: 'ROL-05'
    },
    {
      id: 'whatsapp' as RoleId,
      name: 'WhatsApp & PDF',
      icon: MessageSquareShare,
      code: 'ROL-06'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1A1C1E] flex flex-col justify-between items-center p-6 md:p-12">
      {/* Top Branding - Minimal, Edge to edge clean */}
      <div className="w-full flex justify-between items-center border-b border-[#E1E4E8] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1C1E] flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-white rotate-45" />
          </div>
          <span className="text-base md:text-xl font-bold tracking-tight uppercase">
            Construcción y renta de maquinaria
          </span>
        </div>
        <div className="text-xs uppercase font-mono text-[#64748B] tracking-wider">
          SISTEMA v2.4
        </div>
      </div>

      {/* Main Role Grid - Full Width, No Encapsulated Cards */}
      <div className="w-full max-w-7xl my-auto py-12">
        <div className="mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-[#64748B] uppercase block">
            ACCESO AL SISTEMA
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1A1C1E] uppercase mt-1">
            SELECCIONE ROL
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#E1E4E8]">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className="border-r border-b border-[#E1E4E8] bg-white p-6 md:p-8 flex flex-col items-center justify-center gap-4 hover:bg-[#1A1C1E] hover:text-white transition-all cursor-pointer group text-center"
              >
                <div className="text-xs font-mono text-[#64748B] group-hover:text-[#00FF41] tracking-widest">
                  {r.code}
                </div>
                <Icon className="w-10 h-10 stroke-[1.5] group-hover:scale-110 transition-transform" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-tight leading-tight">
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Minimal */}
      <div className="w-full border-t border-[#E1E4E8] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-mono text-[#64748B] gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00FF41]"></span>
          <span>SISTEMA OPERATIVO CONECTADO</span>
        </div>
        <div>CONSTRUCCIÓN Y RENTA DE MAQUINARIA &copy; 2026</div>
      </div>
    </div>
  );
};
