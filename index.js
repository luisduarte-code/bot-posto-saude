const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 🌟 MARCA O SEGUNDO EXATO EM QUE O BOT FOI LIGADO (em segundos Unix)
const tempoInicial = Math.floor(Date.now() / 1000);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('🔄 Novo QR Code gerado:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n🏥 SISTEMA DO POSTO DE SAÚDE ONLINE (Modo de Produção) 🚀');
});

client.on('message', async (msg) => {
    // 1. IGNORAR MENSAGENS DE GRUPOS (Responder apenas chat privado)
    if (msg.from.endsWith('@g.us')) return;

// 3. TRATAMENTO DO TEXTO
    const textoUsuario = msg.body.trim().toLowerCase();

    // Texto padrão do Menu Principal
    const menuPrincipal = 
        `Olá! Você está falando com o Atendimento Virtual do *Posto de Saúde Panambiense* 🏥\n\n` +
        `Para que possamos te ajudar rapidamente, escolha uma das opções abaixo digitando apenas o *NÚMERO* correspondente:\n\n` +
        `*[ 1 ]* Horários e Documentos para Vacinação 💉\n` +
        `*[ 2 ]* Horários para Consultas 🗓️\n` +
        `*[ 3 ]* Retirada de Medicamentos e Receitas 💊\n` +
        `*[ 4 ]* Falar diretamente com a Recepção 👤\n\n` +
        `A qualquer momento, você pode digitar *MENU* para voltar para cá.`;

    // 4. FLUXO DE DECISÃO DIRETO E SEM ERROS SECOS
    if (textoUsuario === '1') {
        console.log(`[Bot Respondeu] Enviou Info de Vacina para ${contato.pushname || msg.from}`);
        await msg.reply(
            `💉 *SALA DE VACINAS:*\n` +
            `• *Horário:* Segunda a Sexta, das 7:30h às 11h15 e das 13h às 16h30.\n` +
            `• *As Terças-feiras o posto fecha as 15:00*\n\n`+
            `• *Febre amarela somente nas quartas-feiras de manhã*\n\n`+
            `• *Tríplice viral somente as quintas-ferias manhã e tarde*\n\n`+
            `• *O que trazer:* Cartão SUS, CPF e a Caderneta de Vacinação.\n\n` +
            `Digite qualquer coisa para voltar às opções.`
        );
    } 
    else if (textoUsuario === '2') {
        console.log(`[Bot Respondeu] Enviou Info de Agendamento para ${contato.pushname || msg.from}`);
        await msg.reply(
            `🗓️ *Horário para consultas:*\n` +
            `• *Horário:* Segunda a Sexta, das 7:30h às 11h15 e das 13h às 16h30.\n` +
            `• *As Terças-feiras o posto fecha as 15:00*\n\n`+
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    else if (textoUsuario === '3') {
        console.log(`[Bot Respondeu] Enviou Info de Medicamentos para ${contato.pushname || msg.from}`);
        await msg.reply(
            `💊 *RETIRADA DE MEDICAMENTOS:*\n` +
            `• *Farmácia do Posto:* Aberta das 07h30 às 17h.\n` +
            `• *Requisitos:* É obrigado apresentar a receita médica atualizada (dentro do prazo de validade) e o cartão SUS do paciente.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    else if (textoUsuario === '4') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        await msg.reply(
            `👤 *FALAR COM A RECEPÇÃO:*\n` +
            `Para não enfrentar filas virtuais e ser atendido imediatamente, por favor, **ligue para o nosso TELEFONE FIXO: (XX) XXXX-XXXX**.\n\n` +
            `Se preferir atendimento por texto, descreva detalhadamente sua dúvida abaixo e aguarde. A recepcionista responderá assim que liberar os atendimentos presenciais.`
        );
    } 
    // 🔥 QUALQUE OUTRA COISA ENVIADA (Oi, oii, bom dia, blabla, 5, etc.) MOSTRA O MENU DIRETO:
    else {
        console.log(`[Bot Respondeu] Mensagem recebida disparou o Menu Principal para ${contato.pushname || msg.from}`);
        await msg.reply(menuPrincipal);
    }
});

client.initialize();
