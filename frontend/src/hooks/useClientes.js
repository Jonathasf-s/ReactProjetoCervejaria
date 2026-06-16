import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mars_clientes';

function lerDoStorage() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('[useClientes] Falha ao ler localStorage:', erro);
    return [];
  }
}

function escreverNoStorage(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (erro) {
    console.error('[useClientes] Falha ao escrever no localStorage:', erro);
  }
}

function gerarId() {
  return `cli_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

export function useClientes() {
  const [clientes, setClientes] = useState(() => lerDoStorage());
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);

  useEffect(() => {
    escreverNoStorage(clientes);
  }, [clientes]);

  function salvarCliente(dadosDoFormulario) {
    // Separa o ID do resto dos dados para não gerar conflitos ao criar
    const { id, ...dadosNovos } = dadosDoFormulario;

    setClientes((listaAtual) => {
      const indexExistente = listaAtual.findIndex((c) => c.id === id);

      if (indexExistente !== -1) {
        // MODO EDIÇÃO
        const listaAtualizada = [...listaAtual];
        listaAtualizada[indexExistente] = {
          ...listaAtual[indexExistente],
          ...dadosNovos, // Salva dinamicamente nome, email, cpf, endereco, etc.
        };
        return listaAtualizada;
      } else {
        // MODO CRIAÇÃO
        const novoCliente = {
          id: gerarId(),
          ...dadosNovos,
          dataCadastro: new Date().toLocaleDateString('pt-BR'),
        };
        return [...listaAtual, novoCliente];
      }
    });

    setClienteEmEdicao(null); // Limpa o modo de edição ao terminar
  }

  function deletarCliente(id) {
    const confirmado = window.confirm('Deseja excluir este cliente? Esta ação não pode ser desfeita.');
    if (!confirmado) return;

    setClientes((listaAtual) => {
      return listaAtual.filter((c) => c.id !== id);
    });

    if (clienteEmEdicao?.id === id) {
      setClienteEmEdicao(null);
    }
  }

  function carregarClienteParaEdicao(id) {
    const clienteEncontrado = clientes.find((c) => c.id === id);
    if (!clienteEncontrado) return;
    setClienteEmEdicao(clienteEncontrado);
  }

  function cancelarEdicao() {
    setClienteEmEdicao(null);
  }

  return {
    clientes,
    clienteEmEdicao,
    salvarCliente,
    deletarCliente,
    carregarClienteParaEdicao,
    cancelarEdicao,
  };
}