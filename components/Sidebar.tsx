'use client';

import { FiHome, FiTarget, FiCreditCard, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { activeSection, setActiveSection } = useNavigation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: FiHome },
    { id: 'goals', label: 'Objetivos', icon: FiTarget },
    { id: 'cards', label: 'Cartões', icon: FiCreditCard },
    { id: 'transactions', label: 'Transações', icon: FiDollarSign },
  ];

  return (
    <Tooltip.Provider>
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40',
          isCollapsed ? 'w-20' : 'w-[414px]'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="mb-12 flex-shrink-0">
              {isCollapsed ? (
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">mycash+</span>
                </div>
              )}
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const button = (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={cn(
                      'w-full flex items-center gap-3 px-6 py-4 rounded-full transition-colors',
                      isCollapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-gray-100'
                    )}
                    aria-label={item.label}
                  >
                    <Icon className={cn('w-6 h-6 flex-shrink-0', isActive && !isCollapsed ? 'text-white' : '')} />
                    {!isCollapsed && <span className="text-lg font-semibold">{item.label}</span>}
                  </button>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip.Root key={item.id}>
                      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-foreground text-white px-3 py-2 rounded-lg text-sm z-50"
                          side="right"
                          sideOffset={8}
                        >
                          {item.label}
                          <Tooltip.Arrow className="fill-foreground" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                }

                return button;
              })}
            </nav>

            {/* Profile & Logout */}
            <div className="space-y-2 flex-shrink-0">
              <button
                onClick={() => setActiveSection('profile')}
                className={cn(
                  'w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-gray-50 transition-colors',
                  isCollapsed && 'justify-center',
                  activeSection === 'profile' && 'bg-gray-100'
                )}
                aria-label="Ir para perfil"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-foreground truncate">
                      {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-3 px-6 py-4 rounded-full text-red hover:bg-red/10 transition-colors focus:outline-none focus:ring-2 focus:ring-lime',
                  isCollapsed && 'justify-center'
                )}
                aria-label="Sair"
              >
                <FiLogOut className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="text-lg font-semibold">Sair</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute top-8 -right-4 w-8 h-8 bg-card border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 z-50"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <span className="text-foreground">{isCollapsed ? '→' : '←'}</span>
        </button>
      </aside>
    </Tooltip.Provider>
  );
}

