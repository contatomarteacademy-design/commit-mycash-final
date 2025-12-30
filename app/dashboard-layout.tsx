'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { useNavigation } from '@/contexts/NavigationContext';
import DashboardContent from '@/app/page';
import GoalsPage from '@/app/goals/page';
import CardsPage from '@/app/cards/page';
import TransactionsPage from '@/app/transactions/page';
import ProfilePage from '@/app/profile/page';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeSection } = useNavigation();

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardContent />;
      case 'goals':
        return <GoalsPage />;
      case 'cards':
        return <CardsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[414px]'
        } pt-16 lg:pt-0`}
      >
        {renderContent()}
      </main>
    </div>
  );
}

