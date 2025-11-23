import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Printer, 
  Package, 
  Video, 
  LogOut, 
  UserCircle,
  Calendar,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Theme State Management
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/quotes', label: 'Orçamentos', icon: FileText },
    { path: '/production', label: 'Produção', icon: Printer },
    { path: '/catalog', label: 'Catálogo', icon: Package },
    { path: '/schedule', label: 'Agenda', icon: Calendar },
    { path: '/videos', label: 'Tutoriais', icon: Video },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Desktop Sidebar - Modern & Elegant */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-zinc-800 sticky top-0 h-screen z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-colors duration-300">
        
        {/* Logo Section */}
        <div className="px-8 py-10 flex flex-col justify-center items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <img 
              src="https://i.imgur.com/gslPJZI.png" 
              alt="Gestão Wesley Oliveira" 
              className="relative h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm dark:brightness-0 dark:invert" 
            />
          </div>
          <p className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-400 dark:text-zinc-500 uppercase">Gestão Premium</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="mb-2 px-4 text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Menu Principal</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium text-sm relative overflow-hidden ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 translate-x-1'
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <item.icon 
                size={20} 
                strokeWidth={2}
                className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} 
              />
              <span className="relative z-10">{item.label}</span>
              
              {/* Active Indicator Dot */}
              {isActive(item.path) && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>
        
        {/* Footer Actions (Theme & Logout) */}
        <div className="p-4 mx-4 mb-4 mt-auto border-t border-slate-100 dark:border-zinc-800/50 space-y-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group border border-slate-100 dark:border-zinc-700/50"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              {theme === 'light' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-400" />}
              <span>{theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </div>
            <div className={`w-8 h-4 bg-slate-200 dark:bg-zinc-700 rounded-full relative transition-colors duration-300`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-500 dark:text-zinc-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 text-sm font-medium group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Mobile Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
          <img 
            src="https://i.imgur.com/gslPJZI.png" 
            alt="Logo" 
            className="h-9 w-auto object-contain dark:brightness-0 dark:invert" 
          />
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
               {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 right-4 left-4 bg-white dark:bg-zinc-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-800 rounded-2xl p-2 z-40 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100 dark:border-zinc-800 mb-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">Menu Rápido</p>
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors ${
                       isActive(item.path) 
                       ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                       : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-slate-100 dark:border-zinc-800 mt-2 pt-2">
                   <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-medium"
                  >
                    <LogOut size={18} />
                    Sair do Sistema
                  </button>
                </div>
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pb-28 md:pb-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav (Glassmorphism) */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-700/50 shadow-2xl shadow-slate-300/30 dark:shadow-black/30 rounded-2xl flex justify-between items-center z-30 px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
             const active = isActive(item.path);
             return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl flex-1 transition-all duration-300 ${
                  active 
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 transform -translate-y-2 shadow-lg shadow-amber-500/10' 
                  : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 2.5 : 2} className="transition-transform duration-300" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;