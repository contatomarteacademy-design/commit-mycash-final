'use client';

import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import * as Dialog from '@radix-ui/react-dialog';
import { FiX } from 'react-icons/fi';
import { useToast } from './Toast';

export function AddMemberModal() {
  const { addMember } = useFinance();
  const { showToast, ToastComponent } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    monthlyIncome: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.length < 3) {
      showToast('error', 'Erro', 'Nome deve ter pelo menos 3 caracteres');
      return;
    }
    
    if (!formData.role) {
      showToast('error', 'Erro', 'Função é obrigatória');
      return;
    }

    addMember({
      name: formData.name,
      role: formData.role,
      avatar: formData.avatar || undefined,
      monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : 0,
    });

    showToast('success', 'Sucesso', 'Membro adicionado com sucesso!');
    setOpen(false);
    setFormData({ name: '', role: '', avatar: '', monthlyIncome: '' });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button 
            className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Adicionar novo membro da família"
          >
            <span className="text-xl" aria-hidden="true">+</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl p-8 z-50 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold">Adicionar Membro</Dialog.Title>
              <Dialog.Close asChild>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime transition-colors"
                  aria-label="Fechar modal"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="member-name" className="block text-sm font-semibold mb-2">Nome Completo</label>
                <input
                  id="member-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime transition-all"
                  required
                  minLength={3}
                  aria-describedby="member-name-help"
                />
                <p id="member-name-help" className="text-xs text-gray-500 mt-1">Mínimo de 3 caracteres</p>
              </div>

              <div>
                <label htmlFor="member-role" className="block text-sm font-semibold mb-2">Função na Família</label>
                <input
                  id="member-role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Pai, Mãe, Filho..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Avatar URL <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Renda Mensal <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime transition-colors"
                    aria-label="Cancelar e fechar modal"
                  >
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-foreground text-white rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 transition-colors"
                  aria-label="Adicionar membro à família"
                >
                  Adicionar Membro
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ToastComponent />
    </>
  );
}

