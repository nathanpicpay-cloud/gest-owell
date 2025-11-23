import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Printer, 
  Package, 
  Video, 
  LogOut, 
  UserCircle,
  Calendar
} from 'lucide-react';
import { logout } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar (Theme: White/Clean with Logo) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen z-10 shadow-sm">
        <div className="p-8 flex justify-center items-center border-b border-gray-100 h-24">
          <img 
            src="https://i.imgur.com/gslPJZI.png" 
            alt="Gestão Wesley Oliveira" 
            className="h-14 w-auto object-contain transition-transform hover:scale-105" 
          />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive(item.path)
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-amber-600'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : ''} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <img 
            src="https://i.imgur.com/gslPJZI.png" 
            alt="Logo" 
            className="h-8 w-auto object-contain" 
          />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
            <UserCircle size={28} />
          </button>
        </header>

        {/* Mobile Menu Overlay (Logout) */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-14 right-4 bg-white shadow-xl border border-gray-100 rounded-xl p-2 z-30 w-48 animate-in fade-in slide-in-from-top-2">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                >
                    <LogOut size={16} />
                    Sair do Sistema
                </button>
            </div>
        )}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center z-20 pb-safe safe-area-bottom">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 flex-1 transition-colors ${
                isActive(item.path) ? 'text-amber-500' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;