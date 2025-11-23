import React, { useState, useEffect } from 'react';
import { getProducts, addProduct } from '../services/db';
import { Product } from '../types';
import { Plus, Tag } from 'lucide-react';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product State
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newUnit, setNewUnit] = useState('unid');

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newName,
      price: parseFloat(newPrice),
      cost: parseFloat(newCost),
      unit: newUnit
    };
    addProduct(product);
    setProducts(getProducts());
    setIsModalOpen(false);
    // Reset
    setNewName('');
    setNewPrice('');
    setNewCost('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Catálogo de Produtos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900"
        >
          <Plus size={20} /> Novo Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Tag size={20} />
              </div>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                {product.unit}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
            <div className="mt-auto pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Custo</p>
                <p className="font-medium text-gray-600">R$ {product.cost.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Venda</p>
                <p className="font-bold text-green-600 text-lg">R$ {product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Adicionar Produto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço Venda</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded mt-1" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Custo</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded mt-1" value={newCost} onChange={e => setNewCost(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidade</label>
                <select className="w-full border p-2 rounded mt-1" value={newUnit} onChange={e => setNewUnit(e.target.value)}>
                  <option value="unid">Unidade (unid)</option>
                  <option value="m²">Metro Quadrado (m²)</option>
                  <option value="ml">Metro Linear (ml)</option>
                  <option value="hora">Hora (h)</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded hover:bg-gray-200">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;