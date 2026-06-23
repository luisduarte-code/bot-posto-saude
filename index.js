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

    // 2. TRATAMENTO DO TEXTO: Remove espaços extras e padroniza em minúsculo
    const textoUsuario = msg.body.trim().toLowerCase();

    // Texto padrão do Menu Principal
    const menuPrincipal = 
        `Olá! Você está falando com o Atendimento Virtual do *Posto de Saúde Panambiense* 🏥\n\n` +
        `Para que possamos te ajudar rapidamente, escolha uma das opções abaixo digitando apenas o **NÚMERO** correspondente:\n\n` +
        `*[ 1 ]* Horários e Documentos para Vacinação 💉\n` +
        `*[ 2 ]* Como agendar Consultas ou Exames (Gercon) 🗓️\n` +
        `*[ 3 ]* Retirada de Medicamentos e Receitas 💊\n` +
        `*[ 4 ]* Falar com a Recepção (Dúvidas Gerais) 👤\n\n` +
        `_Dica: A qualquer momento, você pode digitar *MENU* para voltar para cá._`;

    // 3. FLUXO DE DECISÃO MELHORADO
    if (textoUsuario === 'menu' || textoUsuario === 'voltar' || textoUsuario === 'oi' || textoUsuario === 'ola') {
        await msg.reply(menuPrincipal);
    } 
    else if (textoUsuario === '1') {
        await msg.reply(
            `💉 *SALA DE VACINAS:*\n` +
            `• *Horário:* Segunda a Sexta, das 08h às 11h30 e das 13h às 16h30.\n` +
            `• *O que trazer:* Cartão SUS, CPF e a Caderneta de Vacinação.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    else if (textoUsuario === '2') {
        await msg.reply(
            `🗓️ *AGENDAMENTOS (Consultas/Exames):*\n` +
            `• Todos os agendamentos são processados via sistema GERCON.\n` +
            `• *Como fazer:* Compareça presencialmente ao posto portando o pedido médico e um documento com foto, de segunda a sexta em horário comercial.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    else if (textoUsuario === '3') {
        await msg.reply(
            `💊 *RETIRADA DE MEDICAMENTOS:*\n` +
            `• *Farmácia do Posto:* Aberta das 07h30 às 17h.\n` +
            `• *Requisitos:* É obrigatório apresentar a receita médica atualizada (dentro do prazo de validade) e o cartão SUS do paciente.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    else if (textoUsuario === '4') {
        await msg.reply(
            `👤 *FALAR COM A RECEPÇÃO:*\n` +
            `Para não enfrentar filas virtuais e ser atendido imediatamente, por favor, **ligue para o nosso TELEFONE FIXO: (99) 9999-9999**.\n\n` +
            `Se preferir atendimento por texto, descreva detalhadamente sua dúvida abaixo e aguarde. A recepcionista responderá assim que liberar os atendimentos presenciais.`
        );
    } 
    else {
        // Se o usuário digitar qualquer texto solto que não seja comando ou número do menu
        await msg.reply(`❌ Opção não reconhecida.\n\nDigite apenas o número de *1 a 4* correspondente à sua dúvida ou digite *MENU* para ver as opções.`);
    }
});

client.initialize();