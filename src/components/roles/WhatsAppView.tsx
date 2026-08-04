import React, { useState } from 'react';
import { Contract } from '../../types';
import { MessageSquareShare, FileText, Send, Check } from 'lucide-react';

interface Props {
  contracts: Contract[];
}

export const WhatsAppView: React.FC<Props> = ({ contracts }) => {
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || '');
  const [phone, setPhone] = useState(contracts[0]?.clientPhone || '');
  const [sentToast, setSentToast] = useState(false);

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const handleContractChange = (id: string) => {
    setSelectedContractId(id);
    const found = contracts.find(c => c.id === id);
    if (found) setPhone(found.clientPhone);
  };

  const handleSend = (type: string) => {
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  };

  return (
    <div className="w-full flex flex-col font-mono text-xs">
      {/* Sub Header */}
      <div className="p-3 bg-[#1A1C1E] text-white flex justify-between items-center text-xs px-6">
        <div className="flex items-center gap-2">
          <MessageSquareShare className="w-4 h-4 text-[#00FF41]" />
          <span>INTEGRACIÓN WHATSAPP & EMISIÓN PDF</span>
        </div>
        <div>ENVÍO CON 1-CLIC DE COTIZACIONES, RECIBOS Y CONTRATOS</div>
      </div>

      {sentToast && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-center uppercase">
          ✓ DOCUMENTO GENERADO EN PDF Y ENVIADO POR WHATSAPP AL CLIENTE
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#E1E4E8] bg-white">
        {/* Selector & Actions */}
        <div className="p-6 border-r border-[#E1E4E8] space-y-4">
          <div className="border-b border-[#E1E4E8] pb-2">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">ENVÍO DIRECTO A WHATSAPP</span>
            <h3 className="text-sm font-bold uppercase text-[#1A1C1E]">Documentos Digitales PDF</h3>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1">SELECCIONAR CONTRATO / CLIENTE:</label>
            <select
              value={selectedContractId}
              onChange={(e) => handleContractChange(e.target.value)}
              className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none"
            >
              {contracts.map(c => (
                <option key={c.id} value={c.id}>{c.clientName} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1">NÚMERO DE WHATSAPP DEL CLIENTE:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-[#E1E4E8] bg-[#F8F9FA] focus:outline-none font-bold text-emerald-700"
            />
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleSend('cotización')}
              className="w-full py-3 bg-[#25D366] text-white font-bold uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Enviar Cotización Oficial en PDF por WhatsApp
            </button>

            <button
              onClick={() => handleSend('recordatorio')}
              className="w-full py-3 bg-[#1A1C1E] text-white font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-black cursor-pointer"
            >
              <MessageSquareShare className="w-4 h-4 text-[#00FF41]" /> Enviar Recordatorio de Pago / Cobranza
            </button>

            <button
              onClick={() => handleSend('contrato')}
              className="w-full py-3 border border-[#1A1C1E] text-[#1A1C1E] font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#F8F9FA] cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Enviar Contrato Firmado con Checklist Inicial
            </button>
          </div>
        </div>

        {/* Live Document Preview */}
        {selectedContract && (
          <div className="p-6 bg-[#F8F9FA]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-3">VISTA PREVIA DEL DOCUMENTO PDF GENERADO</span>
            <div className="p-6 bg-white border border-[#E1E4E8] space-y-3 font-sans">
              <div className="flex justify-between items-center border-b border-[#E1E4E8] pb-3">
                <span className="font-bold text-sm tracking-tight uppercase text-[#1A1C1E]">
                  CONTRATO DE RENTA DE MAQUINARIA
                </span>
                <span className="font-mono text-xs text-[#64748B]">{selectedContract.code}</span>
              </div>

              <div className="text-xs space-y-1 font-mono">
                <div>CLIENTE: <span className="font-bold">{selectedContract.clientName}</span></div>
                <div>TELÉFONO: <span className="font-bold">{selectedContract.clientPhone}</span></div>
                <div>DIRECCIÓN DE OBRA: <span className="font-bold">{selectedContract.deliveryAddress}</span></div>
                <div>PERÍODO: <span className="font-bold">{selectedContract.duration} {selectedContract.periodType}(s)</span></div>
                <div>MONTO TOTAL: <span className="font-bold">${selectedContract.totalAmount.toLocaleString()} MXN</span></div>
                <div>GARANTÍA REGISTRADA: <span className="font-bold text-emerald-700">${selectedContract.guaranteeDeposit.toLocaleString()} MXN</span></div>
              </div>

              <div className="border-t border-[#E1E4E8] pt-3 text-[10px] text-[#64748B] font-mono">
                ✓ Términos legales adjuntos. Incluye firma digital y reporte fotográfico de checklist.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
