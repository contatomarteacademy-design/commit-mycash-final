'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useNavigation } from '@/contexts/NavigationContext';
import DashboardPage from '@/app/page';
import GoalsPage from '@/app/goals/page';
import CardsPage from '@/app/cards/page';
import TransactionsPage from '@/app/transactions/page';
import ProfilePage from '@/app/profile/page';

export function LayoutWrapper() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeSection } = useNavigation();

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardPage />;
      case 'goals':
        return <GoalsPage />;
      case 'cards':
        return <CardsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[414px]'
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
}

