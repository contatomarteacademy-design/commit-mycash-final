# mycash+ - Sistema de Controle Financeiro Familiar

Sistema completo de controle financeiro familiar desenvolvido com React, TypeScript, Next.js e Radix UI. Design baseado no Figma com implementação completa de funcionalidades.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações
- **React Icons** - Ícones (Flaticons/Google Icons)
- **date-fns** - Manipulação de datas
- **Supabase** - Backend e banco de dados PostgreSQL

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Configure o banco de dados:
   - Acesse o dashboard do Supabase
   - Vá para o SQL Editor
   - Execute as migrations em ordem:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_enable_rls.sql`
   
   Ou use o MCP Supabase no Cursor para aplicar as migrations diretamente.

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## ✨ Funcionalidades

### Dashboard
- **Cards de Resumo**: Saldo total, Receitas e Despesas do mês
- **Widget de Categorias**: Carousel com gráficos donut mostrando gastos por categoria
- **Gráfico de Fluxo Financeiro**: AreaChart com receitas e despesas ao longo dos meses
- **Stack de Cartões**: Visualização 3D de cartões de crédito com informações de fatura e vencimento
- **Calendário e Agenda**: Calendário interativo com contas pendentes e lista de contas do dia
- **Seção de Objetivos**: Grid responsivo com cards de objetivos e barras de progresso
- **Tabela de Transações**: Extrato detalhado com paginação, busca e filtros

### Funcionalidades Principais
- ✅ Adicionar novas transações (receitas/despesas)
- ✅ Filtros por tipo, membro, período e busca textual
- ✅ Cálculo automático de estatísticas
- ✅ Gestão de cartões de crédito
- ✅ Acompanhamento de objetivos financeiros
- ✅ Agenda de contas a pagar
- ✅ Responsivo (mobile e desktop)

## 📁 Estrutura do Projeto

```
projeto-dash-teste-2/
├── app/
│   ├── layout.tsx          # Layout principal com FinanceProvider
│   ├── page.tsx            # Página do Dashboard
│   └── globals.css         # Estilos globais
├── components/
│   ├── Sidebar.tsx         # Barra lateral com navegação
│   ├── DashboardHeader.tsx # Cabeçalho com busca e filtros
│   ├── SummaryCards.tsx   # Cards de resumo financeiro
│   ├── CategoryCarousel.tsx # Carousel de categorias
│   ├── FinancialFlowChart.tsx # Gráfico de fluxo financeiro
│   ├── CardsStack.tsx      # Stack 3D de cartões
│   ├── CalendarAgenda.tsx # Calendário e agenda
│   ├── GoalsSection.tsx   # Seção de objetivos
│   ├── TransactionsTable.tsx # Tabela de transações
│   └── NewTransactionModal.tsx # Modal de nova transação
├── contexts/
│   └── FinanceContext.tsx # Context API com estado global
├── types/
│   └── index.ts           # Tipos TypeScript
├── lib/
│   ├── utils.ts           # Funções utilitárias
│   ├── calculations.ts    # Funções de cálculo financeiro
│   └── supabase.ts        # Cliente Supabase
├── supabase/
│   ├── migrations/        # Migrations SQL do banco de dados
│   │   ├── 001_initial_schema.sql
│   │   └── 002_enable_rls.sql
│   └── README.md          # Instruções das migrations
└── package.json
```

## 🎨 Design

O design foi extraído do Figma via MCP, incluindo:
- Cores: #F3F4F6 (background), #080B12 (foreground), #DFFE35 (lime), #15BE78 (green), #EB4B5B (red)
- Tipografia: Inter
- Espaçamentos e bordas arredondadas conforme design
- Componentes visuais alinhados ao design system

## 🗄️ Banco de Dados

O sistema usa Supabase (PostgreSQL) com as seguintes tabelas:
- `members` - Membros da família
- `accounts` - Contas bancárias
- `cards` - Cartões de crédito
- `transactions` - Transações financeiras
- `goals` - Objetivos financeiros
- `bills` - Contas a pagar

**Row Level Security (RLS)** está habilitado em todas as tabelas, garantindo que cada usuário só acesse seus próprios dados.

## 🔧 Desenvolvimento

Os dados são carregados automaticamente do Supabase quando o usuário está autenticado. O sistema inclui:
- Carregamento inicial de dados
- Subscriptions em tempo real para atualizações
- Funções CRUD completas para todas as entidades

## 📝 Licença

Este projeto foi desenvolvido como sistema de controle financeiro familiar.

