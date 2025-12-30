'use client';

import { GoalsSection } from '@/components/GoalsSection';

export default function GoalsPage() {
  return (
    <div className="w-full max-w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Objetivos</h1>
        <p className="text-gray-500 mt-2">Gerencie seus objetivos financeiros</p>
      </div>
      <GoalsSection />
    </div>
  );
}

