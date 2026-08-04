import React from 'react';
import { InternalProject, Equipment } from '../../types';
import { Building2, MapPin, Truck } from 'lucide-react';

interface Props {
  projects: InternalProject[];
  equipments: Equipment[];
}

export const ObrasPropiasView: React.FC<Props> = ({ projects, equipments }) => {
  return (
    <div className="w-full flex flex-col">
      {/* Sub Header */}
      <div className="p-3 bg-[#1A1C1E] text-white flex justify-between items-center text-xs px-6 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#00FF41]">●</span>
          <span>MÓDULO DE OBRAS PROPIAS — Proyectos Internos</span>
        </div>
        <div>SEPARACIÓN MAQUINARIA INTERNA VS. RENTADA</div>
      </div>

      <div className="p-6 bg-white border-b border-[#E1E4E8]">
        <div className="border-b border-[#E1E4E8] pb-3 mb-6">
          <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">FASE 2 / VALOR AGREGADO</span>
          <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Separación de Maquinaria Interna vs. Terceros</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
          {projects.map((prj) => {
            const assignedEqs = equipments.filter(e => prj.assignedEquipmentIds.includes(e.id));

            return (
              <div key={prj.id} className="border border-[#E1E4E8] p-5 bg-[#F8F9FA]">
                <div className="flex justify-between items-start border-b border-[#E1E4E8] pb-3 mb-3">
                  <div>
                    <span className="font-bold text-sm block font-sans text-[#1A1C1E]">{prj.name}</span>
                    <span className="text-[10px] text-[#64748B]">{prj.code} • Encargado: {prj.manager}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    Proyecto Interno
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#64748B]" /> {prj.location}</div>
                  <div>Presupuesto: <span className="font-bold">${prj.budget.toLocaleString()} MXN</span></div>
                </div>

                <div className="border-t border-[#E1E4E8] pt-3">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-2">
                    EQUIPOS ASIGNADOS A ESTA OBRA ({assignedEqs.length}):
                  </span>
                  {assignedEqs.length > 0 ? (
                    <div className="space-y-1.5">
                      {assignedEqs.map(eq => (
                        <div key={eq.id} className="p-2 bg-white border border-[#E1E4E8] flex justify-between items-center">
                          <span className="font-bold font-sans">{eq.name} ({eq.code})</span>
                          <span className="text-[10px] text-emerald-700 font-bold">Bloqueado para Renta</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#64748B] italic">Sin equipos asignados en este momento.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
