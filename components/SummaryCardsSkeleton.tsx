'use client';

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl p-6 md:p-10 flex flex-col gap-6 md:gap-8 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="w-16 h-6 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-32 h-8 bg-gray-200 rounded" />
            <div className="w-20 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

