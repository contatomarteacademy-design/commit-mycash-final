# Migrations do Banco de Dados

Este diretório contém as migrations SQL para criar o schema do banco de dados no Supabase.

## Estrutura das Migrations

1. **001_initial_schema.sql**: Cria todas as tabelas do sistema
   - `members` - Membros da família
   - `accounts` - Contas bancárias
   - `cards` - Cartões de crédito
   - `transactions` - Transações financeiras
   - `goals` - Objetivos financeiros
   - `bills` - Contas a pagar

2. **002_enable_rls.sql**: Configura Row Level Security (RLS)
   - Habilita RLS em todas as tabelas
   - Cria políticas para garantir que usuários só acessem seus próprios dados

## Como Aplicar as Migrations

### Via MCP Supabase (Recomendado)

Se você estiver usando o MCP Supabase no Cursor, você pode aplicar as migrations diretamente:

1. Certifique-se de que seu projeto Supabase está ativo
2. Use o comando MCP `mcp_supabase_apply_migration` com o conteúdo dos arquivos SQL

### Via Supabase CLI

1. Instale o Supabase CLI: `npm install -g supabase`
2. Faça login: `supabase login`
3. Link seu projeto: `supabase link --project-ref seu-project-ref`
4. Aplique as migrations: `supabase db push`

### Via Dashboard do Supabase

1. Acesse o SQL Editor no dashboard do Supabase
2. Copie e cole o conteúdo de cada migration
3. Execute na ordem (001 primeiro, depois 002)

## Nota Importante

⚠️ **O projeto atual está INACTIVE** e não pode ser restaurado (pausado há mais de 90 dias).

Você precisará:
- Criar um novo projeto no Supabase, ou
- Usar um projeto ativo existente

Depois de ter um projeto ativo, atualize as variáveis de ambiente no arquivo `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

