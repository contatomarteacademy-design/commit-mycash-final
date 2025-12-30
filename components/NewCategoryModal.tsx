'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';
import { useToast } from './Toast';

export function NewCategoryModal() {
  const { showToast, ToastComponent } = useToast();
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName || categoryName.trim().length < 2) {
      showToast('error', 'Erro', 'Nome da categoria deve ter pelo menos 2 caracteres');
      return;
    }

    const trimmedName = categoryName.trim();
    
    // Verificar se a categoria já existe nas categorias padrão ou no localStorage
    const defaultCategories = categoryType === 'income' 
      ? ['Salário', 'Freelance', 'Investimentos', 'Outros']
      : ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Contas Fixas', 'Outros'];
    
    if (defaultCategories.includes(trimmedName)) {
      showToast('error', 'Erro', 'Esta categoria já existe nas categorias padrão');
      return;
    }

    // Salvar categoria no localStorage
    const storageKey = categoryType === 'income' ? 'incomeCategories' : 'expenseCategories';
    const existingCategories = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (existingCategories.includes(trimmedName)) {
      showToast('error', 'Erro', 'Esta categoria já existe');
      return;
    }

    existingCategories.push(trimmedName);
    localStorage.setItem(storageKey, JSON.stringify(existingCategories));

    showToast('success', 'Sucesso', 'Categoria criada com sucesso! Agora você pode usá-la ao criar uma transação.');
    setOpen(false);
    setCategoryName('');
    
    // Disparar evento para atualizar categorias nos modais de transação
    window.dispatchEvent(new CustomEvent('categoryCreated', { detail: { type: categoryType, name: trimmedName } }));
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Cadastrar nova categoria"
          >
            <FiPlus className="w-4 h-4 text-foreground" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl p-8 z-50 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold">Nova Categoria</Dialog.Title>
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
                <label className="block text-sm font-semibold mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCategoryType('income')}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      categoryType === 'income'
                        ? 'border-foreground bg-foreground text-white'
                        : 'border-border hover:bg-gray-50'
                    }`}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryType('expense')}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      categoryType === 'expense'
                        ? 'border-foreground bg-foreground text-white'
                        : 'border-border hover:bg-gray-50'
                    }`}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="category-name" className="block text-sm font-semibold mb-2">
                  Nome da Categoria
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Alimentação, Transporte..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                  minLength={2}
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

