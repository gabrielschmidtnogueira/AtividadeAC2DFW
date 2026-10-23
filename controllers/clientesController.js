const clientes = [
  {
    id: 1,
    nome: "Ana Souza",
    idade: 28,
    cidade: "Sorocaba",
    pedidos: [{ codigo: "P001", produto: "Teclado mecânico", quantidade: 1 }],
  },
  {
    id: 2,
    nome: "Bruno Lima",
    idade: 35,
    cidade: "Campinas",
    pedidos: [{ codigo: "P002", produto: "Mouse sem fio", quantidade: 2 }],
  },
  {
    id: 3,
    nome: "Carla Mendes",
    idade: 22,
    cidade: "Sorocaba",
    pedidos: [],
  },
];

function encontrarCliente(id) {
  const idNumerico = Number(id);
  if (!Number.isInteger(idNumerico)) {
    return undefined;
  }
  return clientes.find((cliente) => cliente.id === idNumerico);
}

exports.listarClientes = (req, res) => {
  res.json(clientes);
};

exports.obterClientePorId = (req, res) => {
  const cliente = encontrarCliente(req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  res.json(cliente);
};

exports.listarPedidosCliente = (req, res) => {
  const cliente = encontrarCliente(req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  res.json(cliente.pedidos);
};

exports.atualizarCliente = (req, res) => {
  const cliente = encontrarCliente(req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Id não existente" });
  }

  const { nome, idade, cidade } = req.body || {};

  if (nome !== undefined) cliente.nome = nome;
  if (idade !== undefined) cliente.idade = idade;
  if (cidade !== undefined) cliente.cidade = cidade;

  res.json({
    mensagem: "Cliente atualizado com sucesso",
    cliente,
  });
};

exports.adicionarPedido = (req, res) => {
  const cliente = encontrarCliente(req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  const { codigo, produto, quantidade } = req.body || {};
  const quantidadeNumerica = Number(quantidade);

  if (
    codigo === undefined ||
    codigo === null ||
    String(codigo).trim() === "" ||
    typeof produto !== "string" ||
    produto.trim() === "" ||
    quantidade === undefined ||
    !Number.isFinite(quantidadeNumerica) ||
    quantidadeNumerica <= 0
  ) {
    return res.status(400).json({
      mensagem: "Informe codigo, produto e quantidade maior que zero",
    });
  }

  const pedido = {
    codigo,
    produto: produto.trim(),
    quantidade: quantidadeNumerica,
  };

  cliente.pedidos.push(pedido);

  res.status(201).json({
    mensagem: "Pedido adicionado com sucesso",
    pedido,
  });
};

exports.listarClientesPorCidade = (req, res) => {
  const cidadeInformada = String(req.params.cidade)
    .trim()
    .toLocaleLowerCase("pt-BR");
  const resultado = clientes.filter(
    (cliente) =>
      cliente.cidade.trim().toLocaleLowerCase("pt-BR") === cidadeInformada,
  );

  res.json(resultado);
};

exports.removerCliente = (req, res) => {
  const cliente = encontrarCliente(req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Id não existente" });
  }

  const indice = clientes.findIndex((item) => item.id === cliente.id);
  clientes.splice(indice, 1);

  res.json({ mensagem: "Cliente removido com sucesso", cliente });
};
