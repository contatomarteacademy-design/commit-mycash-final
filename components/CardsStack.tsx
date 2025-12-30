'use client';

import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/utils';
import { FiCreditCard, FiPlus, FiChevronRight } from 'react-icons/fi';
import { useNavigation } from '@/contexts/NavigationContext';
import * as Dialog from '@radix-ui/react-dialog';

const cardLogos: Record<string, string> = {
  Nubank: '/images/cards/logo-nubank.png',
  Inter: '/images/cards/logo-inter.png',
  XP: '/images/cards/logo-xp.png',
  Itaú: '/images/cards/logo-nubank.png',
};

export function CardsStack() {
  const { cards } = useFinance();
  const { setActiveSection } = useNavigation();
  const displayedCards = cards.slice(0, 3);

  const formatDateShort = (dueDay: number) => {
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const date = new Date();
    date.setDate(dueDay);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiCreditCard className="w-5 h-5 md:w-6 md:h-6 text-foreground" aria-hidden="true" />
          <h2 className="text-lg md:text-xl font-bold text-foreground">Cartões</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Adicionar novo cartão"
          >
            <FiPlus className="w-4 h-4 text-foreground" aria-hidden="true" />
          </button>
          <button
            onClick={() => setActiveSection('cards')}
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Ver todos os cartões"
          >
            <FiChevronRight className="w-4 h-4 text-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {displayedCards.map((card) => {
          const usagePercent = (card.balance / card.limit) * 100;
          const dueDateText = `Vence ${formatDateShort(card.dueDay)}`;
          
          // Aplicar tema do cartão
          const getThemeStyles = (theme: 'black' | 'lime' | 'white') => {
            switch (theme) {
              case 'black':
                return {
                  bg: 'bg-foreground',
                  text: 'text-white',
                  textSecondary: 'text-white/80',
                  badgeBg: 'bg-lime',
                  badgeText: 'text-foreground',
                  border: '',
                };
              case 'lime':
                return {
                  bg: 'bg-lime',
                  text: 'text-foreground',
                  textSecondary: 'text-foreground/60',
                  badgeBg: 'bg-foreground',
                  badgeText: 'text-white',
                  border: 'border border-gray-300',
                };
              case 'white':
              default:
                return {
                  bg: 'bg-card',
                  text: 'text-foreground',
                  textSecondary: 'text-gray-600',
                  badgeBg: 'bg-foreground',
                  badgeText: 'text-white',
                  border: 'border border-border',
                };
            }
          };

          const theme = getThemeStyles(card.theme);
          
          return (
            <Dialog.Root key={card.id}>
              <Dialog.Trigger asChild>
                <div
                  className={`${theme.bg} ${theme.text} ${theme.border} rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-lime focus-within:outline-none`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalhes do cartão ${card.name}`}
                >
                  {/* Top Section */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Logo */}
                    <div className={`w-8 h-8 rounded-full ${card.theme === 'black' ? 'bg-white/20' : card.theme === 'lime' ? 'bg-foreground/10' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                      {cardLogos[card.name] ? (
                        <img
                          src={cardLogos[card.name]}
                          alt={card.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className={`text-xs font-bold ${theme.text}`}>
                          {card.name[0]}
                        </span>
                      )}
                    </div>
                    
                    {/* Badge de percentual */}
                    <div className={`px-3 py-1 ${theme.badgeBg} ${theme.badgeText} rounded-full text-xs font-semibold`}>
                      {usagePercent.toFixed(1)}%
                    </div>
                  </div>

                  {/* Center Section */}
                  <div className="mb-4">
                    <p className={`text-xs ${theme.textSecondary} mb-1`}>{card.name}</p>
                    <p className={`text-xl font-bold ${theme.text}`}>
                      {formatCurrency(card.balance)}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] ${theme.textSecondary}`}>
                      {dueDateText}
                    </span>
                  </div>
                </div>
              </Dialog.Trigger>
              
              {/* Modal de detalhes */}
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl p-8 z-50 w-full max-w-lg" role="dialog" aria-modal="true" aria-labelledby={`card-details-${card.id}`}>
                  <Dialog.Title id={`card-details-${card.id}`} className="text-2xl font-bold mb-4">{card.name}</Dialog.Title>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Limite</p>
                      <p className="text-xl font-bold">{formatCurrency(card.limit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fatura atual</p>
                      <p className="text-xl font-bold">{formatCurrency(card.balance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="text-xl font-bold">Dia {card.dueDay}</p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="mt-6 px-6 py-3 bg-foreground text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lime">
                      Fechar
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        })}
      </div>
    </div>
  );
}

