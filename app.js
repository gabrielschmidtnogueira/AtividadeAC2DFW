const express = require("express");
const clienteRouter = require("./routes/clienteRouter");

const app = express();
app.use(express.json());

app.use("/clientes", clienteRouter);

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
