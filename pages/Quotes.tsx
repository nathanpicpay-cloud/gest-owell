import React, { useState, useEffect, useRef } from 'react';
import { getQuotes, getProducts, addQuote, updateQuoteStatus } from '../services/db';
import { Quote, Product, QuoteItem, QuoteStatus } from '../types';
import { Plus, Trash2, Share2, Printer, Search, X } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Orçamentos</h2>
        <button 
          onClick={() => setView('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Novo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-500">Cliente</th>
              <th className="p-4 text-sm font-medium text-gray-500 hidden md:table-cell">Data</th>
              <th className="p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="p-4 text-sm font-medium text-gray-500">Total</th>
              <th className="p-4 text-sm font-medium text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedQuote(quote); setView('details'); }}>
                <td className="p-4 font-medium">{quote.clientName}</td>
                <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quote.status === QuoteStatus.APPROVED ? 'bg-green-100 text-green-700' :
                    quote.status === QuoteStatus.IN_PRODUCTION ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">R$ {quote.total.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(quote); }}
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
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
        <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold">Novo Orçamento</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Selector */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Adicionar Produtos</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)} / {product.unit}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
            {products.length === 0 && <p>Nenhum produto cadastrado. Vá em Catálogo.</p>}
          </div>
        </div>

        {/* Right: Quote Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            <h3 className="font-semibold mb-2">Itens Selecionados</h3>
            {cart.length === 0 && <p className="text-gray-400 text-sm">O carrinho está vazio.</p>}
            <ul className="space-y-2">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="text-sm">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">R$ {item.total.toFixed(2)}</span>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-auto">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total</span>
              <span>R$ {cart.reduce((sum, i) => sum + i.total, 0).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleSaveQuote}
              disabled={!clientName || cart.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold">Detalhes do Orçamento</h2>
          <div className="ml-auto flex gap-2">
             <button 
              onClick={() => handleShare(selectedQuote)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Share2 size={18} /> Compartilhar
            </button>
            <button 
              onClick={handlePrint}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Printer size={18} /> Imprimir PDF
            </button>
          </div>
        </div>

        {/* Status Control */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 no-print">
          <p className="w-full text-sm text-gray-500 mb-2">Alterar Status:</p>
          {Object.values(QuoteStatus).map(status => (
            <button
              key={status}
              onClick={() => {
                updateQuoteStatus(selectedQuote.id, status);
                loadData();
                setSelectedQuote({...selectedQuote, status});
              }}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedQuote.status === status 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none">
          <div className="flex justify-between items-start mb-8 border-b pb-8">
            <div className="flex flex-col">
              <img 
                src="https://i.imgur.com/gslPJZI.png" 
                alt="Gestão Wesley Oliveira" 
                className="h-20 w-auto object-contain mb-4 self-start" 
              />
              <p className="text-gray-500 font-medium">Comunicação Visual</p>
              <p className="text-sm text-gray-400 mt-2">Rua Exemplo, 123 - Centro</p>
              <p className="text-sm text-gray-400">contato@exemplo.com | (11) 99999-9999</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-700">Orçamento #{selectedQuote.id}</h2>
              <p className="text-gray-500">Data: {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-500">Validade: {new Date(selectedQuote.validUntil).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">Cliente</h3>
            <p className="text-xl font-medium text-slate-800">{selectedQuote.clientName}</p>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-medium">Descrição</th>
                <th className="text-center py-2 text-gray-500 font-medium">Qtd</th>
                <th className="text-right py-2 text-gray-500 font-medium">Unitário</th>
                <th className="text-right py-2 text-gray-500 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedQuote.items.map(item => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-3">{item.productName}</td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">R$ {item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-3 font-medium">R$ {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-gray-500 mb-1">Total a Pagar</p>
              <p className="text-3xl font-bold text-slate-800">R$ {selectedQuote.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-400 text-xs">
            <p>Este documento não possui valor fiscal.</p>
            <p>Gerado via Gestão Wesley Oliveira (App Standalone).</p>
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