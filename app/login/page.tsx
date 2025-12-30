'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setError('Verifique seu email para confirmar sua conta!');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">mycash+</span>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {isSignUp ? 'Crie sua conta para começar' : 'Entre com suas credenciais'}
          </p>

          {/* Erro */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                  Nome
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-foreground">
                Senha
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-foreground text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lime disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          {/* Toggle Sign Up/In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-foreground transition-colors"
            >
              {isSignUp ? (
                <>Já tem uma conta? <span className="font-semibold">Entrar</span></>
              ) : (
                <>Não tem uma conta? <span className="font-semibold">Criar conta</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

