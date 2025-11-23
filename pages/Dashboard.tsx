import React, { useEffect, useState } from 'react';
import { getQuotes } from '../services/db';
import { Quote, QuoteStatus } from '../types';
import { DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';
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

  // Prepare chart data (Simulated Monthly Data based on current quotes logic)
  const chartData = [
    { name: 'Jan', total: totalRevenue * 0.2 },
    { name: 'Fev', total: totalRevenue * 0.3 },
    { name: 'Mar', total: totalRevenue * 0.5 }, // Just distributing the mock total for visual
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Olá, Wesley</h2>
        <p className="text-gray-500">Resumo da sua gráfica hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Faturamento (Aprovados)" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Orçamentos Abertos" 
          value={openQuotesCount} 
          icon={FileText} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Em Produção" 
          value={productionCount} 
          icon={AlertCircle} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Faturamento Recente</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {quotes.slice(0, 4).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    quote.status === QuoteStatus.APPROVED ? 'bg-green-500' : 
                    quote.status === QuoteStatus.IN_PRODUCTION ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{quote.clientName}</p>
                    <p className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">R$ {quote.total.toFixed(2)}</span>
              </div>
            ))}
            {quotes.length === 0 && <p className="text-gray-400 text-sm">Nenhuma atividade recente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;