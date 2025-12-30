'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { TransactionType } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import { FiX, FiArrowDown, FiArrowUp, FiPlus } from 'react-icons/fi';
import { useToast } from './Toast';

const defaultExpenseCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Contas Fixas',
  'Outros',
];

const defaultIncomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'];

export function NewTransactionModalSmall() {
  const { addTransaction, members, accounts, cards } = useFinance();
  const { showToast, ToastComponent } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    value: '',
    description: '',
    category: '',
    newCategory: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    memberId: '',
    installments: { current: 1, total: 1 },
    status: 'paid' as 'paid' | 'pending',
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories);
  const [incomeCategories, setIncomeCategories] = useState(defaultIncomeCategories);

  const allAccounts = [...accounts, ...cards];

  // Carregar categorias do localStorage ao montar
  useEffect(() => {
    const savedExpense = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
    const savedIncome = JSON.parse(localStorage.getItem('incomeCategories') || '[]');
    
    if (savedExpense.length > 0) {
      setExpenseCategories([...defaultExpenseCategories, ...savedExpense.filter((c: string) => !defaultExpenseCategories.includes(c))]);
    }
    if (savedIncome.length > 0) {
      setIncomeCategories([...defaultIncomeCategories, ...savedIncome.filter((c: string) => !defaultIncomeCategories.includes(c))]);
    }
  }, []);

  // Resetar quando o tipo mudar
  useEffect(() => {
    setShowNewCategoryInput(false);
    setFormData(prev => ({ ...prev, category: '', newCategory: '' }));
  }, [formData.type]);

  // Escutar eventos de categoria criada
  useEffect(() => {
    const handleCategoryCreated = (event: CustomEvent) => {
      const { type, name } = event.detail;
      if (type === 'income') {
        setIncomeCategories(prev => [...prev, name]);
      } else {
        setExpenseCategories(prev => [...prev, name]);
      }
    };

    window.addEventListener('categoryCreated', handleCategoryCreated as EventListener);
    return () => window.removeEventListener('categoryCreated', handleCategoryCreated as EventListener);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      showToast('error', 'Erro', 'Valor deve ser maior que zero');
      return;
    }
    
    if (!formData.description || formData.description.length < 3) {
      showToast('error', 'Erro', 'Descrição deve ter pelo menos 3 caracteres');
      return;
    }
    
    let finalCategory = formData.category;
    
    // Se está criando uma nova categoria
    if (formData.category === '__new__') {
      if (!formData.newCategory || formData.newCategory.trim().length < 2) {
        showToast('error', 'Erro', 'Nome da categoria deve ter pelo menos 2 caracteres');
        return;
      }
      finalCategory = formData.newCategory.trim();
      
      // Salvar no localStorage
      const storageKey = formData.type === 'income' ? 'incomeCategories' : 'expenseCategories';
      const existingCategories = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!existingCategories.includes(finalCategory)) {
        existingCategories.push(finalCategory);
        localStorage.setItem(storageKey, JSON.stringify(existingCategories));
        
        // Atualizar lista local
        if (formData.type === 'income') {
          setIncomeCategories([...incomeCategories, finalCategory]);
        } else {
          setExpenseCategories([...expenseCategories, finalCategory]);
        }
      }
    }
    
    if (!finalCategory) {
      showToast('error', 'Erro', 'Selecione ou crie uma categoria');
      return;
    }
    
    if (!formData.accountId) {
      showToast('error', 'Erro', 'Selecione uma conta ou cartão');
      return;
    }

    try {
      await addTransaction({
        type: formData.type,
        value: parseFloat(formData.value),
        description: formData.description,
        category: finalCategory,
        date: new Date(formData.date),
        accountId: formData.accountId,
        memberId: formData.memberId || undefined,
        installments:
          formData.installments.total > 1
            ? { current: 1, total: formData.installments.total }
            : undefined,
        status: formData.status,
      });

      showToast('success', 'Sucesso', 'Transação adicionada com sucesso!');
      setOpen(false);
      setFormData({
        type: 'expense',
        value: '',
        description: '',
        category: '',
        newCategory: '',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
        memberId: '',
        installments: { current: 1, total: 1 },
        status: 'paid',
      });
      setShowNewCategoryInput(false);
    } catch (error: any) {
      showToast('error', 'Erro', error.message || 'Erro ao adicionar transação');
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Adicionar nova transação"
          >
            <FiPlus className="w-4 h-4 text-foreground" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl p-8 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold">Nova Transação</Dialog.Title>
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
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: 'income', category: '' });
                    }}
                    className={`p-6 rounded-xl border-2 transition-colors flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-lime ${
                      formData.type === 'income'
                        ? 'border-foreground bg-foreground text-white'
                        : 'border-border hover:bg-gray-50'
                    }`}
                    aria-pressed={formData.type === 'income'}
                  >
                    <FiArrowDown className="w-5 h-5" />
                    <span className="font-semibold">Receita</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: 'expense', category: '' });
                    }}
                    className={`p-6 rounded-xl border-2 transition-colors flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-lime ${
                      formData.type === 'expense'
                        ? 'border-foreground bg-foreground text-white'
                        : 'border-border hover:bg-gray-50'
                    }`}
                    aria-pressed={formData.type === 'expense'}
                  >
                    <FiArrowUp className="w-5 h-5" />
                    <span className="font-semibold">Despesa</span>
                  </button>
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-semibold mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Supermercado, Salário..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                  minLength={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '__new__') {
                      setShowNewCategoryInput(true);
                      setFormData({ ...formData, category: '__new__' });
                    } else {
                      setShowNewCategoryInput(false);
                      setFormData({ ...formData, category: value });
                    }
                  }}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                >
                  <option value="">Selecione a categoria...</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                  <option value="__new__">+ Nova Categoria</option>
                </select>
                {showNewCategoryInput && (
                  <input
                    type="text"
                    value={formData.newCategory}
                    onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                    placeholder="Digite o nome da nova categoria"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime mt-2"
                    autoFocus
                  />
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>

              {/* Account/Card */}
              <div>
                <label className="block text-sm font-semibold mb-2">Conta/Cartão</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                >
                  <option value="">Selecione...</option>
                  {allAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Member */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Membro <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                >
                  <option value="">Selecione...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Installments */}
              {formData.type === 'expense' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Parcelas</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.installments.total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        installments: { ...formData.installments, total: parseInt(e.target.value) || 1 },
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'paid' | 'pending' })
                  }
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime"
                  >
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-foreground text-white rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-lime"
                >
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

