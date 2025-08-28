let respostas = [
  {
    keywords: [
      "nota fiscal",
      "emissao de nota fiscal",
      "emitir nota fiscal",
      "como emitir nota fiscal",
      "gerar nota fiscal",
      "fazer nota fiscal",
      "nota fiscal de saida",
      "criar nota fiscal"
    ],
    resposta: "Olá, tudo bem? Vejo que precisa de ajuda com notas fiscais. Deseja realizar a emissão da mesma para a SEFAZ?",
    followUp: "Você pode emitir ela de forma avulsa em 'N.Fiscal' ou por um pedido de venda no módulo estoque."
  }
];

let esperandoConfirmacao = false;
let respostaAtual = null;

// Normaliza texto
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "");
}

// Converte em array de palavras
function palavrasDoTexto(texto) {
  return normalizarTexto(texto).split(/\s+/);
}

// Adiciona mensagem no chat
function adicionarMensagem(texto, tipo) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.classList.add(tipo === "bot" ? "bot-message" : "user-message");
  msg.textContent = texto;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Processa pergunta
function processarPergunta(pergunta) {
  const palavrasPergunta = palavrasDoTexto(pergunta);

  if (esperandoConfirmacao) {
    if (palavrasPergunta.includes("sim")) {
      adicionarMensagem(respostaAtual.followUp, "bot");
    } else {
      adicionarMensagem("Tudo bem! Se precisar de ajuda com outra coisa, é só perguntar. 😉", "bot");
    }
    esperandoConfirmacao = false;
    respostaAtual = null;
    return;
  }

  let encontrou = false;

  respostas.forEach(r => {
    r.keywords.forEach(kw => {
      const palavrasKeyword = palavrasDoTexto(kw);
      const matches = palavrasKeyword.filter(p => palavrasPergunta.includes(p));
      if (matches.length / palavrasKeyword.length >= 0.6 && !encontrou) {
        adicionarMensagem(r.resposta, "bot");
        esperandoConfirmacao = true;
        respostaAtual = r;
        encontrou = true;
      }
    });
  });

  if (!encontrou) {
    adicionarMensagem("Desculpe, não encontrei resposta para isso. Vou registrar para análise futura.", "bot");
    registrarPergunta(pergunta);
  }
}

// Registro simulado
function registrarPergunta(pergunta) {
  console.log("Pergunta não reconhecida:", pergunta);
}

// Eventos de input
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("user-input");
  const texto = input.value.trim();
  if (texto) {
    adicionarMensagem(texto, "user");
    processarPergunta(texto);
    input.value = "";
  }
});

document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("send-btn").click();
});

