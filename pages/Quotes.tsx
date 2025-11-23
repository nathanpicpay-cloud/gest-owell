import React, { useState, useEffect, useRef } from 'react';
import { getQuotes, getProducts, addQuote, updateQuoteStatus } from '../services/db';
import { Quote, Product, QuoteItem, QuoteStatus } from '../types';
import { Plus, Trash2, Share2, Printer, X, Search } from 'lucide-react';

const Quotes: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [cart, setCart] = useState<QuoteItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuotes(getQuotes());
    setProducts(getProducts());
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice } 
          : item
      ));
    } else {
      setCart([...cart, {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleSaveQuote = () => {
    if (!clientName || cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const newQuote: Quote = {
      id: Date.now().toString(),
      clientName,
      items: cart,
      total,
      status: QuoteStatus.OPEN,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days
    };

    addQuote(newQuote);
    loadData();
    setView('list');
    setClientName('');
    setCart([]);
  };

  const handleShare = async (quote: Quote) => {
    const text = `Olá ${quote.clientName}, aqui está seu orçamento #${quote.id} no valor de R$ ${quote.total.toFixed(2)}. Itens: ${quote.items.map(i => i.productName).join(', ')}.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Orçamento #${quote.id}`,
          text: text,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      // Fallback
      alert("Compartilhamento não suportado neste navegador. Texto copiado:\n\n" + text);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Orçamentos</h2>
           <p className="text-gray-500 text-sm">Gerencie propostas e vendas</p>
        </div>
        
        <button 
          onClick={() => setView('create')}
          className="bg-amber-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100 font-medium"
        >
          <Plus size={20} /> Criar Novo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-sm font-semibold text-gray-500">Cliente</th>
              <th className="p-5 text-sm font-semibold text-gray-500 hidden md:table-cell">Data</th>
              <th className="p-5 text-sm font-semibold text-gray-500">Status</th>
              <th className="p-5 text-sm font-semibold text-gray-500">Total</th>
              <th className="p-5 text-sm font-semibold text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => { setSelectedQuote(quote); setView('details'); }}>
                <td className="p-5 font-medium text-gray-800">{quote.clientName}</td>
                <td className="p-5 text-sm text-gray-500 hidden md:table-cell">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    quote.status === QuoteStatus.APPROVED ? 'bg-green-100 text-green-700' :
                    quote.status === QuoteStatus.IN_PRODUCTION ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="p-5 font-bold text-gray-700">R$ {quote.total.toFixed(2)}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(quote); }}
                      className="p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-500 rounded-lg transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-800 bg-white p-2 rounded-lg border border-gray-100">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Novo Orçamento</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Selector */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Adicionar Produtos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)} / {product.unit}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-gray-50 text-gray-600 p-2.5 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-400 italic">Nenhum produto cadastrado. Vá em Catálogo.</p>}
          </div>
        </div>

        {/* Right: Quote Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="Nome do cliente ou empresa"
            />
          </div>

          <div className="flex-1 overflow-y-auto mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Itens Selecionados</h3>
            {cart.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-gray-400 text-sm">O carrinho está vazio.</p>
                </div>
            )}
            <ul className="space-y-3">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-700">R$ {item.total.toFixed(2)}</span>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-auto">
            <div className="flex justify-between text-xl font-bold mb-6 text-gray-800">
              <span>Total</span>
              <span>R$ {cart.reduce((sum, i) => sum + i.total, 0).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleSaveQuote}
              disabled={!clientName || cart.length === 0}
              className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-100 transition-all"
            >
              Finalizar Orçamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedQuote) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 no-print">
          <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-800 bg-white p-2 rounded-lg border border-gray-100">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Detalhes</h2>
          <div className="ml-auto flex gap-2">
             <button 
              onClick={() => handleShare(selectedQuote)}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-100 font-medium"
            >
              <Share2 size={18} /> Compartilhar
            </button>
            <button 
              onClick={handlePrint}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 font-medium"
            >
              <Printer size={18} /> Imprimir PDF
            </button>
          </div>
        </div>

        {/* Status Control */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 no-print shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Status Atual:</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(QuoteStatus).map(status => (
                <button
                key={status}
                onClick={() => {
                    updateQuoteStatus(selectedQuote.id, status);
                    loadData();
                    setSelectedQuote({...selectedQuote, status});
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedQuote.status === status 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                >
                {status}
                </button>
            ))}
          </div>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:rounded-none max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-10">
            <div className="flex flex-col">
              <img 
                src="https://i.imgur.com/gslPJZI.png" 
                alt="Gestão Wesley Oliveira" 
                className="h-24 w-auto object-contain mb-6 self-start" 
              />
              <p className="text-gray-800 font-bold">Comunicação Visual Premium</p>
              <p className="text-sm text-gray-500 mt-2">Av. Paulista, 1000 - São Paulo, SP</p>
              <p className="text-sm text-gray-500">contato@wesleyoliveira.com | (11) 99999-9999</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-amber-500">Orçamento</h2>
              <p className="text-lg font-semibold text-gray-700">#{selectedQuote.id}</p>
              <div className="mt-4 space-y-1">
                 <p className="text-sm text-gray-500">Data de Emissão: <span className="text-gray-800 font-medium">{new Date(selectedQuote.createdAt).toLocaleDateString()}</span></p>
                 <p className="text-sm text-gray-500">Válido até: <span className="text-gray-800 font-medium">{new Date(selectedQuote.validUntil).toLocaleDateString()}</span></p>
              </div>
            </div>
          </div>

          <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dados do Cliente</h3>
            <p className="text-2xl font-bold text-gray-800">{selectedQuote.clientName}</p>
          </div>

          <table className="w-full mb-10">
            <thead>
              <tr className="border-b-2 border-amber-500">
                <th className="text-left py-3 text-amber-600 font-bold uppercase text-sm">Descrição</th>
                <th className="text-center py-3 text-amber-600 font-bold uppercase text-sm">Qtd</th>
                <th className="text-right py-3 text-amber-600 font-bold uppercase text-sm">Unitário</th>
                <th className="text-right py-3 text-amber-600 font-bold uppercase text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedQuote.items.map(item => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-700">{item.productName}</td>
                  <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-4 text-gray-600">R$ {item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-4 font-bold text-gray-800">R$ {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <div className="text-right">
              <p className="text-gray-500 mb-1 text-sm">Valor Total</p>
              <p className="text-4xl font-bold text-gray-900">R$ {selectedQuote.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
            <p className="mb-1">Este documento é um orçamento e não vale como nota fiscal.</p>
            <p>Gerado via Sistema Wesley Oliveira.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {view === 'list' && renderList()}
      {view === 'create' && renderCreate()}
      {view === 'details' && renderDetails()}
    </div>
  );
};

export default Quotes;