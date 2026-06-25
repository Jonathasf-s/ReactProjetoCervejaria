import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [logado, setLogado] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState(null); // { tipo: 'admin' | 'cliente', id, nome, email }
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sessaoSalva = localStorage.getItem('mars_sessao');
    if (sessaoSalva) {
      const sessao = JSON.parse(sessaoSalva);
      setLogado(true);
      setUsuarioAtual(sessao);
    }
    setCarregando(false);
  }, []);

  // Login do administrador
  function entrar(email, senha) {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    const credencialEmail = 'admin@mars.com';
    const credencialSenha = '123456';

    if (email.toLowerCase() === credencialEmail && senha === credencialSenha) {
      const sessao = { tipo: 'admin', nome: 'Administrador', email };
      localStorage.setItem('mars_sessao', JSON.stringify(sessao));
      setLogado(true);
      setUsuarioAtual(sessao);
      return true;
    } else {
      alert('Credenciais inválidas. Use admin@mars.com / 123456');
      return false;
    }
  }

  // Login do cliente
  function entrarComoCliente(email, senha) {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return false;
    }

    const clientes = JSON.parse(localStorage.getItem('mars_clientes')) || [];
    const cliente = clientes.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.senha === senha
    );

    if (cliente) {
      const sessao = { tipo: 'cliente', id: cliente.id, nome: cliente.nome, email: cliente.email };
      localStorage.setItem('mars_sessao', JSON.stringify(sessao));
      setLogado(true);
      setUsuarioAtual(sessao);
      return true;
    } else {
      alert('E-mail ou senha inválidos.');
      return false;
    }
  }

  // Cadastro de novo cliente
  function cadastrarCliente(dados) {
    const { nome, email, senha, telefone, cpf, endereco, dataNascimento } = dados;

    if (!nome || !email || !senha || !telefone || !cpf || !endereco || !dataNascimento) {
      alert("Preencha todos os campos obrigatórios.");
      return false;
    }

    const clientes = JSON.parse(localStorage.getItem('mars_clientes')) || [];

    const emailJaUsado = clientes.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (emailJaUsado) {
      alert("Este e-mail já está cadastrado.");
      return false;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      alert("CPF inválido. Deve conter 11 dígitos.");
      return false;
    }

    const novoCliente = {
      id: `cli_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      nome,
      email,
      senha, // Em produção real, nunca armazene senha em texto puro!
      telefone,
      cpf,
      endereco,
      dataNascimento,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    };

    const listaAtualizada = [...clientes, novoCliente];
    localStorage.setItem('mars_clientes', JSON.stringify(listaAtualizada));

    return true;
  }

  function sair() {
    localStorage.removeItem('mars_sessao');
    setLogado(false);
    setUsuarioAtual(null);
  }

  if (carregando) return <div>Carregando sistema...</div>;

  return (
    <AuthContext.Provider value={{ logado, usuarioAtual, entrar, entrarComoCliente, cadastrarCliente, sair }}>
      {children}
    </AuthContext.Provider>
  );
}