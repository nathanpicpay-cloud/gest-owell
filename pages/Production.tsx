import React, { useState, useEffect } from 'react';
import { getProductionOrders, updateOrderStage, addOrderNote } from '../services/db';
import { ProductionOrder, ProductionStage, Priority } from '../types';
import { 
  Palette, 
  Monitor, 
  CheckCircle2, 
  Printer, 
  Scissors, 
  PackageCheck, 
  Calendar, 
  AlertCircle,
  MoreHorizontal,
  MessageSquare,
  X,
  Send
} from 'lucide-react';

// Configuração das Colunas do Kanban
const COLUMNS = [
  { id: ProductionStage.WAITING_ART, label: 'Aguardando Arte', icon: Palette, color: 'border-l-4 border-gray-400' },
  { id: ProductionStage.ART_IN_PROGRESS, label: 'Em Criação', icon: Monitor, color: 'border-l-4 border-blue-400' },
  { id: ProductionStage.CLIENT_APPROVAL, label: 'Aprovação Cliente', icon: CheckCircle2, color: 'border-l-4 border-yellow-400' },
  { id: ProductionStage.PRINT_QUEUE, label: 'Fila de Impressão', icon: Printer, color: 'border-l-4 border-purple-400' },
  { id: ProductionStage.FINISHING, label: 'Acabamento', icon: Scissors, color: 'border-l-4 border-orange-400' },
  { id: ProductionStage.READY, label: 'Pronto / Entrega', icon: PackageCheck, color: 'border-l-4 border-green-500' },
];

const PRIORITY_COLORS = {
  [Priority.LOW]: 'bg-gray-100 text-gray-600',
  [Priority.NORMAL]: 'bg-blue-50 text-blue-700',
  [Priority.HIGH]: 'bg-orange-50 text-orange-700',
  [Priority.URGENT]: 'bg-red-50 text-red-700 border border-red-100',
};

const Production: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(getProductionOrders());
  };

  const handleStageChange = (id: string, newStage: ProductionStage) => {
    updateOrderStage(id, newStage);
    loadOrders();
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? {...prev, stage: newStage} : null);
    }
  };

  const handleAddNote = () => {
    if (!selectedOrder || !noteInput.trim()) return;
    addOrderNote(selectedOrder.id, noteInput, 'Eu');
    setNoteInput('');
    loadOrders();
    // Refresh selected order to show new note
    const updated = getProductionOrders().find(o => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      
      {/* Header da Página */}
      <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-200 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quadro de Produção</h2>
          <p className="text-sm text-slate-500">Fluxo de trabalho: da Arte Final até a Entrega</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden md:inline">Arraste ou clique para mover (Simulado)</span>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
            + Nova O.S.
          </button>
        </div>
      </div>

      {/* Board Kanban Horizontal */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full min-w-max">
          
          {COLUMNS.map((col) => {
            const colOrders = orders.filter(o => o.stage === col.id);
            return (
              <div key={col.id} className="w-80 flex flex-col h-full">
                {/* Cabeçalho da Coluna */}
                <div className={`flex items-center gap-2 mb-3 px-1 ${col.id === ProductionStage.READY ? 'text-green-700' : 'text-slate-600'}`}>
                  <col.icon size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wide">{col.label}</h3>
                  <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">
                    {colOrders.length}
                  </span>
                </div>

                {/* Área dos Cards */}
                <div className="flex-1 bg-slate-100/50 rounded-xl p-2 overflow-y-auto space-y-3 border border-slate-200/60">
                  {colOrders.map(order => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative ${col.color}`}
                    >
                      {/* Priority Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${PRIORITY_COLORS[order.priority]}`}>
                          {order.priority}
                        </span>
                        <MoreHorizontal size={16} className="text-gray-300 group-hover:text-gray-500" />
                      </div>

                      {/* Content */}
                      <h4 className="font-semibold text-slate-800 leading-snug mb-1">{order.title}</h4>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{order.clientName}</p>

                      {/* Tags & Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                        <div className="flex items-center gap-1 text-gray-400 text-xs" title="Prazo">
                          <Calendar size={12} className={new Date(order.deadline) < new Date() ? 'text-red-500' : ''} />
                          <span className={new Date(order.deadline) < new Date() ? 'text-red-500 font-medium' : ''}>
                            {formatDate(order.deadline)}
                          </span>
                        </div>
                        {order.notes.length > 0 && (
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <MessageSquare size={12} />
                            <span>{order.notes.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes (Slide Over) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordem de Serviço</span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Main Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedOrder.title}</h3>
                <p className="text-slate-500 font-medium">{selectedOrder.clientName}</p>
                <div className="mt-4 flex gap-3">
                   <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[selectedOrder.priority]}`}>
                    {selectedOrder.priority}
                   </div>
                   <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Calendar size={12} className="mr-1" /> {new Date(selectedOrder.deadline).toLocaleDateString()}
                   </div>
                </div>
              </div>

              {/* Mover Etapa */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mover para etapa</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMNS.map(col => (
                    <button
                      key={col.id}
                      onClick={() => handleStageChange(selectedOrder.id, col.id)}
                      disabled={selectedOrder.stage === col.id}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        selectedOrder.stage === col.id 
                        ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-200' 
                        : 'bg-white text-slate-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição e Itens */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Descrição Técnica</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-white border border-gray-100 p-3 rounded-lg">
                  {selectedOrder.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedOrder.items.map((item, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Histórico / Notas */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} /> Comentários & Histórico
                </h4>
                <div className="space-y-4 mb-4">
                  {selectedOrder.notes.map(note => (
                    <div key={note.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {note.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-r-xl rounded-bl-xl text-sm border border-gray-100 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-700 text-xs">{note.author}</span>
                          <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-600">{note.text}</p>
                      </div>
                    </div>
                  ))}
                  {selectedOrder.notes.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Nenhum comentário ainda.</p>
                  )}
                </div>
                
                {/* Input Nota */}
                <div className="relative">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="Escreva uma observação..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Production;