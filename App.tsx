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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gestão Wesley</h1>
          <p className="text-gray-500">Login do Sistema</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@gestao.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Entrar
          </button>
        </form>
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