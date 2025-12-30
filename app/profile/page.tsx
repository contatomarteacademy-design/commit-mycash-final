'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { FiUser, FiLock, FiSave, FiMail } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { members } = useFinance();
  const { showToast, ToastComponent } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    lastName: '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: personalInfo.name,
        },
      });

      if (error) throw error;

      showToast('success', 'Sucesso', 'Informações atualizadas com sucesso!');
    } catch (error: any) {
      showToast('error', 'Erro', error.message || 'Erro ao atualizar informações');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'Erro', 'As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('error', 'Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      showToast('success', 'Sucesso', 'Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showToast('error', 'Erro', error.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.user_metadata?.name || personalInfo.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = user?.email || '';

  return (
    <>
      <div className="w-full max-w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {/* Header do Perfil */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-gray-700">
            {displayName[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{displayName}</h1>
          <p className="text-gray-500">{displayEmail}</p>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FiUser className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Informações Pessoais</h2>
          </div>

          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-foreground">
                Sobrenome
              </label>
              <input
                id="lastName"
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                placeholder="Seu sobrenome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-foreground text-white rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lime disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiSave className="w-5 h-5" />
              Salvar Alterações
            </button>
          </form>
        </div>

        {/* Alterar Senha */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FiLock className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Alterar Senha</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold mb-2 text-foreground">
                Senha Atual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-2 text-foreground">
                Nova Senha
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-foreground">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-foreground text-white rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lime disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiSave className="w-5 h-5" />
              Alterar Senha
            </button>
          </form>
        </div>
      </div>
      <ToastComponent />
    </>
  );
}
