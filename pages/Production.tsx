import React, { useState, useEffect } from 'react';
import { getQuotes, updateQuoteStatus } from '../services/db';
import { Quote, QuoteStatus } from '../types';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';

const Production: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Filter only quotes that are relevant to production
    const allQuotes = getQuotes();
    const productionQuotes = allQuotes.filter(q => 
      q.status === QuoteStatus.APPROVED || 
      q.status === QuoteStatus.IN_PRODUCTION || 
      q.status === QuoteStatus.COMPLETED
    );
    setQuotes(productionQuotes);
  }, []);

  const handleStatusChange = (id: string, newStatus: QuoteStatus) => {
    updateQuoteStatus(id, newStatus);
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  const KanbanColumn = ({ title, status, icon: Icon, color, items }: any) => (
    <div className="flex-1 min-w-[300px] bg-gray-100 rounded-xl p-4">
      <div className={`flex items-center gap-2 mb-4 ${color} font-bold`}>
        <Icon size={20} />
        <h3>{title} ({items.length})</h3>
      </div>
      <div className="space-y-3">
        {items.map((quote: Quote) => (
          <div key={quote.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-400">#{quote.id}</span>
              <span className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{quote.clientName}</h4>
            <div className="text-sm text-gray-600 mb-3">
              {quote.items.map(i => (
                <div key={i.id}>• {i.quantity}x {i.productName}</div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-2">
              {status === QuoteStatus.APPROVED && (
                <button 
                  onClick={() => handleStatusChange(quote.id, QuoteStatus.IN_PRODUCTION)}
                  className="flex-1 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700"
                >
                  Iniciar Produção
                </button>
              )}
              {status === QuoteStatus.IN_PRODUCTION && (
                <button 
                  onClick={() => handleStatusChange(quote.id, QuoteStatus.COMPLETED)}
                  className="flex-1 bg-green-600 text-white text-xs py-2 rounded hover:bg-green-700"
                >
                  Concluir
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            Nenhum item nesta etapa.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Esteira de Produção</h2>
        <p className="text-gray-500">Gerencie o status dos pedidos aprovados.</p>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          <KanbanColumn 
            title="Aguardando" 
            status={QuoteStatus.APPROVED} 
            icon={Clock} 
            color="text-blue-600"
            items={quotes.filter(q => q.status === QuoteStatus.APPROVED)}
          />
          <KanbanColumn 
            title="Em Produção" 
            status={QuoteStatus.IN_PRODUCTION} 
            icon={AlertTriangle} 
            color="text-orange-500"
            items={quotes.filter(q => q.status === QuoteStatus.IN_PRODUCTION)}
          />
          <KanbanColumn 
            title="Pronto / Entregue" 
            status={QuoteStatus.COMPLETED} 
            icon={CheckSquare} 
            color="text-green-600"
            items={quotes.filter(q => q.status === QuoteStatus.COMPLETED)}
          />
        </div>
      </div>
    </div>
  );
};

export default Production;