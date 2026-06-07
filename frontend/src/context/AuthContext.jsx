import React, { createContext, useState, useEffect } from 'react';

// Criamos a central de informações de autenticação
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Assim que a página abre, verifica se já existia um login salvo no navegador
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('mars_cervejaria_login');
    if (usuarioSalvo) {
      setLogado(true);
    }
    setCarregando(false);
  }, []);

  // Função para simular o Login
  function entrar(email, senha) {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    
    // Simulação: Aceita qualquer login para fins acadêmicos
    localStorage.setItem('mars_cervejaria_login', 'true');
    setLogado(true);
    return true;
  }

  // Função para o Logout funcional
  function sair() {
    localStorage.removeItem('mars_cervejaria_login');
    setLogado(false);
  }

  if (carregando) return <div>Carregando sistema...</div>;

  return (
    <AuthContext.Provider value={{ logado, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}