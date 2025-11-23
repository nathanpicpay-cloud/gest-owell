import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Quotes from './pages/Quotes';
import Production from './pages/Production';
import Catalog from './pages/Catalog';
import Videos from './pages/Videos';
import Schedule from './pages/Schedule';
import { getCurrentUser, login } from './services/db';
import { User } from './types';

// Simple Login Component
const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, pass)) {
      onLogin();
    } else {
      setError('Credenciais inválidas (Tente: admin@gestao.com / admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="https://i.imgur.com/gslPJZI.png" 
            alt="Gestão Wesley Oliveira" 
            className="h-20 w-auto object-contain mb-4" 
          />
          <h1 className="text-xl font-bold text-gray-800">Acesso Restrito</h1>
          <p className="text-gray-400 text-sm">Entre com suas credenciais</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="admin@gestao.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          <button type="submit" className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200">
            Acessar Sistema
          </button>
        </form>
        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Wesley Oliveira - Sistema Standalone
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setUser(getCurrentUser());
  };

  if (loading) return null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/quotes" element={user ? <Layout><Quotes /></Layout> : <Navigate to="/login" />} />
        <Route path="/production" element={user ? <Layout><Production /></Layout> : <Navigate to="/login" />} />
        <Route path="/catalog" element={user ? <Layout><Catalog /></Layout> : <Navigate to="/login" />} />
        <Route path="/schedule" element={user ? <Layout><Schedule /></Layout> : <Navigate to="/login" />} />
        <Route path="/videos" element={user ? <Layout><Videos /></Layout> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;