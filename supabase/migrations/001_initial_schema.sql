-- Criar extensão UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Membros da Família
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  monthly_income DECIMAL(12, 2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Contas
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'card')),
  balance DECIMAL(12, 2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Cartões de Crédito
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  closing_day INTEGER NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  limit_amount DECIMAL(12, 2) NOT NULL,
  balance DECIMAL(12, 2) DEFAULT 0,
  theme TEXT NOT NULL DEFAULT 'white' CHECK (theme IN ('black', 'lime', 'white')),
  logo TEXT,
  last_digits TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  value DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  installments_current INTEGER,
  installments_total INTEGER,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_installments CHECK (
    (installments_current IS NULL AND installments_total IS NULL) OR
    (installments_current IS NOT NULL AND installments_total IS NOT NULL AND installments_current <= installments_total)
  )
);

-- Tabela de Objetivos
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  target DECIMAL(12, 2) NOT NULL,
  current DECIMAL(12, 2) DEFAULT 0,
  category TEXT NOT NULL,
  image TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Contas a Pagar
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

