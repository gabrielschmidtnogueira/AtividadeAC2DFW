const express = require("express");
const clienteController = require("../controllers/clientesController");

const router = express.Router();

// Rotas específicas vêm antes da rota dinâmica /:id, como visto na Aula 11.
router.get("/", clienteController.listarClientes);
router.get("/clientes", clienteController.listarClientes);
router.get("/cidade/:cidade", clienteController.listarClientesPorCidade);
router.get("/:id/pedidos", clienteController.listarPedidosCliente);
router.get("/:id", clienteController.obterClientePorId);
router.put("/:id", clienteController.atualizarCliente);
router.post("/:id/pedidos", clienteController.adicionarPedido);
router.delete("/:id", clienteController.removerCliente);

module.exports = router;
