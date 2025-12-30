'use client';

import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import * as Dialog from '@radix-ui/react-dialog';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';
import { useToast } from './Toast';

export function NewGoalModal() {
  const { addGoal } = useFinance();
  const { showToast, ToastComponent } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    category: '',
    image: '',
  });

  const goalCategories = [
    'Viagem',
    'Automóvel',
    'Imóvel',
    'Emergência',
    'Educação',
    'Casamento',
    'Outros',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.name.length < 3) {
      showToast('error', 'Erro', 'Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.target || parseFloat(formData.target) <= 0) {
      showToast('error', 'Erro', 'Meta deve ser maior que zero');
      return;
    }

    if (!formData.category) {
      showToast('error', 'Erro', 'Selecione uma categoria');
      return;
    }

    try {
      await addGoal({
        name: formData.name,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current) || 0,
        category: formData.category,
        image: formData.image || undefined,
      });

      showToast('success', 'Sucesso', 'Objetivo criado com sucesso!');
      setOpen(false);
      setFormData({
        name: '',
        target: '',
        current: '',
        category: '',
        image: '',
      });
    } catch (error: any) {
      showToast('error', 'Erro', error.message || 'Erro ao criar objetivo');
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Criar novo objetivo"
          >
            <FiPlus className="w-4 h-4 text-foreground" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl p-8 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold">Novo Objetivo</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
                  aria-label="Fechar modal"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="goal-name" className="block text-sm font-semibold mb-2">
                  Nome do Objetivo
                </label>
                <input
                  id="goal-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viagem para Europa"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="goal-category" className="block text-sm font-semibold mb-2">
                  Categoria
                </label>
                <select
                  id="goal-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                >
                  <option value="">Selecione...</option>
                  {goalCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="goal-target" className="block text-sm font-semibold mb-2">
                  Meta (R$)
                </label>
                <input
                  id="goal-target"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-current" className="block text-sm font-semibold mb-2">
                  Valor Atual (R$) <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  id="goal-current"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label htmlFor="goal-image" className="block text-sm font-semibold mb-2">
                  URL da Imagem <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  id="goal-image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
                  >
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-foreground text-white rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lime flex items-center justify-center gap-2"
                >
                  <FiSave className="w-5 h-5" />
                  Salvar
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

