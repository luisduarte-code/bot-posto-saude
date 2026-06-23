const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa o bot apontando para o Chrome instalado no seu Windows
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        // Se o seu Chrome não estiver na pasta acima (64-bits), tente o caminho abaixo desmarcando a linha seguinte:
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ... O RESTANTE DO SEU CÓDIGO (client.on('qr'), client.on('message'), etc.) CONTINUA EXATAMENTE IGUAL

// Gera o QR Code no terminal para você escanear com o celular
client.on('qr', (qr) => {
    console.log('ESCANEIE O QR CODE ABAIXO COM O WHATSAPP DO POSTO:');
    qrcode.generate(qr, { small: true });
});

// Avisa quando a conexão der certo
client.on('ready', () => {
    console.log('\n🤖 Bot do Posto de Saúde está ONLINE e pronto! 🏥');
});

// Processa as mensagens recebidas
client.on('message', async (msg) => {
    const textoUsuario = msg.body.trim();

    // Menu Principal (Se a pessoa saudar ou digitar algo que não seja número)
    if (isNaN(textoUsuario)) {
        const saudacao = 
            `Olá! Você está falando com o Atendimento Virtual do Posto de Saúde. 🏥\n\n` +
            `Para evitar filas e agilizar seu atendimento, escolha uma das opções digitando apenas o **NÚMERO** correspondente:\n\n` +
            `*[ 1 ]* Horários e Documentos para Vacinação 💉\n` +
            `*[ 2 ]* Como agendar Consultas ou Exames (Gercon) 🗓️\n` +
            `*[ 3 ]* Retirada de Medicamentos e Receitas 💊\n` +
            `*[ 4 ]* Falar com a Recepção (Dúvidas Gerais) 👤`;
        
        await msg.reply(saudacao);
    } 
    // Respostas para cada opção do menu
    else if (textoUsuario === '1') {
        await msg.reply('💉 *SALA DE VACINAS:*\nHorário: Segunda a Sexta, das 08h às 11h30 e das 13h às 16h30.\n⚠️ *O que trazer:* Cartão SUS, CPF e a Caderneta de Vacinação.');
    } 
    else if (textoUsuario === '2') {
        await msg.reply('🗓️ *AGENDAMENTOS (Consultas/Exames):*\nOs agendamentos são realizados via sistema GERCON.\nPara agendar, compareça presencialmente portando seu pedido médico e documento com foto, ou ligue para o nosso telefone fixo.');
    } 
    else if (textoUsuario === '3') {
        await msg.reply('💊 *RETIRADA DE MEDICAMENTOS:*\nDisponível na farmácia do posto das 07h30 às 17h.\n⚠️ É obrigatória a apresentação da receita médica atualizada e do cartão SUS.');
    } 
    else if (textoUsuario === '4') {
        await msg.reply('👤 *FALAR COM A RECEPÇÃO:*\nPara um atendimento humano muito mais rápido e evitar filas no WhatsApp, por favor, **ligue para o nosso TELEFONE FIXO: (XX) XXXX-XXXX**.\n\nSe o seu assunto não puder ser resolvido por ligação, digite sua dúvida aqui e aguarde a recepcionista responder assim que estiver livre.');
    } 
    else {
        await msg.reply('❌ Opção inválida. Digite apenas o número de 1 a 4 correspondente à sua dúvida.');
    }
});

client.initialize();