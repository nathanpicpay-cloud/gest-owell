import React, { useEffect, useState } from 'react';
import { getQuotes } from '../services/db';
import { Quote, QuoteStatus } from '../types';
import { DollarSign, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const totalRevenue = quotes
    .filter(q => q.status === QuoteStatus.COMPLETED || q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.IN_PRODUCTION)
    .reduce((sum, q) => sum + q.total, 0);

  const openQuotesCount = quotes.filter(q => q.status === QuoteStatus.OPEN || q.status === QuoteStatus.DRAFT).length;
  const productionCount = quotes.filter(q => q.status === QuoteStatus.IN_PRODUCTION).length;

  // Prepare chart data
  const chartData = [
    { name: 'Jan', total: totalRevenue * 0.2 },
    { name: 'Fev', total: totalRevenue * 0.3 },
    { name: 'Mar', total: totalRevenue * 0.5 }, 
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, iconColor }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} className={iconColor} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 mt-1">Visão geral do seu negócio hoje.</p>
        </div>
        <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Faturamento (Aprovados)" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          colorClass="bg-green-50" 
          iconColor="text-green-600"
        />
        <StatCard 
          title="Orçamentos Abertos" 
          value={openQuotesCount} 
          icon={FileText} 
          colorClass="bg-blue-50" 
          iconColor="text-blue-600"
        />
        <StatCard 
          title="Em Produção" 
          value={productionCount} 
          icon={AlertCircle} 
          colorClass="bg-amber-50" 
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Faturamento Recente</h3>
            <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Atividades Recentes</h3>
          <div className="space-y-4">
            {quotes.slice(0, 4).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2 px-4">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    quote.status === QuoteStatus.APPROVED ? 'bg-green-500 shadow-lg shadow-green-200' : 
                    quote.status === QuoteStatus.IN_PRODUCTION ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-800">{quote.clientName}</p>
                    <p className="text-xs text-gray-400 font-medium">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700">R$ {quote.total.toFixed(2)}</span>
              </div>
            ))}
            {quotes.length === 0 && <p className="text-gray-400 text-sm italic">Nenhuma atividade recente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;