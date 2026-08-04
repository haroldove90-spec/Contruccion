import React, { useState } from 'react';
import { Equipment, WorkOrder, InventoryItem } from '../../types';
import { Wrench, AlertTriangle, PackageCheck, Lock, Unlock, Plus } from 'lucide-react';

interface Props {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  onToggleLockEquipment: (equipmentId: string) => void;
  activeTab?: 'mantenimiento' | 'inventario';
  onSelectTab?: (tab: 'mantenimiento' | 'inventario') => void;
}

export const TallerView: React.FC<Props> = ({
  equipments,
  workOrders,
  inventory,
  onToggleLockEquipment,
  activeTab: externalTab,
  onSelectTab
}) => {
  const [internalTab, setInternalTab] = useState<'mantenimiento' | 'inventario'>('mantenimiento');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const handleTabChange = (tab: 'mantenimiento' | 'inventario') => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Filter equipment with upcoming or overdue service
  const serviceAlerts = equipments.filter(
    e => e.horometer >= e.nextServiceHorometer - 50 || e.status === 'En Mantenimiento' || e.isLockedForRental
  );

  return (
    <div className="w-full flex flex-col">
      {/* Sub Header Banner */}
      <div className="p-3 bg-[#1A1C1E] text-white flex justify-between items-center text-xs px-6 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#00FF41]">●</span>
          <span>TALLER CENTRAL & MANTENIMIENTO — Pedro Sánchez</span>
        </div>
        <div>DISPONIBILIDAD OPERATIVA Y REFACCIONES</div>
      </div>



      {activeTab === 'mantenimiento' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#E1E4E8]">
          {/* Service Alerts & Equipment Locking Panel */}
          <div className="lg:col-span-5 border-r border-[#E1E4E8] bg-white p-6">
            <div className="border-b border-[#E1E4E8] pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase block">ALERTAS POR HORÓMETRO</span>
              <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">
                Mantenimiento Preventivo & Bloqueo
              </h3>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {equipments.map((eq) => {
                const hoursLeft = eq.nextServiceHorometer - eq.horometer;
                const isOverdue = hoursLeft <= 0;

                return (
                  <div key={eq.id} className="border border-[#E1E4E8] p-3.5 bg-[#F8F9FA]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-sm block font-sans text-[#1A1C1E]">{eq.name}</span>
                        <span className="text-[10px] text-[#64748B]">{eq.code}</span>
                      </div>
                      <button
                        onClick={() => onToggleLockEquipment(eq.id)}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          eq.isLockedForRental
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {eq.isLockedForRental ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {eq.isLockedForRental ? 'Bloqueado en Taller' : 'Habilitar Renta'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-[#E1E4E8] pt-2 mt-2">
                      <div>Horómetro: <span className="font-bold">{eq.horometer} hrs</span></div>
                      <div>Próx. Servicio: <span className="font-bold">{eq.nextServiceHorometer} hrs</span></div>
                    </div>

                    <div className="mt-2">
                      <span className={`text-[10px] font-bold block ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                        {isOverdue ? `⚠️ MANTENIMIENTO VENCIDO HACE ${Math.abs(hoursLeft)} HRS` : `Faltan ${hoursLeft} hrs para afinación`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Orders (OT) Panel */}
          <div className="lg:col-span-7 bg-white p-6">
            <div className="border-b border-[#E1E4E8] pb-3 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">ÓRDENES DE TRABAJO (OT)</span>
                <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Mantenimientos Preventivos y Correctivos</h3>
              </div>
            </div>

            <div className="space-y-4">
              {workOrders.map((ot) => (
                <div key={ot.id} className="border border-[#E1E4E8] p-4 bg-[#F8F9FA] text-xs font-mono">
                  <div className="flex justify-between items-start border-b border-[#E1E4E8] pb-2 mb-2">
                    <div>
                      <span className="font-bold text-sm block font-sans text-[#1A1C1E]">{ot.code} — {ot.type}</span>
                      <span className="text-[10px] text-[#64748B]">{ot.createdAt} • Asignado: {ot.technician}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                      ot.status === 'En Proceso' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ot.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#1A1C1E] mb-3">{ot.description}</p>

                  <div className="bg-white border border-[#E1E4E8] p-3 text-[11px] mb-2">
                    <span className="font-bold text-[10px] uppercase text-[#64748B] block mb-1">Repuestos & Consumibles Aplicados:</span>
                    <ul className="divide-y divide-[#E1E4E8]">
                      {ot.partsUsed.map((part, idx) => (
                        <li key={idx} className="py-1 flex justify-between">
                          <span>{part.name} (x{part.qty})</span>
                          <span className="font-bold">${(part.cost * part.qty).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-1">
                    <span>Horas-Hombre Invertidas: {ot.laborHours} hrs</span>
                    <span>Costo Final Reparación: ${ot.totalCost.toLocaleString()} MXN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Inventory Tab */
        <div className="w-full p-6 bg-white border-b border-[#E1E4E8]">
          <div className="border-b border-[#E1E4E8] pb-3 mb-6">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">CONTROL DE STOCK EN TALLER</span>
            <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Aceites, Filtros, Llantas y Refacciones Generales</h3>
          </div>

          <div className="overflow-x-auto border border-[#E1E4E8]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F1F3F5] border-b border-[#E1E4E8] text-[10px] text-[#64748B] uppercase">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Insumo / Refacción</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3 text-right">Stock Actual</th>
                  <th className="p-3 text-right">Stock Mínimo</th>
                  <th className="p-3 text-right">Precio Unitario</th>
                  <th className="p-3 text-center">Alerta Reabastecimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4E8]">
                {inventory.map((item) => {
                  const isLow = item.stock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-[#F8F9FA]">
                      <td className="p-3 text-[#64748B]">{item.code}</td>
                      <td className="p-3 font-bold font-sans text-[#1A1C1E]">{item.name}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 text-right font-bold">{item.stock} {item.unit}s</td>
                      <td className="p-3 text-right text-[#64748B]">{item.minStock} {item.unit}s</td>
                      <td className="p-3 text-right">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-red-100 text-red-800 border border-red-300">
                            ⚠️ REABASTECER URGENTE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                            OK (Stock Suficiente)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
