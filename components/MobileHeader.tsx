'use client';

import { useState } from 'react';
import { FiHome, FiTarget, FiCreditCard, FiDollarSign, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

export function MobileHeader() {
  const { activeSection, setActiveSection } = useNavigation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
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

  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId as any);
    setMenuOpen(false);
  };

  return (
    <header 
      className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4"
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center" aria-hidden="true">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-lg font-bold text-foreground">mycash+</span>
      </div>

      {/* Avatar Button */}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Trigger asChild>
          <button
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Abrir menu de navegação"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="text-sm font-semibold text-gray-700" aria-hidden="true">
              {user?.email?.[0].toUpperCase() || 'U'}
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-0 left-0 right-0 bg-card z-50 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Menu</h2>
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
                  aria-label="Fechar menu"
                >
                  <FiX className="w-6 h-6 text-foreground" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto" role="navigation" aria-label="Menu principal">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lime ${
                      isActive
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-gray-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Navegar para ${item.label}`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                    <span className="text-lg font-semibold">{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={() => handleMenuItemClick('profile')}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lime ${
                    activeSection === 'profile'
                      ? 'bg-foreground text-white'
                      : 'text-foreground hover:bg-gray-100'
                  }`}
                  aria-current={activeSection === 'profile' ? 'page' : undefined}
                >
                  <FiUser className="w-6 h-6" aria-hidden="true" />
                  <span className="text-lg font-semibold">Perfil</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-full text-red hover:bg-red/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red mt-2"
                  aria-label="Sair da aplicação"
                >
                  <FiLogOut className="w-6 h-6" aria-hidden="true" />
                  <span className="text-lg font-semibold">Sair</span>
                </button>
              </div>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}

