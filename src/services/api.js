import axios from "axios";

// 🌍 Detecta o ambiente (local ou hospedado)
const isLocalhost = window.location.hostname === "localhost";

// 🔹 Define o link certo do backend
const API_BASE_URL = isLocalhost
  ? "http://localhost:3001"
  : "https://dietia-backend-vq8o.onrender.com"; // ⚠️ Use exatamente esse link com o -vq8o

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
2. Todas as quantidades devem estar em gramas (g), mililitros (ml) ou unidades.
3. Não escreva observações, recomendações, metas, considerações, notas, lembretes, variações ou mensagens extras.
4. Não use asteriscos (*), hashtags (#), emojis, negritos, itálicos, traços ou qualquer caractere especial.
5. Retorne apenas texto limpo, com uma linha em branco entre cada refeição.
6. Escreva de forma organizada, com boa legibilidade e espaçamento.
7.coloque a quantidade de agua de acordo com o peso 35ml por kilo

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

    // 🚀 Envia o prompt para o backend (Render)
    const response = await axios.post(`${API_BASE_URL}/api/gerarDieta`, { prompt });

    // 🔹 Pega o texto retornado (ou vazio)
    const textoBruto = response.data?.dieta || "";

    // 🔹 Limpeza geral de formatações e caracteres
    const textoLimpo = textoBruto
      .replace(/[*#_`~>•\-]/g, "") // remove caracteres especiais
      .replace(/\r?\n\s*\r?\n\s*\r?\n/g, "\n\n") // remove múltiplas quebras
      .replace(/\s{2,}/g, " ") // remove espaços duplicados
      .trim();

    // 🔹 Divide as refeições em blocos
    const blocos = textoLimpo
      .split(/(?=Café da manhã|Lanche da manhã|Almoço|Lanche da tarde|Jantar|Ceia)/i)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // 🔹 Adiciona separadores visuais
    const dietaFormatada = blocos.join("\n\n----------------------------\n\n");

    // 🔹 Retorna dieta limpa e organizada
    return dietaFormatada || "Nenhuma resposta recebida do servidor.";
  } catch (error) {
    console.error("❌ Erro ao gerar dieta (frontend):", error);
    throw new Error("Erro ao gerar dieta. Tente novamente mais tarde.");
  }
};
