import React, { useState } from 'react';
import { Equipment, FieldInspection, FieldIncident } from '../../types';
import { Smartphone, Camera, CheckSquare, AlertOctagon, Send, MapPin, Check } from 'lucide-react';

interface Props {
  equipments: Equipment[];
  inspections: FieldInspection[];
  incidents: FieldIncident[];
  onAddInspection: (inspection: Omit<FieldInspection, 'id' | 'timestamp'>) => void;
  onAddIncident: (incident: Omit<FieldIncident, 'id' | 'timestamp' | 'status'>) => void;
  activeTab?: 'checkin' | 'incidencias';
  onSelectTab?: (tab: 'checkin' | 'incidencias') => void;
}

export const OperadorView: React.FC<Props> = ({
  equipments,
  inspections,
  incidents,
  onAddInspection,
  onAddIncident,
  activeTab: externalTab,
  onSelectTab
}) => {
  const [internalTab, setInternalTab] = useState<'checkin' | 'incidencias'>('checkin');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const handleTabChange = (tab: 'checkin' | 'incidencias') => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Inspection Form State
  const [selectedEqId, setSelectedEqId] = useState(equipments[0]?.id || '');
  const [checkType, setCheckType] = useState<'Check-in (Entrega)' | 'Check-out (Recepción)'>('Check-in (Entrega)');
  const [clientName, setClientName] = useState('');
  const [horometerInput, setHorometerInput] = useState<number>(2450);
  const [fuelInput, setFuelInput] = useState<number>(80);
  const [notes, setNotes] = useState('');
  const [signed, setSigned] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Incident Form State
  const [incEqId, setIncEqId] = useState(equipments[0]?.id || '');
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState<'Baja' | 'Media' | 'Alta' | 'Crítica'>('Alta');
  const [incGps, setIncGps] = useState('19.4326° N, 99.1332° W');

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    onAddInspection({
      equipmentId: selectedEqId,
      type: checkType,
      clientName,
      horometer: Number(horometerInput),
      fuelLevel: Number(fuelInput),
      damageNotes: notes || 'Sin novedad en inspección visual.',
      photosCount: 4,
      clientSignature: signed ? `Firma Digital: ${clientName}` : undefined,
      operatorName: 'Jaime Roldán (Operador)'
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setClientName('');
    setNotes('');
    setSigned(false);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incDesc) return;

    onAddIncident({
      equipmentId: incEqId,
      description: incDesc,
      severity: incSeverity,
      gpsLocation: incGps,
      photoUploaded: true,
      operatorName: 'Jaime Roldán (Operador)'
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setIncDesc('');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sub Header Mobile Optimized */}
      <div className="p-3 bg-[#1A1C1E] text-white flex justify-between items-center text-xs px-6 font-mono">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#00FF41]" />
          <span>CAMPO Y CAMPO MÓVIL — Jaime Roldán</span>
        </div>
        <div>LEVENTAMIENTO DE DATOS EN OBRA</div>
      </div>



      {showSuccessToast && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-mono font-bold text-center uppercase">
          ✓ REGISTRO ENVIADO CORRECTAMENTE AL SISTEMA
        </div>
      )}

      {activeTab === 'checkin' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#E1E4E8] bg-white">
          {/* Inspection Digital Form */}
          <form onSubmit={handleInspectionSubmit} className="p-6 border-r border-[#E1E4E8] space-y-4 font-mono text-xs">
            <div className="border-b border-[#E1E4E8] pb-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">INSPECCIÓN EN OBRA</span>
              <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Digital Check-in / Check-out</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748B] mb-1">TIPO INSPECCIÓN:</label>
                <select
                  value={checkType}
                  onChange={(e) => setCheckType(e.target.value as any)}
                  className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-bold"
                >
                  <option value="Check-in (Entrega)">Check-in (Entrega)</option>
                  <option value="Check-out (Recepción)">Check-out (Recepción)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#64748B] mb-1">MAQUINARIA:</label>
                <select
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
                >
                  {equipments.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">NOMBRE Y FIRMA CLIENTE/SUPERVISOR OBRA:</label>
              <input
                type="text"
                required
                placeholder="Ej. Ing. Carlos Ramírez"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-sans font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748B] mb-1">LECTURA HORÓMETRO (HRS):</label>
                <input
                  type="number"
                  required
                  value={horometerInput}
                  onChange={(e) => setHorometerInput(Number(e.target.value))}
                  className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#64748B] mb-1">NIVEL COMBUSTIBLE (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={fuelInput}
                  onChange={(e) => setFuelInput(Number(e.target.value))}
                  className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">OBSERVACIONES Y EVIDENCE DE RAYONES O GOLPES:</label>
              <textarea
                rows={2}
                placeholder="Escriba condición física inicial..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-sans"
              />
            </div>

            {/* Photo & Digital Signature Capture */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                className="p-3 border border-[#E1E4E8] bg-[#F8F9FA] flex items-center justify-center gap-2 text-[11px] font-bold uppercase cursor-pointer hover:bg-gray-200"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                Adjuntar 4 Fotos (Obligatorio)
              </button>

              <button
                type="button"
                onClick={() => setSigned(!signed)}
                className={`p-3 border text-[11px] font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  signed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-[#F8F9FA] border-[#E1E4E8]'
                }`}
              >
                <Check className="w-4 h-4" />
                {signed ? 'Firma Capturada' : 'Capturar Firma Digital'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A1C1E] text-white font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-black cursor-pointer"
            >
              <Send className="w-4 h-4" /> Finalizar y Registrar Checklist
            </button>
          </form>

          {/* Inspection History */}
          <div className="p-6 bg-[#F8F9FA]">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-3">HISTORIAL DE INSPECCIONES REGISTRADAS</span>
            <div className="space-y-3 font-mono text-xs">
              {inspections.map((ins) => (
                <div key={ins.id} className="p-3 bg-white border border-[#E1E4E8]">
                  <div className="flex justify-between font-bold text-[#1A1C1E]">
                    <span>{ins.type} • {ins.equipmentId}</span>
                    <span className="text-[10px] text-[#64748B]">{ins.timestamp}</span>
                  </div>
                  <p className="text-[11px] mt-1 font-sans">Cliente: {ins.clientName} ({ins.clientSignature || 'Firma pendiente'})</p>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Horómetro: {ins.horometer} hrs | Tanque: {ins.fuelLevel}% | Fotos: {ins.photosCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Incidents Express Report Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#E1E4E8] bg-white">
          <form onSubmit={handleIncidentSubmit} className="p-6 border-r border-[#E1E4E8] space-y-4 font-mono text-xs">
            <div className="border-b border-[#E1E4E8] pb-2">
              <span className="text-[10px] font-bold text-red-600 uppercase block">REPORTE EXPRÉS DE FALLA</span>
              <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Alerta Directa a Encargado de Taller</h3>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">EQUIPO CON FALLA:</label>
              <select
                value={incEqId}
                onChange={(e) => setIncEqId(e.target.value)}
                className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
              >
                {equipments.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">SEVERIDAD DE LA FALLA:</label>
              <select
                value={incSeverity}
                onChange={(e) => setIncSeverity(e.target.value as any)}
                className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-bold text-red-600"
              >
                <option value="Baja">Baja - Mantenimiento Menor</option>
                <option value="Media">Media - Fuga o Desgaste</option>
                <option value="Alta">Alta - Paro Parcial de Equipo</option>
                <option value="Crítica">Crítica - Paro Total / Fuga Hidráulica</option>
              </select>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">UBICACIÓN GPS ACTUAL EN OBRA:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={incGps}
                  onChange={(e) => setIncGps(e.target.value)}
                  className="flex-1 p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
                />
                <button type="button" className="px-3 bg-gray-200 border border-[#E1E4E8] text-[10px] font-bold uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> GPS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1">DESCRIPCIÓN DE LA INCIDENCIA:</label>
              <textarea
                rows={3}
                required
                placeholder="Describa el fallo detectado..."
                value={incDesc}
                onChange={(e) => setIncDesc(e.target.value)}
                className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-700 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" /> Enviar Alerta Crítica a Taller
            </button>
          </form>

          {/* Incidents Stream */}
          <div className="p-6 bg-[#F8F9FA]">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-3">INCIDENCIAS REPORTADAS RECIENTES</span>
            <div className="space-y-3 font-mono text-xs">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-white border border-red-200">
                  <div className="flex justify-between font-bold text-red-700">
                    <span>{inc.equipmentId} • Severidad: {inc.severity}</span>
                    <span className="text-[10px] text-[#64748B]">{inc.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#1A1C1E] mt-1 font-sans">{inc.description}</p>
                  <p className="text-[10px] text-[#64748B] mt-1">Ubicación: {inc.gpsLocation} | Reportó: {inc.operatorName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
