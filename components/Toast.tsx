'use client';

import { useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: FiCheck,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  error: {
    icon: FiAlertCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  info: {
    icon: FiInfo,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
};

export function Toast({ open, onOpenChange, type, title, description, duration = 3000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={cn(
          'fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border shadow-lg',
          'data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right',
          config.bgColor,
          config.borderColor
        )}
      >
        <div className="flex items-start gap-3 p-4">
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
          <div className="flex-1">
            <ToastPrimitive.Title className={cn('font-semibold', config.textColor)}>
              {title}
            </ToastPrimitive.Title>
            {description && (
              <ToastPrimitive.Description className={cn('text-sm mt-1', config.textColor)}>
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close asChild>
            <button
              className={cn(
                'p-1 rounded-md hover:bg-black/10 transition-colors',
                config.textColor
              )}
              aria-label="Fechar"
            >
              <FiX className="w-4 h-4" />
            </button>
          </ToastPrimitive.Close>
        </div>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed top-0 right-0 z-50 flex flex-col gap-2 w-full max-w-sm p-4" />
    </ToastPrimitive.Provider>
  );
}

// Hook para usar toast facilmente
export function useToast() {
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    title: string;
    description?: string;
  }>({
    open: false,
    type: 'success',
    title: '',
  });

  const showToast = (type: ToastType, title: string, description?: string) => {
    setToast({ open: true, type, title, description });
  };

  const ToastComponent = () => (
    <Toast
      open={toast.open}
      onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
      type={toast.type}
      title={toast.title}
      description={toast.description}
      duration={toast.type === 'error' ? 5000 : toast.type === 'info' ? 4000 : 3000}
    />
  );

  return { showToast, ToastComponent };
}

