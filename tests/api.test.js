const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("API de clientes e pedidos: fluxo completo dos endpoints", async () => {
  // GET /clientes
  let response = await fetch(`${baseUrl}/clientes`);
  assert.equal(response.status, 200);
  let dados = await response.json();
  assert.equal(dados.length, 3);
  assert.equal(dados[0].nome, "Ana Souza");

  // GET /clientes/:id
  response = await fetch(`${baseUrl}/clientes/1`);
  assert.equal(response.status, 200);
  let cliente = await response.json();
  assert.equal(cliente.id, 1);

  // GET /clientes/:id/pedidos
  response = await fetch(`${baseUrl}/clientes/1/pedidos`);
  assert.equal(response.status, 200);
  let pedidos = await response.json();
  assert.equal(pedidos.length, 1);

  // PUT /clientes/:id
  response = await fetch(`${baseUrl}/clientes/2`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Bruno Lima Atualizado", cidade: "Sorocaba" }),
  });
  assert.equal(response.status, 200);
  let atualizado = await response.json();
  assert.equal(atualizado.cliente.nome, "Bruno Lima Atualizado");
  assert.equal(atualizado.cliente.cidade, "Sorocaba");

  // POST /clientes/:id/pedidos
  response = await fetch(`${baseUrl}/clientes/1/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: "P099", produto: "Webcam", quantidade: 1 }),
  });
  assert.equal(response.status, 201);
  let novoPedido = await response.json();
  assert.equal(novoPedido.pedido.codigo, "P099");

  // Confirma que o pedido ficou no array do cliente.
  response = await fetch(`${baseUrl}/clientes/1/pedidos`);
  pedidos = await response.json();
  assert.equal(pedidos.length, 2);
  assert.equal(pedidos[1].produto, "Webcam");

  // GET /clientes/cidade/:cidade (inclui o cliente atualizado).
  response = await fetch(`${baseUrl}/clientes/cidade/Sorocaba`);
  assert.equal(response.status, 200);
  dados = await response.json();
  assert.equal(dados.length, 3);

  // PUT com ID inexistente deve retornar a mensagem pedida no enunciado.
  response = await fetch(`${baseUrl}/clientes/999`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Não existe" }),
  });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).mensagem, "Id não existente");

  // DELETE /clientes/:id e mensagem para ID inexistente.
  response = await fetch(`${baseUrl}/clientes/3`, { method: "DELETE" });
  assert.equal(response.status, 200);
  assert.equal(
    (await response.json()).mensagem,
    "Cliente removido com sucesso",
  );

  response = await fetch(`${baseUrl}/clientes/3`, { method: "DELETE" });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).mensagem, "Id não existente");
});
