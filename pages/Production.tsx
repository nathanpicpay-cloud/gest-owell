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
  MoreHorizontal,
  MessageSquare,
  X,
  Send,
  Plus
} from 'lucide-react';

// Configuração das Colunas do Kanban
const COLUMNS = [
  { id: ProductionStage.WAITING_ART, label: 'Aguardando Arte', icon: Palette, color: 'border-l-4 border-gray-400' },
  { id: ProductionStage.ART_IN_PROGRESS, label: 'Em Criação', icon: Monitor, color: 'border-l-4 border-blue-400' },
  { id: ProductionStage.CLIENT_APPROVAL, label: 'Aprovação Cliente', icon: CheckCircle2, color: 'border-l-4 border-amber-400' },
  { id: ProductionStage.PRINT_QUEUE, label: 'Fila de Impressão', icon: Printer, color: 'border-l-4 border-purple-400' },
  { id: ProductionStage.FINISHING, label: 'Acabamento', icon: Scissors, color: 'border-l-4 border-orange-400' },
  { id: ProductionStage.READY, label: 'Pronto / Entrega', icon: PackageCheck, color: 'border-l-4 border-green-500' },
];

const PRIORITY_COLORS = {
  [Priority.LOW]: 'bg-gray-100 text-gray-600',
  [Priority.NORMAL]: 'bg-blue-50 text-blue-700',
  [Priority.HIGH]: 'bg-amber-50 text-amber-700',
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
    const updated = getProductionOrders().find(o => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      
      {/* Header da Página */}
      <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-200 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quadro de Produção</h2>
          <p className="text-sm text-gray-500">Fluxo de trabalho: da Arte Final até a Entrega</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden md:inline mr-2">Arraste ou clique para mover</span>
          <button className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200 flex items-center gap-2">
            <Plus size={16} /> Nova O.S.
          </button>
        </div>
      </div>

      {/* Board Kanban Horizontal */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="flex gap-6 h-full min-w-max">
          
          {COLUMNS.map((col) => {
            const colOrders = orders.filter(o => o.stage === col.id);
            return (
              <div key={col.id} className="w-80 flex flex-col h-full">
                {/* Cabeçalho da Coluna */}
                <div className={`flex items-center gap-2 mb-4 px-1 ${col.id === ProductionStage.READY ? 'text-green-700' : 'text-gray-600'}`}>
                  <col.icon size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wide">{col.label}</h3>
                  <span className="bg-white text-gray-600 border border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto shadow-sm">
                    {colOrders.length}
                  </span>
                </div>

                {/* Área dos Cards */}
                <div className="flex-1 bg-gray-100/50 rounded-2xl p-2 overflow-y-auto space-y-3 border border-gray-200/50">
                  {colOrders.map(order => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group relative ${col.color}`}
                    >
                      {/* Priority Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${PRIORITY_COLORS[order.priority]}`}>
                          {order.priority}
                        </span>
                        <MoreHorizontal size={16} className="text-gray-300 group-hover:text-gray-500" />
                      </div>

                      {/* Content */}
                      <h4 className="font-bold text-gray-800 leading-snug mb-1">{order.title}</h4>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{order.clientName}</p>

                      {/* Tags & Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                        <div className="flex items-center gap-1 text-gray-400 text-xs" title="Prazo">
                          <Calendar size={12} className={new Date(order.deadline) < new Date() ? 'text-red-500' : ''} />
                          <span className={new Date(order.deadline) < new Date() ? 'text-red-500 font-medium' : ''}>
                            {formatDate(order.deadline)}
                          </span>
                        </div>
                        {order.notes.length > 0 && (
                          <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-50 px-1.5 py-0.5 rounded">
                            <MessageSquare size={12} />
                            <span>{order.notes.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-xs font-medium">
                      Sem pedidos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordem de Serviço</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 bg-white border border-gray-200 p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Main Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedOrder.title}</h3>
                <p className="text-gray-500 font-medium text-lg">{selectedOrder.clientName}</p>
                <div className="mt-4 flex gap-3">
                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${PRIORITY_COLORS[selectedOrder.priority]}`}>
                    {selectedOrder.priority}
                   </div>
                   <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    <Calendar size={12} className="mr-1.5" /> {new Date(selectedOrder.deadline).toLocaleDateString()}
                   </div>
                </div>
              </div>

              {/* Mover Etapa */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mover para etapa</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMNS.map(col => (
                    <button
                      key={col.id}
                      onClick={() => handleStageChange(selectedOrder.id, col.id)}
                      disabled={selectedOrder.stage === col.id}
                      className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all font-medium ${
                        selectedOrder.stage === col.id 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição e Itens */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Especificações</h4>
                <div className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  {selectedOrder.description}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedOrder.items.map((item, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Histórico / Notas */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <MessageSquare size={16} /> Comentários
                </h4>
                <div className="space-y-4 mb-4 pl-4 border-l-2 border-gray-100">
                  {selectedOrder.notes.map(note => (
                    <div key={note.id} className="relative">
                       <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="bg-gray-50 p-3 rounded-xl text-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-700 text-xs">{note.author}</span>
                          <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600">{note.text}</p>
                      </div>
                    </div>
                  ))}
                  {selectedOrder.notes.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Nenhum comentário registrado.</p>
                  )}
                </div>
                
                {/* Input Nota */}
                <div className="relative mt-4">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="Escreva uma observação interna..."
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-sm transition-all"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="absolute right-2 top-2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    <Send size={16} />
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