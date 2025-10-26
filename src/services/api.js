import axios from "axios";

// 🌍 Detecta o ambiente automaticamente (local ou hospedado)
const isLocalhost = window.location.hostname === "localhost";

// 🔹 Se estiver local, usa o backend da máquina. Caso contrário, usa o Render.
const API_BASE_URL = isLocalhost
  ? "http://localhost:3001"
  : "https://dietia-backend-vq8o.onrender.com"; // ✅ link correto do Render

export const gerarDieta = async (dadosUsuario) => {
  try {
    const prompt = `
Você é um nutricionista profissional e deve montar um plano alimentar **personalizado e direto** com base nas informações abaixo:

📋 **Dados do Usuário**
- Altura: ${dadosUsuario.height} cm
- Peso: ${dadosUsuario.weight} kg
- Idade: ${dadosUsuario.age} anos
- Sexo: ${dadosUsuario.sex}
- Percentual de gordura: ${dadosUsuario.percentualGordura || "Não informado"}
- TMB (Taxa Metabólica Basal): ${dadosUsuario.tmbResult || "Não informado"} kcal
- Objetivo: ${dadosUsuario.goal}
- Nível de atividade: ${dadosUsuario.activityLevel}
- Refeições por dia: ${dadosUsuario.meals}
- Restrições alimentares: ${dadosUsuario.restrictions || "Nenhuma"}
- Tipo de treino: ${dadosUsuario.trainingType || "Não informado"}
- Suplementos: ${dadosUsuario.supplements || "Nenhum"}
- Alimentos preferidos: ${dadosUsuario.foods || "Não informado"}

🍽️ **Monte a dieta de forma simples, objetiva e estruturada**, respeitando os dados acima.

### Instruções importantes:
1. A dieta deve conter **todas as refeições** do dia, de acordo com o número informado (${dadosUsuario.meals} refeições, se aplicável).
2. Liste **somente os alimentos e quantidades (em gramas ou unidades)**, sem explicações longas.
3. Inclua **as refeições nomeadas** (Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde, Jantar, Ceia, etc.).
4. Após as refeições, repita um pequeno resumo do objetivo e recomendações finais em poucas linhas.
5. Não coloque texto de alerta nem justificativas — apenas o plano e o resumo final.

📋 **Informações do Usuário**
(Repita os dados principais)

🍽️ **Plano Alimentar**
Café da Manhã:
- Aveia 50g
- Leite desnatado 200ml
- Banana 1 unidade

Almoço:
- Arroz integral 100g
- Feijão 80g
- Frango grelhado 150g
- Salada verde 100g

Resumo Final:
Objetivo: ${dadosUsuario.goal}
Meta diária estimada: ${dadosUsuario.tmbResult || "Não informado"} kcal
Recomendações: manter hidratação e evitar frituras.
`;

    // 🧠 Envia o prompt para o backend (Render ou localhost)
    const response = await axios.post(`${API_BASE_URL}/api/gerarDieta`, { prompt });

    // ✅ Retorna a resposta do backend corretamente
    return response.data?.dieta || response.data || "❌ Erro: resposta vazia.";
  } catch (error) {
    console.error("❌ Erro ao gerar dieta (frontend):", error);
    throw new Error("Erro ao gerar dieta com Gemini. Verifique o log do servidor.");
  }
};
