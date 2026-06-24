//Importação das bibliotecas(ferramentas prontas)
//importando cliente do WhatsApp e a estratéfia de autenticação local da biblioteca
const { Client, LocalAuth } = require('whatsapp-web.js');
//Importa a biblioteca que desenha o qr code no terminal do vs code
const qrcode = require('qrcode-terminal');

//Guarda o segundo em que o bot foi iniciado em carimbo unix(sistema criado para por em pc e medir o tempo) de tempo
const tempoInicial = Math.floor(Date.now() / 1000);

const client = new Client({
    //Cria uma nova instância configurando o caminho do Google Chrome no Windows
    authStrategy: new LocalAuth(),// Diz ao bot para salvar a sessão na pasta .wwebjs_auth para não deslogar
    puppeteer: {
        //caminho do chrome no meu pc
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
         // Argumentos de segurança necessários para o Windows permitir que o Node controle o Chrome
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    //Quando o WhatsApp gera um código de conexão, ele entra aqui
    console.log('🔄 Novo QR Code gerado:');
    // Pega o código bruto e desenha em tamanho pequeno (small) no terminal para você escanear      
    qrcode.generate(qr, { small: true });
});

client.on('message', async (msg) => {

    
    // Se o horário da mensagem recebida for menor/mais antigo que o horário que o bot ligou, o "return" para o código ali mesmo
    if (msg.timestamp < tempoInicial) return;

    // Se o identificador do remetente terminar com '@g.us' (que significa grupo), o "return" ignora a mensagem
    if (msg.from.endsWith('@g.us')) return;

    // CAPTURA DE DADOS DO PACIENTE
    // O "await" faz o código pausar por um milésimo de segundo para ir buscar o nome do contato na agenda do WhatsApp
    const contato = await msg.getContact();


     // .trim() remove espaços inúteis antes e depois do texto (Ex: " 1 " vira "1")
    // .toLowerCase() transforma tudo em minúsculo (Ex: "MENU" vira "menu")todas funções
    const textoUsuario = msg.body.trim().toLowerCase();

    // Texto padrão do Menu Principal o + serve pra concatenar os textos
    const menuPrincipal = 
        `Olá! Você está falando com o Atendimento Virtual do *Posto de Saúde Panambiense* 🏥\n\n` +
        `Para que possamos te ajudar rapidamente, escolha uma das opções abaixo digitando apenas o *NÚMERO* correspondente:\n\n` +
        `*[ 1 ]* Atendimento Médico 👨‍⚕️\n` +
        `*[ 2 ]* Atendimento Odontológico 🦷\n` +
        `*[ 3 ]* Vacinas 💉\n` +
        `*[ 4 ]* Saúde da Mulher ♀️\n` +
        `*[ 5 ]* Saúde da Criança 🧸\n` +
        `*[ 6 ]* Testes Rápidos ⏩\n` +
        `*[ 7 ]* Renovação de Receitas 💊\n` +
        `*[ 8 ]* Falar diretamente com a Recepção 👤(*Somente Texto*\n\n` +
        `A qualquer momento, você pode digitar *MENU* para voltar para cá.`;

   // fluxo de decisões
    if (textoUsuario === '1') {
        // Mostra no terminal do seu VS Code o que o bot está fazendo (ajuda no monitoramento)
        console.log(`[Bot Respondeu] Enviou Info de Atendimento Médico para ${contato.pushname || msg.from}`);
        // Envia a resposta de volta para o celular do paciente
        await msg.reply(
            `👨‍⚕️ *Horário para consultas:*\n` +
            `• *Horário:* Segunda a Sexta, das 7h30 às 11h15 e das 13h00 às 16h30.\n` +
            `• *As Terças-feiras o posto fecha as 15h00*\n\n`+
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n\n` +
            `Digite *MENU*para voltar às opções.`
        );
    } 
    //repete 
    else if (textoUsuario === '2') {
        console.log(`[Bot Respondeu] Enviou Info de Atendimento Odontológico para ${contato.pushname || msg.from}`);
        await msg.reply(
            `🦷 *Atendimento Odontológico: Somente por Agendamento*\n` +
            `• *Horário:* Segunda a Sexta, das 7h30 às 11h30 e das 13h00 às 17h00.\n` +
            `• *As Terças-feiras o posto fecha as 15h00*\n\n`+
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    //repete 
    else if (textoUsuario === '3') {
        console.log(`[Bot Respondeu] Enviou Info de Vacinas para ${contato.pushname || msg.from}`);
        await msg.reply(
             `💉 *SALA DE VACINAS:*\n` +
            `• *Horário:* Segunda a Sexta, das 7:30h às 11h15 e das 13h às 16h30.\n` +
            `• *As Terças-feiras o posto fecha as 15:00*\n\n`+
            `• *Febre amarela somente nas quartas-feiras de manhã*\n\n`+
            `• *Tríplice viral somente as quintas-ferias manhã e tarde*\n\n`+
            `• *O que trazer:* Cartão SUS, CPF e a Caderneta de Vacinação.\n\n` +
            `Digite *MENU* para voltar às opções.`           
        );
    } 
    //repete 
    else if (textoUsuario === '4') {
        console.log(`[Bot Respondeu] Enviou Info de Saúde da Muher para ${contato.pushname || msg.from}`);
        await msg.reply(
            `♀️ *Saúde da mulher: Precisa ser agendado*\n` +
            `• *Exame preventivo.*\n` +
            `• *Solicitação para mamografia.*\n` +
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n`+
            `Digite *MENU* para voltar às opções.`
            
            
        );
    } 
    //repete 
     else if (textoUsuario === '5') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        await msg.reply(
            `🧸*Saúde da Criança: Precisa ser agendado*\n` +
            `• *Teste do pezinho.*\n` +
            `• *Puericultura.*\n` +
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n`+
            `Digite *MENU* para voltar às opções.`
        );
    } 
    //repete 
     else if (textoUsuario === '6') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        await msg.reply(
            `⏩*Testes Rápido: Precisa ser agendado*\n` +
            `• *Hepatite B e C.*\n` +
            `• *HIV.*\n` +
            `• *Sífilis.*\n` +
            `• *Para agendar:* Você poderá comparecer no posto, agendar pelo WhatssApp diretamente com a recepcionista ou ligar para o nosso telefone fixo: (99) 9999-9999.\n`+
            `Digite *MENU* para voltar às opções.`
        );
    } 
    //repete 
     else if (textoUsuario === '7') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        await msg.reply(
           `💊 *Renovação de receitas:*\n` +
            `• *Posto fica aberto:* Aberta das 07h30 às 11:30 e da 13:00 às 17h.\n` +
            `• *Para a renovação de receitas:*Você pode enviar a foto para a recepcionista do posto, foto da *RECEITA*,e após a confirmação de sua renovação,busca-lá no posto de saúde.\n\n` +
            `Digite *MENU* para voltar às opções.`
        );
    } 
    //repete 
     else if (textoUsuario === '8') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        await msg.reply(
            `👤 *FALAR COM A RECEPÇÃO:*\n` +
            `Para não enfrentar filas virtuais e ser atendido imediatamente, por favor, **ligue para o nosso TELEFONE FIXO: (XX) XXXX-XXXX**.\n\n` +
            `Se preferir atendimento por texto, descreva detalhadamente sua dúvida abaixo e aguarde. A recepcionista responderá assim que liberar os atendimentos presenciais.\n`+
            `Digite *MENU* para voltar às opções.`
        );
    }
    // Se ele escrever algo errado ou qualquer coisa caí de volta nas opções/ serve como um tratamento de erro
    else {
        console.log(`[Bot Respondeu] Mensagem recebida disparou o Menu Principal para ${contato.pushname || msg.from}`);
        //ja larga o menu principal de novo
        await msg.reply(menuPrincipal);
    }
});
// Executa processo de inicialização com tudo o que foi configurado acima o
client.initialize();
