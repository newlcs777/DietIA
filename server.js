import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Configuração da API Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// ✅ Rota principal apenas para teste e saúde do servidor
app.get("/", (req, res) => {
  res.status(200).send("🚀 Servidor DietIA backend ativo e rodando com sucesso!");
});

// 🧩 Rota de geração de dieta
app.post("/api/gerarDieta", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
  }

  try {
    console.log("🧠 Enviando prompt para Gemini 2.0 Flash Lite...");

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erro no retorno da Gemini:", data);
      return res
        .status(500)
        .json({ error: "Erro ao gerar dieta com Gemini. Verifique o log." });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Nenhuma resposta gerada.";

    console.log("✅ Dieta gerada com sucesso!");
    res.json({ dieta: text });
  } catch (error) {
    console.error("❌ Falha geral ao gerar dieta:", error);
    res.status(500).json({
      error: "Falha geral ao gerar dieta. Verifique o servidor.",
    });
  }
});

// 🟢 Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`✅ Servidor backend rodando na porta ${PORT}`)
);
