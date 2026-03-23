
import React from 'react';
import { AppRole } from '../types';
import { Store, ShoppingCart, LayoutDashboard, Menu, X, Lightbulb, MessageSquareWarning, PlayCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: AppRole.IDEA_PLAN, label: 'Project Plan', icon: Lightbulb },
    { id: AppRole.DEMO, label: 'System Demo', icon: PlayCircle },
    { id: AppRole.SHOP_OWNER, label: 'Shop Owner', icon: Store },
    { id: AppRole.CUSTOMER, label: 'Customer', icon: ShoppingCart },
    { id: AppRole.COMPLAINTS, label: 'Complaints Hub', icon: MessageSquareWarning },
    { id: AppRole.ADMIN, label: 'Admin Panel', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Store className="w-8 h-8" />
              <h1 className="text-xl font-bold tracking-tight">RetailReliability AI</h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onRoleChange(item.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-all text-sm font-medium ${
                    activeRole === item.id 
                      ? 'bg-indigo-800 text-white shadow-inner' 
                      : 'hover:bg-indigo-600'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-800 p-4 border-t border-indigo-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onRoleChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 mb-2 rounded-md ${
                  activeRole === item.id ? 'bg-indigo-900' : 'hover:bg-indigo-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        <p>© 2024 RetailReliability AI. Behavioral Deep Learning for Offline Inventory.</p>
      </footer>
    </div>
  );
};

export default Layout;
