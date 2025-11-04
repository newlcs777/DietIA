import axios from "axios";

// 🌍 Detecta o ambiente (local ou hospedado)
const isLocalhost = window.location.hostname === "localhost";

// 🔹 Define a URL base correta do backend
const API_BASE_URL = isLocalhost
  ? "http://localhost:3001"
  : "https://dietia-backend-vq8o.onrender.com"; // ⚠️ URL hospedada no Render

/**
 * Gera uma dieta personalizada via API (Gemini) com base nos dados do usuário.
 * @param {Object} dadosUsuario - Dados informados pelo usuário
 * @returns {Promise<string>} Dieta formatada e limpa
 */
export const gerarDieta = async (dadosUsuario) => {
  try {
    const prompt = `
Você é um nutricionista profissional. Gere um plano alimentar prático e direto com base nas informações abaixo.

Inclua apenas:
- O título do plano (exemplo: Plano Alimentar para Emagrecimento)
- As informações básicas do cliente (altura, peso, idade, sexo, objetivo, nível de atividade, refeições por dia, restrições, treino, alimentos preferidos)
- O plano alimentar diário, dividido claramente em blocos nomeados:
  Café da manhã
  Lanche da manhã
  Almoço
  Lanche da tarde
  Jantar
  Ceia

Regras importantes:
1. Liste cada refeição em um bloco separado, com nome da refeição e os alimentos correspondentes.
2. Todas as quantidades devem estar em gramas (g), mililitros (ml) ou unidades, e todas as refeições devem exibir as quantidades de macronutrientes.
3. Não escreva observações, recomendações, metas, considerações, notas, lembretes, variações ou mensagens extras.
4. Não use asteriscos (*), hashtags (#), emojis, negritos, itálicos, traços ou qualquer caractere especial.
5. Retorne apenas texto limpo, com uma linha em branco entre cada refeição.
6. Escreva de forma organizada, com boa legibilidade e espaçamento.
7. Calcule a quantidade total de água (35ml/kg) e divida-a proporcionalmente entre as refeições.

Dados do cliente:
Altura: ${dadosUsuario.height} cm
Peso: ${dadosUsuario.weight} kg
Idade: ${dadosUsuario.age} anos
Sexo: ${dadosUsuario.sex}
Objetivo: ${dadosUsuario.goal}
Atividade: ${dadosUsuario.activityLevel}
Refeições por dia: ${dadosUsuario.meals}
Restrições: ${dadosUsuario.restrictions || "Nenhuma"}
Treino: ${dadosUsuario.trainingType || "Não informado"}
Alimentos preferidos: ${dadosUsuario.foods || "Não informado"}
`;

    // 🚀 Envia o prompt ao backend (Express + Gemini)
    const { data } = await axios.post(`${API_BASE_URL}/api/gerarDieta`, { prompt });

    const textoBruto = data?.dieta || "";

    // 🧹 Limpeza de formatação e caracteres especiais
    const textoLimpo = textoBruto
      .replace(/[*#_`~>•\-]/g, "")
      .replace(/\r?\n\s*\r?\n\s*\r?\n/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .trim();

    // ✂️ Divide as refeições em blocos nomeados
    const blocos = textoLimpo
      .split(/(?=Café da manhã|Lanche da manhã|Almoço|Lanche da tarde|Jantar|Ceia)/i)
      .map((b) => b.trim())
      .filter(Boolean);

    // 📋 Formatação final com separadores
    const dietaFormatada = blocos.join("\n\n----------------------------\n\n");

    return dietaFormatada || "Nenhuma resposta recebida do servidor.";
  } catch (error) {
    console.error("❌ Erro ao gerar dieta (frontend):", error.message);
    throw new Error("Erro ao gerar dieta. Tente novamente mais tarde.");
  }
};
