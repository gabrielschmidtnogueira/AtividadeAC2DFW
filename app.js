const express = require("express");
const clienteRouter = require("./routes/clienteRouter");

const app = express();
app.use(express.json());

app.use("/clientes", clienteRouter);

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada" });
});

if (require.main === module) {
  const PORTA = process.env.PORT || 3000;
  app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
  });
}

module.exports = app;
