import React, { useState } from 'react';
import { Equipment, Contract } from '../../types';
import { Truck, FileText, Calendar, DollarSign, MapPin, Search, ShieldCheck, Plus } from 'lucide-react';

interface Props {
  equipments: Equipment[];
  contracts: Contract[];
  onUpdateEquipmentStatus?: (id: string, newStatus: Equipment['status']) => void;
}

export const GerenteView: React.FC<Props> = ({ equipments, contracts }) => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'contratos' | 'logistica' | 'cobranza'>('catalogo');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipments[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Quotation Generator state
  const [quotePeriod, setQuotePeriod] = useState<'hora' | 'día' | 'semana' | 'mes'>('día');
  const [quoteDuration, setQuoteDuration] = useState<number>(3);
  const [includeOperator, setIncludeOperator] = useState<boolean>(true);

  const filteredEquipments = equipments.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status helper color styling
  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Disponible': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'En Renta': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En Mantenimiento': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Fuera de Servicio': return 'bg-red-100 text-red-800 border-red-300';
      case 'En Tránsito': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sub Header Role Banner */}
      <div className="p-3 bg-[#1A1C1E] text-white flex justify-between items-center text-xs px-6 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#00FF41]">●</span>
          <span>GERENCIA ADMINISTRATIVA — Manuel Homa</span>
        </div>
        <div>MÓDULOS DE GESTIÓN COMERCIAL & LOGÍSTICA</div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full bg-white border-b border-[#E1E4E8] flex text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`px-6 py-3.5 border-r border-[#E1E4E8] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'catalogo' ? 'bg-[#1A1C1E] text-white' : 'hover:bg-[#F8F9FA]'
          }`}
        >
          <Truck className="w-4 h-4" />
          Catálogo & Semáforo de Maquinaria
        </button>
        <button
          onClick={() => setActiveTab('contratos')}
          className={`px-6 py-3.5 border-r border-[#E1E4E8] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'contratos' ? 'bg-[#1A1C1E] text-white' : 'hover:bg-[#F8F9FA]'
          }`}
        >
          <FileText className="w-4 h-4" />
          Cotizaciones & Contratos
        </button>
        <button
          onClick={() => setActiveTab('logistica')}
          className={`px-6 py-3.5 border-r border-[#E1E4E8] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'logistica' ? 'bg-[#1A1C1E] text-white' : 'hover:bg-[#F8F9FA]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Control de Logística & Entregas
        </button>
        <button
          onClick={() => setActiveTab('cobranza')}
          className={`px-6 py-3.5 border-r border-[#E1E4E8] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'cobranza' ? 'bg-[#1A1C1E] text-white' : 'hover:bg-[#F8F9FA]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Facturación & Cobranza
        </button>
      </div>

      {/* Tab 1: Catálogo & Semáforo */}
      {activeTab === 'catalogo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#E1E4E8]">
          {/* List column */}
          <div className="lg:col-span-5 border-r border-[#E1E4E8] bg-white flex flex-col">
            <div className="p-3 border-b border-[#E1E4E8] bg-[#F8F9FA] flex justify-between items-center">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Buscar máquina o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E1E4E8] text-xs font-mono focus:outline-none focus:border-[#1A1C1E]"
                />
              </div>
            </div>

            <div className="divide-y divide-[#E1E4E8] overflow-y-auto max-h-[600px]">
              {filteredEquipments.map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`p-4 cursor-pointer hover:bg-[#F8F9FA] transition-colors flex justify-between items-center ${
                    selectedEquipment?.id === eq.id ? 'bg-[#F1F3F5] border-l-4 border-[#1A1C1E]' : ''
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-[#1A1C1E]">{eq.name}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">
                      {eq.code} • Horómetro: {eq.horometer} hrs
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${getStatusColor(eq.status)}`}>
                    {eq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expediente Digital Detail Column */}
          {selectedEquipment && (
            <div className="lg:col-span-7 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-[#E1E4E8] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">EXPEDIENTE DIGITAL</span>
                    <h2 className="text-lg font-bold uppercase text-[#1A1C1E]">{selectedEquipment.name}</h2>
                    <p className="text-xs font-mono text-[#64748B]">CÓDIGO: {selectedEquipment.code}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-mono font-bold uppercase border ${getStatusColor(selectedEquipment.status)}`}>
                    {selectedEquipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono mb-6">
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">MODELO & AÑO</span>
                    <span className="font-bold">{selectedEquipment.model} ({selectedEquipment.year})</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">NO. SERIE</span>
                    <span className="font-bold">{selectedEquipment.serialNumber}</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">PÓLIZA SEGURO</span>
                    <span className="font-bold">{selectedEquipment.insurancePolicy}</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">TARJETA CIRCULACIÓN</span>
                    <span className="font-bold">{selectedEquipment.registrationCard}</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">HORÓMETRO ACTUAL</span>
                    <span className="font-bold">{selectedEquipment.horometer} hrs</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-3 border border-[#E1E4E8]">
                    <span className="text-[10px] text-[#64748B] block">UBICACIÓN ACTUAL</span>
                    <span className="font-bold text-[10px]">{selectedEquipment.currentLocation}</span>
                  </div>
                </div>

                {/* Tariffs Breakdown */}
                <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA] mb-6">
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-2">
                    TARIFAS DE RENTA VIGENTES
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="bg-white p-2 border border-[#E1E4E8]">
                      <span className="text-[9px] text-[#64748B] block">POR HORA</span>
                      <span className="font-bold">${selectedEquipment.hourlyRate}</span>
                    </div>
                    <div className="bg-white p-2 border border-[#E1E4E8]">
                      <span className="text-[9px] text-[#64748B] block">POR DÍA</span>
                      <span className="font-bold">${selectedEquipment.dailyRate}</span>
                    </div>
                    <div className="bg-white p-2 border border-[#E1E4E8]">
                      <span className="text-[9px] text-[#64748B] block">SEMANA</span>
                      <span className="font-bold">${selectedEquipment.weeklyRate}</span>
                    </div>
                    <div className="bg-white p-2 border border-[#E1E4E8]">
                      <span className="text-[9px] text-[#64748B] block">MES</span>
                      <span className="font-bold">${selectedEquipment.monthlyRate}</span>
                    </div>
                  </div>
                </div>

                {/* Historial Log */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-2">
                    HISTORIAL DE CLIENTES Y RENTAS PREVIAS
                  </span>
                  <div className="border border-[#E1E4E8] divide-y divide-[#E1E4E8] text-xs font-mono bg-white">
                    <div className="p-2.5 flex justify-between">
                      <span>Constructora Maya S.A.</span>
                      <span className="text-[#64748B]">01/07/2026 - 01/09/2026 (Activo)</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span>Pavimentaciones del Bajío</span>
                      <span className="text-[#64748B]">15/04/2026 - 15/06/2026 (Finalizado)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cotizaciones y Contratos */}
      {activeTab === 'contratos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#E1E4E8] bg-white">
          {/* Quote Generator */}
          <div className="p-6 border-r border-[#E1E4E8] flex flex-col justify-between">
            <div>
              <div className="border-b border-[#E1E4E8] pb-3 mb-4">
                <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">MÓDULO DE VENTAS</span>
                <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Generador Automático de Cotizaciones</h3>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#64748B] mb-1">SELECCIONAR EQUIPO:</label>
                  <select 
                    value={selectedEquipment?.id}
                    onChange={(e) => setSelectedEquipment(equipments.find(item => item.id === e.target.value) || null)}
                    className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
                  >
                    {equipments.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748B] mb-1">PERÍODO:</label>
                    <select 
                      value={quotePeriod}
                      onChange={(e) => setQuotePeriod(e.target.value as any)}
                      className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
                    >
                      <option value="hora">Por Hora</option>
                      <option value="día">Por Día</option>
                      <option value="semana">Por Semana</option>
                      <option value="mes">Por Mes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#64748B] mb-1">DURACIÓN ({quotePeriod}s):</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={quoteDuration}
                      onChange={(e) => setQuoteDuration(Number(e.target.value))}
                      className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="opCheck" 
                    checked={includeOperator}
                    onChange={(e) => setIncludeOperator(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="opCheck" className="cursor-pointer font-bold uppercase">Incluir Operador Certificado (+$800/día)</label>
                </div>
              </div>

              {/* Quote Result Box */}
              {selectedEquipment && (
                <div className="mt-6 border border-[#1A1C1E] bg-[#F8F9FA] p-4 font-mono">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-2">CÁLCULO ESTIMADO</span>
                  {(() => {
                    let baseRate = 0;
                    if (quotePeriod === 'hora') baseRate = selectedEquipment.hourlyRate;
                    if (quotePeriod === 'día') baseRate = selectedEquipment.dailyRate;
                    if (quotePeriod === 'semana') baseRate = selectedEquipment.weeklyRate;
                    if (quotePeriod === 'mes') baseRate = selectedEquipment.monthlyRate;

                    const baseTotal = baseRate * quoteDuration;
                    const operatorCost = includeOperator ? (quotePeriod === 'hora' ? 150 : 800) * quoteDuration : 0;
                    const total = baseTotal + operatorCost;
                    const deposit = Math.round(total * 0.25);

                    return (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span>Renta Base ({quoteDuration} {quotePeriod}s):</span> <span>${baseTotal.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Servicio Operador:</span> <span>${operatorCost.toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold border-t border-[#E1E4E8] pt-1.5 text-sm text-[#1A1C1E]">
                          <span>TOTAL COTIZACIÓN:</span> <span>${total.toLocaleString()} MXN</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 text-[11px] font-bold">
                          <span>Depósito en Garantía Requerido:</span> <span>${deposit.toLocaleString()} MXN</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <button className="mt-6 w-full py-3 bg-[#1A1C1E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black cursor-pointer">
              <FileText className="w-4 h-4" /> Generar y Emitir Contrato Oficial
            </button>
          </div>

          {/* Active Contracts & Deposit Control */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#E1E4E8] pb-3 mb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">CONTROL DE CONTRATOS</span>
                  <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Garantías & Estado de Contrato</h3>
                </div>
              </div>

              <div className="space-y-4">
                {contracts.map(c => (
                  <div key={c.id} className="border border-[#E1E4E8] p-4 bg-[#F8F9FA] text-xs font-mono">
                    <div className="flex justify-between items-start border-b border-[#E1E4E8] pb-2 mb-2">
                      <div>
                        <span className="font-bold text-sm block font-sans text-[#1A1C1E]">{c.clientName}</span>
                        <span className="text-[10px] text-[#64748B]">{c.code} • Tel: {c.clientPhone}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                        c.status === 'activo' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        c.status === 'vencido' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                      <div>Período: <span className="font-bold">{c.duration} {c.periodType}(s)</span></div>
                      <div>Monto Total: <span className="font-bold">${c.totalAmount.toLocaleString()}</span></div>
                      <div>Depósito Garantía: <span className="font-bold text-emerald-700">${c.guaranteeDeposit.toLocaleString()}</span></div>
                      <div>Estatus Garantía: <span className="font-bold uppercase text-purple-700">{c.depositStatus}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Control de Logística y Entregas */}
      {activeTab === 'logistica' && (
        <div className="w-full p-6 bg-white border-b border-[#E1E4E8]">
          <div className="border-b border-[#E1E4E8] pb-3 mb-6">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">MÓDULO DE ENTREGAS</span>
            <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Programación de Envíos, Choferes y Mapeo en Obra</h3>
          </div>

          <div className="overflow-x-auto border border-[#E1E4E8]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F1F3F5] border-b border-[#E1E4E8] text-[10px] text-[#64748B] uppercase">
                <tr>
                  <th className="p-3">Contrato</th>
                  <th className="p-3">Cliente / Obra</th>
                  <th className="p-3">Equipo A Asignar</th>
                  <th className="p-3">Chofer / Transporte</th>
                  <th className="p-3">Estatus Envío</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4E8]">
                {contracts.map(c => (
                  <tr key={c.id} className="hover:bg-[#F8F9FA]">
                    <td className="p-3 font-bold text-[#1A1C1E]">{c.code}</td>
                    <td className="p-3">
                      <div className="font-bold font-sans">{c.clientName}</div>
                      <div className="text-[10px] text-[#64748B]">{c.deliveryAddress}</div>
                    </td>
                    <td className="p-3">{c.equipmentId}</td>
                    <td className="p-3">{c.assignedDriver || 'Pendiente Asignación Chofer'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-100 text-purple-800">
                        {c.status === 'activo' ? 'En Sitio de Obra' : 'Programado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Facturación y Cobranza */}
      {activeTab === 'cobranza' && (
        <div className="w-full p-6 bg-white border-b border-[#E1E4E8]">
          <div className="border-b border-[#E1E4E8] pb-3 mb-6">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">CONTROLES FINANCIEROS</span>
            <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Alertas de Rentas Vencidas y Seguimiento de Cobro</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA]">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase block mb-3">
                ⚠️ COBRANZA REQUERIDA / RENTAS VENCIDAS
              </span>
              <div className="space-y-3">
                {contracts.filter(c => c.paymentStatus === 'vencido').map(c => (
                  <div key={c.id} className="p-3 bg-white border border-red-200 text-xs font-mono">
                    <div className="flex justify-between font-bold text-red-700">
                      <span>{c.clientName}</span>
                      <span>${c.totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-1">{c.code} • Tel: {c.clientPhone}</p>
                    <div className="mt-2 flex gap-2">
                      <button className="px-3 py-1 bg-red-600 text-white text-[10px] uppercase font-bold cursor-pointer">
                        Solicitar Recolección
                      </button>
                      <button className="px-3 py-1 bg-[#1A1C1E] text-white text-[10px] uppercase font-bold cursor-pointer">
                        Enviar Recordatorio WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#E1E4E8] p-4 bg-[#F8F9FA]">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block mb-3">
                ✓ PAGOS Y ABONOS REGISTRADOS
              </span>
              <div className="space-y-3">
                {contracts.filter(c => c.paymentStatus === 'al_dia').map(c => (
                  <div key={c.id} className="p-3 bg-white border border-emerald-200 text-xs font-mono">
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>{c.clientName}</span>
                      <span>${c.totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-1">{c.code} • Depósito Cubierto</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
