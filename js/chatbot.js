// ========== SAÚDE+ CHATBOT ==========
// Chatbot de suporte ao usuário da clínica Saúde+

(function () {
  "use strict";

  // ── Knowledge base ────────────────────────────────────────────
  const FAQ = [
    {
      keywords: ["horário", "horario", "funcionamento", "aberto", "abre", "fecha", "expediente"],
      answer:
        "🕐 <b>Nosso horário de funcionamento:</b><br>• Seg a Sex: 08h às 20h<br>• Sábado: 08h às 14h<br>• Domingo: Somente emergência",
    },
    {
      keywords: ["agendar", "agendamento", "consulta", "marcar", "reservar"],
      answer:
        '📅 Você pode agendar sua consulta diretamente pela nossa <a href="agendamento.html" class="chatbot-link">página de agendamento</a>. É rápido e fácil! Basta selecionar a especialidade, data e horário.',
    },
    {
      keywords: ["especialidade", "especialidades", "serviço", "servico", "serviços", "servicos", "área", "area"],
      answer:
        '🩺 <b>Nossas especialidades:</b><br>• Clínica Geral<br>• Pediatria<br>• Cardiologia<br>• Exames Laboratoriais<br><br>Veja todos os detalhes na página de <a href="servicos.html" class="chatbot-link">Serviços</a>.',
    },
    {
      keywords: ["médico", "medico", "doutor", "doutora", "equipe", "profissional", "profissionais"],
      answer:
        '👨‍⚕️ <b>Nossa equipe inclui:</b><br>• Dra. Ana Silva — Pediatria<br>• Dr. Marcos Souza — Cardiologia<br>• Dra. Clara Mendes — Clínica Geral<br><br>Conheça todos em <a href="profissionais.html" class="chatbot-link">Equipe</a>.',
    },
    {
      keywords: ["endereço", "endereco", "localização", "localizacao", "onde", "fica", "mapa", "local"],
      answer:
        '📍 Estamos na <b>Av. Paulista, 1000 — São Paulo, SP</b>. Veja no <a href="contato.html" class="chatbot-link">mapa</a>.',
    },
    {
      keywords: ["telefone", "ligar", "contato", "fone", "whatsapp", "zap"],
      answer:
        '📞 <b>Telefone:</b> (11) 4004-0000<br>📧 <b>E-mail:</b> contato@saudemais.com.br<br><br>Ou envie uma mensagem pela nossa <a href="contato.html" class="chatbot-link">página de Contato</a>.',
    },
    {
      keywords: ["convênio", "convenio", "plano", "saúde", "saude", "seguro", "cobertura"],
      answer:
        "💳 Aceitamos os principais convênios e planos de saúde. Para verificar se o seu plano é aceito, entre em contato pelo telefone <b>(11) 4004-0000</b> ou envie uma mensagem pelo site.",
    },
    {
      keywords: ["exame", "exames", "laboratório", "laboratorio", "resultado", "resultados"],
      answer:
        "🔬 Nosso laboratório próprio oferece resultados rápidos e precisos. Os resultados ficam disponíveis em até <b>24 horas</b> para exames de rotina. Para exames específicos, o prazo pode variar.",
    },
    {
      keywords: ["emergência", "emergencia", "urgência", "urgencia", "urgente", "pronto-socorro", "pronto socorro"],
      answer:
        "🚨 Para <b>emergências</b>, nosso atendimento funciona aos domingos e feriados. Em casos de risco de vida, ligue <b>192 (SAMU)</b> imediatamente.",
    },
    {
      keywords: ["preço", "preco", "valor", "custo", "quanto custa", "tabela"],
      answer:
        "💰 Os valores variam de acordo com a especialidade e o tipo de consulta. Para informações sobre valores, entre em contato pelo <b>(11) 4004-0000</b> ou agende uma consulta e receba um orçamento personalizado.",
    },
    {
      keywords: ["obrigado", "obrigada", "valeu", "agradeço", "agradeco", "thanks"],
      answer: "😊 De nada! Estou aqui para ajudar. Se tiver mais alguma dúvida, é só perguntar!",
    },
    {
      keywords: ["olá", "ola", "oi", "hey", "bom dia", "boa tarde", "boa noite", "hello", "hi"],
      answer:
        "👋 Olá! Bem-vindo(a) à <b>Saúde+ Centro Clínico</b>! Como posso ajudar você hoje?<br><br>Posso responder sobre:<br>• Agendamento de consultas<br>• Especialidades médicas<br>• Horários de funcionamento<br>• Localização e contato<br>• Convênios aceitos",
    },
  ];

  const FALLBACK =
    '🤔 Desculpe, não encontrei informações sobre isso. Posso ajudar com:<br>• <b>Agendamento</b> de consultas<br>• <b>Especialidades</b> médicas<br>• <b>Horários</b> de funcionamento<br>• <b>Localização</b> e contato<br>• <b>Convênios</b> aceitos<br><br>Ou entre em contato pelo <b>(11) 4004-0000</b>.';

  // ── Inject CSS ────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* Chatbot floating button */
    #chatbot-toggle {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #2563eb, #38bdf8);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(37, 99, 235, 0.45);
      transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
    }
    #chatbot-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(37, 99, 235, 0.55);
    }
    #chatbot-toggle svg {
      width: 30px;
      height: 30px;
      transition: transform 0.3s;
    }
    #chatbot-toggle.open svg.icon-chat { display: none; }
    #chatbot-toggle:not(.open) svg.icon-close { display: none; }

    /* Notification badge */
    #chatbot-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid #fff;
      animation: chatbot-pulse 2s infinite;
    }
    #chatbot-toggle.open #chatbot-badge { display: none; }
    @keyframes chatbot-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    /* Chat window */
    #chatbot-window {
      position: fixed;
      bottom: 108px;
      right: 28px;
      z-index: 9998;
      width: 400px;
      max-width: calc(100vw - 32px);
      height: 560px;
      max-height: calc(100vh - 140px);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.5);
      box-shadow: 0 25px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04);
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s;
    }
    #chatbot-window.visible {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    .chatbot-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }
    .chatbot-header-avatar {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .chatbot-header-info h4 {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }
    .chatbot-header-info p {
      font-size: 12px;
      opacity: 0.8;
      margin: 2px 0 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .chatbot-header-info p span {
      width: 7px;
      height: 7px;
      background: #34d399;
      border-radius: 50%;
      display: inline-block;
    }

    /* Messages */
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }
    .chatbot-messages::-webkit-scrollbar { width: 5px; }
    .chatbot-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

    .chatbot-msg {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.6;
      animation: chatbot-fadeIn 0.35s ease;
    }
    @keyframes chatbot-fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chatbot-msg.bot {
      align-self: flex-start;
      background: #f1f5f9;
      color: #1e293b;
      border-bottom-left-radius: 6px;
    }
    .chatbot-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: #fff;
      border-bottom-right-radius: 6px;
    }
    .chatbot-msg a.chatbot-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .chatbot-msg.user a.chatbot-link {
      color: #bfdbfe;
    }

    /* Typing indicator */
    .chatbot-typing {
      display: flex;
      gap: 5px;
      padding: 14px 18px;
      align-self: flex-start;
      background: #f1f5f9;
      border-radius: 20px;
      border-bottom-left-radius: 6px;
      animation: chatbot-fadeIn 0.3s ease;
    }
    .chatbot-typing span {
      width: 8px;
      height: 8px;
      background: #94a3b8;
      border-radius: 50%;
      animation: chatbot-bounce 1.4s infinite;
    }
    .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes chatbot-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    /* Quick actions */
    .chatbot-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 4px 0 8px;
      animation: chatbot-fadeIn 0.4s ease 0.1s both;
    }
    .chatbot-quick-btn {
      padding: 8px 16px;
      border-radius: 100px;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      color: #475569;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .chatbot-quick-btn:hover {
      border-color: #2563eb;
      color: #2563eb;
      background: #eff6ff;
    }

    /* Input */
    .chatbot-input-area {
      padding: 16px 20px;
      background: #fff;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .chatbot-input-area input {
      flex: 1;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 18px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      background: #f8fafc;
      color: #0f172a;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .chatbot-input-area input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .chatbot-input-area input::placeholder {
      color: #94a3b8;
    }
    .chatbot-input-area button {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .chatbot-input-area button:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    }
    .chatbot-input-area button svg {
      width: 20px;
      height: 20px;
    }

    /* Responsive */
    @media (max-width: 480px) {
      #chatbot-window {
        right: 8px;
        bottom: 100px;
        width: calc(100vw - 16px);
        height: calc(100vh - 120px);
        border-radius: 20px;
      }
      #chatbot-toggle {
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ───────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.id = "chatbot-wrapper";
  wrapper.innerHTML = `
    <!-- Toggle Button -->
    <button id="chatbot-toggle" aria-label="Abrir chat de suporte">
      <div id="chatbot-badge"></div>
      <svg class="icon-chat" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <svg class="icon-close" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div id="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-avatar">🤖</div>
        <div class="chatbot-header-info">
          <h4>Assistente Saúde+</h4>
          <p><span></span> Online agora</p>
        </div>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="Digite sua dúvida..." autocomplete="off" />
        <button id="chatbot-send" aria-label="Enviar mensagem">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // ── DOM references ────────────────────────────────────────────
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const messagesEl = document.getElementById("chatbot-messages");
  const inputEl = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");

  let isOpen = false;
  let hasBeenOpened = false;

  // ── Helper functions ──────────────────────────────────────────
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chatbot-msg ${sender}`;
    msg.innerHTML = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chatbot-typing";
    typing.id = "chatbot-typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("chatbot-typing-indicator");
    if (el) el.remove();
  }

  function addQuickActions() {
    const container = document.createElement("div");
    container.className = "chatbot-quick-actions";
    const actions = [
      { label: "📅 Agendar consulta", text: "Como agendo uma consulta?" },
      { label: "🕐 Horários", text: "Qual o horário de funcionamento?" },
      { label: "🩺 Especialidades", text: "Quais especialidades vocês atendem?" },
      { label: "📍 Localização", text: "Onde fica a clínica?" },
      { label: "📞 Contato", text: "Qual o telefone de contato?" },
    ];
    actions.forEach((a) => {
      const btn = document.createElement("button");
      btn.className = "chatbot-quick-btn";
      btn.textContent = a.label;
      btn.addEventListener("click", () => {
        // Remove quick actions after first click
        container.remove();
        handleUserMessage(a.text);
      });
      container.appendChild(btn);
    });
    messagesEl.appendChild(container);
    scrollToBottom();
  }

  function findAnswer(input) {
    const normalized = input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let bestMatch = null;
    let bestScore = 0;

    for (const faq of FAQ) {
      let score = 0;
      for (const keyword of faq.keywords) {
        const normalizedKeyword = keyword
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (normalized.includes(normalizedKeyword)) {
          score += normalizedKeyword.length; // Longer keyword matches score higher
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    return bestMatch ? bestMatch.answer : FALLBACK;
  }

  function handleUserMessage(text) {
    addMessage(text, "user");
    showTyping();

    // Simulate thinking delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      hideTyping();
      const answer = findAnswer(text);
      addMessage(answer, "bot");
    }, delay);
  }

  // ── Welcome message ───────────────────────────────────────────
  function showWelcome() {
    addMessage(
      "👋 Olá! Sou o assistente virtual da <b>Saúde+ Centro Clínico</b>.<br><br>Estou aqui para ajudar com informações sobre agendamentos, especialidades, horários e muito mais. Como posso ajudar?",
      "bot"
    );
    setTimeout(() => addQuickActions(), 400);
  }

  // ── Events ────────────────────────────────────────────────────
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    toggleBtn.classList.toggle("open", isOpen);
    chatWindow.classList.toggle("visible", isOpen);

    if (isOpen && !hasBeenOpened) {
      hasBeenOpened = true;
      showWelcome();
    }

    if (isOpen) {
      setTimeout(() => inputEl.focus(), 350);
    }
  });

  sendBtn.addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    handleUserMessage(text);
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
})();
