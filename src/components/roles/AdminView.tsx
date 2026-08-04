import React, { useState } from 'react';
import { Equipment, Contract, Collaborator } from '../../types';
import { COLLABORATORS_22 } from '../../data/mockData';
import { DollarSign, Percent, ShieldCheck, Users, Sliders, AlertTriangle } from 'lucide-react';

interface Props {
  equipments: Equipment[];
  contracts: Contract[];
  activeTab?: 'dashboard' | 'config';
  onSelectTab?: (tab: 'dashboard' | 'config') => void;
}

export const AdminView: React.FC<Props> = ({
  equipments,
  contracts,
  activeTab: externalTab,
  onSelectTab
}) => {
  const [internalTab, setInternalTab] = useState<'dashboard' | 'config'>('dashboard');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const handleTabChange = (tab: 'dashboard' | 'config') => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Calculated Metrics
  const totalEquipments = equipments.length;
  const rentedEquipments = equipments.filter(e => e.status === 'En Renta').length;
  const occupancyRate = ((rentedEquipments / totalEquipments) * 100).toFixed(1);

  const activeReceivables = contracts
    .filter(c => c.paymentStatus === 'al_dia')
    .reduce((acc, c) => acc + c.totalAmount, 0);

  const overdueReceivables = contracts
    .filter(c => c.paymentStatus === 'vencido')
    .reduce((acc, c) => acc + c.totalAmount, 0);

  return (
    <div className="w-full flex flex-col">


      {activeTab === 'dashboard' ? (
        <div className="w-full flex flex-col">
          {/* Top KPI Banner - Full Width No Encapsulated Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E1E4E8] bg-white">
            <div className="p-6 border-r border-b md:border-b-0 border-[#E1E4E8]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] block mb-1">
                OCUPACIÓN GLOBAL
              </span>
              <div className="text-3xl font-light text-[#1A1C1E] font-mono">
                {occupancyRate}<span className="text-lg">%</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#F1F3F5] w-full">
                <div className="h-full bg-[#1A1C1E]" style={{ width: `${occupancyRate}%` }} />
              </div>
              <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
                {rentedEquipments} de {totalEquipments} equipos rentados
              </span>
            </div>

            <div className="p-6 border-r border-b md:border-b-0 border-[#E1E4E8]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] block mb-1">
                INGRESOS TOTALES
              </span>
              <div className="text-3xl font-light text-[#1A1C1E] font-mono">
                ${equipments.reduce((acc, e) => acc + e.revenue, 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-2 block">
                +14.2% VS MES ANTERIOR
              </span>
            </div>

            <div className="p-6 border-r border-[#E1E4E8]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] block mb-1">
                RENTAS ACTIVAS
              </span>
              <div className="text-3xl font-light text-[#1A1C1E] font-mono">
                ${activeReceivables.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#64748B] font-mono mt-2 block">
                AL DÍA
              </span>
            </div>

            <div className="p-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] block mb-1">
                RENTAS VENCIDAS
              </span>
              <div className="text-3xl font-light text-red-600 font-mono">
                ${overdueReceivables.toLocaleString()}
              </div>
              <span className="text-[10px] text-red-600 font-bold mt-2 block uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 inline" /> COBRANZA REQUERIDA
              </span>
            </div>
          </div>

          {/* Main Grid: Profitability & Cashflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#E1E4E8]">
            {/* Profitability Per Active */}
            <div className="border-r border-[#E1E4E8] bg-white flex flex-col">
              <div className="p-4 border-b border-[#E1E4E8] flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1C1E]">
                  Reporte de Rentabilidad por Máquina
                </h3>
                <span className="text-[10px] font-mono text-[#64748B]">BALANCE NETO</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white border-b border-[#E1E4E8] text-[10px] font-mono text-[#64748B] uppercase">
                    <tr>
                      <th className="p-3">Equipo</th>
                      <th className="p-3 text-right">Ingresos</th>
                      <th className="p-3 text-right">Mantenimiento</th>
                      <th className="p-3 text-right">Combustible</th>
                      <th className="p-3 text-right">Margen Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E4E8]">
                    {equipments.map((eq) => {
                      const totalCosts = eq.maintenanceCost + eq.fuelCost;
                      const netProfit = eq.revenue - totalCosts;
                      const marginPercent = eq.revenue > 0 ? ((netProfit / eq.revenue) * 100).toFixed(0) : '0';

                      return (
                        <tr key={eq.id} className="hover:bg-[#F8F9FA] font-mono">
                          <td className="p-3 font-sans">
                            <div className="font-bold text-xs">{eq.name}</div>
                            <div className="text-[10px] text-[#64748B]">{eq.code}</div>
                          </td>
                          <td className="p-3 text-right text-emerald-600 font-bold">
                            ${eq.revenue.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-red-600">
                            -${eq.maintenanceCost.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-amber-600">
                            -${eq.fuelCost.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-bold text-[#1A1C1E]">
                            ${netProfit.toLocaleString()} ({marginPercent}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cashflow & Financial Balance */}
            <div className="bg-white flex flex-col">
              <div className="p-4 border-b border-[#E1E4E8] flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1C1E]">
                  Flujo de Caja y Cuentas por Cobrar
                </h3>
                <span className="text-[10px] font-mono text-[#64748B]">MONITOREO EN TIEMPO REAL</span>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-[#64748B] uppercase">Rentas Activas (Al Día)</span>
                    <span className="text-xl font-mono font-bold text-emerald-600">
                      ${activeReceivables.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-[#F1F3F5] w-full">
                    <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-[#64748B] uppercase">Rentas Vencidas (Por Cobrar)</span>
                    <span className="text-xl font-mono font-bold text-red-600">
                      ${overdueReceivables.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-[#F1F3F5] w-full">
                    <div className="h-full bg-red-500" style={{ width: '30%' }} />
                  </div>
                </div>

                <div className="border-t border-[#E1E4E8] pt-4 mt-2">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-[#64748B] mb-3">
                    Resumen de Contratos Recientes
                  </h4>
                  <div className="divide-y divide-[#E1E4E8]">
                    {contracts.map(c => (
                      <div key={c.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold">{c.clientName}</p>
                          <p className="text-[10px] text-[#64748B] font-mono">{c.code} • {c.deliveryAddress}</p>
                        </div>
                        <div className="text-right font-mono">
                          <p className="font-bold">${c.totalAmount.toLocaleString()}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 uppercase font-bold ${
                            c.paymentStatus === 'al_dia' ? 'bg-emerald-100 text-emerald-800' :
                            c.paymentStatus === 'vencido' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {c.paymentStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Config & Security Tab */
        <div className="w-full flex flex-col">
          <div className="p-4 bg-[#F8F9FA] border-b border-[#E1E4E8] flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1C1E]">
                Gestión de Usuarios y Accesos (22 Colaboradores)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#64748B]">ROL: ADMIN GENERAL</span>
          </div>

          <div className="overflow-x-auto border-b border-[#E1E4E8] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F3F5] border-b border-[#E1E4E8] text-[10px] font-mono text-[#64748B] uppercase">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Rol Asignado</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3 text-center">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4E8] font-mono">
                {COLLABORATORS_22.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F9FA]">
                    <td className="p-3 text-[#64748B]">{c.id}</td>
                    <td className="p-3 font-bold font-sans text-[#1A1C1E]">{c.name}</td>
                    <td className="p-3">{c.role}</td>
                    <td className="p-3 text-[#64748B]">{c.email}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Base Catalogs Section */}
          <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B] block mb-2">
                CATÁLOGO DE TARIFAS ESTÁNDAR
              </span>
              <ul className="text-xs font-mono divide-y divide-[#E1E4E8]">
                <li className="py-2 flex justify-between">
                  <span>Por Hora:</span> <span className="font-bold">$500 - $1,500 MXN</span>
                </li>
                <li className="py-2 flex justify-between">
                  <span>Por Día:</span> <span className="font-bold">$3,500 - $12,000 MXN</span>
                </li>
                <li className="py-2 flex justify-between">
                  <span>Por Semana:</span> <span className="font-bold">$21,000 - $70,000 MXN</span>
                </li>
                <li className="py-2 flex justify-between">
                  <span>Por Mes:</span> <span className="font-bold">$72,000 - $240,000 MXN</span>
                </li>
              </ul>
            </div>

            <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B] block mb-2">
                CATEGORÍAS DE MAQUINARIA
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {['Excavadoras', 'Retroexcavadoras', 'Minicargadores', 'Motoniveladoras', 'Compactadores', 'Grúas'].map(cat => (
                  <span key={cat} className="px-2 py-1 bg-white border border-[#E1E4E8] font-bold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B] block mb-2">
                ZONAS GEOGRÁFICAS
              </span>
              <ul className="text-xs font-mono divide-y divide-[#E1E4E8]">
                <li className="py-1.5">Zona 1: Valle de México / CDMX</li>
                <li className="py-1.5">Zona 2: Bajío / Querétaro / GTO</li>
                <li className="py-1.5">Zona 3: Norte / Monterrey</li>
                <li className="py-1.5">Zona 4: Sur / Sureste</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
