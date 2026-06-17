import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mars_pedidos';

function lerDoStorage() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('[usePedidos] Falha ao ler localStorage:', erro);
    return [];
  }
}

function escreverNoStorage(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (erro) {
    console.error('[usePedidos] Falha ao escrever no localStorage:', erro);
  }
}

function gerarId() {
  return `venda_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState(() => lerDoStorage());
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState(null);

  useEffect(() => {
    escreverNoStorage(pedidos);
  }, [pedidos]);

  function salvarPedido(dadosDoFormulario) {
    // Separa o ID do resto dos dados para não gerar conflitos ao criar
    const { id, ...dadosNovos } = dadosDoFormulario;

    setPedidos((listaAtual) => {
      const indexExistente = listaAtual.findIndex((p) => p.id === id);

      if (indexExistente !== -1) {
        // MODO EDIÇÃO
        const listaAtualizada = [...listaAtual];
        listaAtualizada[indexExistente] = {
          ...listaAtual[indexExistente],
          ...dadosNovos, // Salva dinamicamente clienteId, cervejaId, quantidade
        };
        return listaAtualizada;
      } else {
        // MODO CRIAÇÃO
        const novoPedido = {
          id: gerarId(),
          ...dadosNovos,
          dataCriacao: new Date().toLocaleDateString('pt-BR'),
        };
        return [...listaAtual, novoPedido];
      }
    });

    setPedidoEmEdicao(null); // Limpa o modo de edição ao terminar
  }

  function deletarPedido(id) {
    const confirmado = window.confirm('Deseja excluir este pedido? Esta ação não pode ser desfeita.');
    if (!confirmado) return;

    setPedidos((listaAtual) => {
      return listaAtual.filter((p) => p.id !== id);
    });

    if (pedidoEmEdicao?.id === id) {
      setPedidoEmEdicao(null);
    }
  }

  function carregarPedidoParaEdicao(id) {
    const pedidoEncontrado = pedidos.find((p) => p.id === id);
    if (!pedidoEncontrado) return;
    setPedidoEmEdicao(pedidoEncontrado);
  }

  function cancelarEdicao() {
    setPedidoEmEdicao(null);
  }

  return {
    pedidos,
    pedidoEmEdicao,
    salvarPedido,
    deletarPedido,
    carregarPedidoParaEdicao,
    cancelarEdicao,
  };
}
