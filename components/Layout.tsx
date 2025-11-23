import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Printer, 
  Package, 
  Video, 
  LogOut, 
  Menu,
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">Gestão Wesley</h1>
          <p className="text-xs text-slate-400 mt-1">Sistema Offline v1.0</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h1 className="font-bold text-slate-800">Gestão Wesley</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            <UserCircle size={28} />
          </button>
        </header>

        {/* Mobile Menu Overlay (Logout) */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-14 right-4 bg-white shadow-lg border rounded-lg p-2 z-30 w-48">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center z-20 pb-safe">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 flex-1 ${
                isActive(item.path) ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;