//Importação das bibliotecas(ferramentas prontas)
//importando cliente do WhatsApp e a estratéfia de autenticação local da biblioteca
const { Client } = require('whatsapp-web.js');
//Importa a biblioteca que desenha o qr code no terminal do vs code
const qrcode = require('qrcode-terminal');

//Guarda o segundo em que o bot foi iniciado em carimbo unix(sistema criado para por em pc e medir o tempo) de tempo
const tempoInicial = Math.floor(Date.now() / 1000);
//cria a lista que vai guardar o numero das pessoas que tiverem em espera
const atendimentoHumano = new Set();

// Linha padrão usada no final de toda mensagem informativa, para manter o visual sempre igual
const RODAPE = `\n↩️ Digite *MENU* para voltar às opções.`;

// Texto do horário de funcionamento do posto, usado tanto na verificação quanto no aviso ao paciente
const TEXTO_HORARIO_POSTO = `Segunda a Sexta, das 7h30 às 11h30 e das 13h00 às 17h00 (às terças-feiras o posto fecha às 15h00).`;

// Função que verifica se o horário ATUAL está dentro do funcionamento do posto
function dentroDoHorarioDoPosto() {
    const agora = new Date();
    const diaDaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, ... 6 = sábado
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    // Fechado no fim de semana
    if (diaDaSemana === 0 || diaDaSemana === 6) return false;

    const inicioManha = 7 * 60 + 30;  // 7h30
    const fimManha = 11 * 60 + 30;    // 11h30
    const inicioTarde = 13 * 60;      // 13h00

    // Às terças-feiras o posto fecha mais cedo (15h00) por causa da reunião de equipe
    const ehTerca = diaDaSemana === 2;
    const fimTarde = ehTerca ? 15 * 60 : 17 * 60;

    const estaNaManha = minutosAgora >= inicioManha && minutosAgora < fimManha;
    const estaNaTarde = minutosAgora >= inicioTarde && minutosAgora < fimTarde;

    return estaNaManha || estaNaTarde;
}

const client = new Client({
    //Cria uma nova instância configurando o caminho do Google Chrome no Windows

    puppeteer: {
        //caminho do chrome no meu pc
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
         // Argumentos de segurança necessários para o Windows permitir que o Node controle o Chrome
       args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage'
        ]
    }
});
//avisos que aparecem no terminal
client.on('ready', () => {
    console.log('✅ Bot conectado e pronto!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Falha de autenticação:', msg);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Desconectado:', reason);
});

client.on('qr', (qr) => {
    //Quando o WhatsApp gera um código de conexão, ele entra aqui
    console.log('🔄 Novo QR Code gerado:');
    // Pega o código bruto e desenha em tamanho pequeno (small) no terminal para você escanear      
    qrcode.generate(qr, { small: true });
});


client.on('message', async (msg) => {
    console.log(`📥 Mensagem recebida! Body: "${msg.body}" | timestamp: ${msg.timestamp} | limite: ${tempoInicial + 5}`);
    //TRAVA ANTI-MENSAGENS ANTIGAS (Dando 5 segundos de folga para o bot iniciar em paz)
    if (msg.timestamp < tempoInicial) return;

    //IGNORAR MENSAGENS DE GRUPOS (Responder apenas chat privado)
    if (msg.from.endsWith('@g.us')) return;

    //IGNORA SE FOR NOTIFICAÇÃO DE STATUS OU SE A MENSAGEM VIER VAZIA
    if (!msg.body || msg.type === 'status_v3' || msg.from === 'status@broadcast') return;

    // CAPTURA DE DADOS DO PACIENTE
    // O "await" faz o código pausar por um milésimo de segundo para ir buscar o nome do contato na agenda do WhatsApp
    const contato = await msg.getContact();


     // .trim() remove espaços inúteis antes e depois do texto (Ex: " 1 " vira "1")
    // .toLowerCase() transforma tudo em minúsculo (Ex: "MENU" vira "menu")todas funções
    const textoUsuario = msg.body.trim().toLowerCase();
    const numeroPaciente = msg.from; //pega o numero do paciente (ex: 5551999999999@c.us)
    
    // Se o paciente digitar "menu" ou a RECEPCIONISTA digitar "#voltar"
    if (textoUsuario === 'menu') {
        if (atendimentoHumano.has(numeroPaciente)) {
            atendimentoHumano.delete(numeroPaciente); // Tira o paciente da lista da recepção
            console.log(`[Bot] Reativado para o número: ${numeroPaciente}`);
        }
    }

    // Se o paciente estiver na lista do atendimento humano, o bot não faz NADA
    if (atendimentoHumano.has(numeroPaciente)) {
        return; // Para a execução aqui e deixa o humano conversar
    }

    // Texto padrão do Menu Principal o + serve pra concatenar os textos
    const menuPrincipal = 
        `🏥 *ESF Panambi— ATENDIMENTO VIRTUAL*\n\n` +
        `Olá! Para que possamos te ajudar rapidamente, escolha uma das opções abaixo digitando apenas o *NÚMERO* correspondente:\n\n` +
        `*[ 1 ]* 👨‍⚕️ Atendimento Médico\n` +
        `*[ 2 ]* 🦷 Atendimento Odontológico\n` +
        `*[ 3 ]* 💉 Vacinas\n` +
        `*[ 4 ]* 👩‍⚕️ Atendimento da Enfermeira\n` +
        `*[ 5 ]* 💊 Renovação de Receitas\n` +
        `*[ 6 ]* 👤 Falar diretamente com a Recepção (*Somente Texto*)\n\n` +
        `A qualquer momento, digite *MENU* para voltar para cá.`;

   // fluxo de decisões
    if (textoUsuario === '1') {
        // Mostra no terminal do seu VS Code o que o bot está fazendo (ajuda no monitoramento)
        console.log(`[Bot Respondeu] Enviou Info de Atendimento Médico para ${contato.pushname || msg.from}`);
        // Envia a resposta de volta para o celular do paciente
        await msg.reply(
            `👨‍⚕️ *ATENDIMENTO MÉDICO*\n\n` +
            `🕒 *Horário:* Segunda a Sexta, das 7h30 às 11h15 e das 13h00 às 16h30.\n` +
            `⚠️ *Atenção:* Às terças-feiras o posto fecha às 15h00 para reunião de equipe.\n\n` +
            `📅 *Para agendar:* compareça no posto, agende pelo WhatsApp diretamente com a recepcionista ou ligue para o telefone fixo (99) 9999-9999.` +
            RODAPE
        );
    } 
    //repete 
    else if (textoUsuario === '2') {
        console.log(`[Bot Respondeu] Enviou Info de Atendimento Odontológico para ${contato.pushname || msg.from}`);
        await msg.reply(
            `🦷 *ATENDIMENTO ODONTOLÓGICO*\n\n` +
            `🕒 *Horário:* Segunda a Sexta, das 7h30 às 11h30 e das 13h00 às 17h00.\n` +
            `⚠️ *Atenção:* Às terças-feiras o posto fecha às 15h00 para reunião de equipe.\n\n` +
            `🚨 *Urgências:* são atendidas no início dos turnos.\n` +
            `📌 *Observação:* somente por agendamento.\n\n` +
            `📅 *Para agendar:* compareça no posto, agende pelo WhatsApp diretamente com a recepcionista ou ligue para o telefone fixo (99) 9999-9999.` +
            RODAPE
        );
    } 
    //repete 
    else if (textoUsuario === '3') {
        console.log(`[Bot Respondeu] Enviou Info de Vacinas para ${contato.pushname || msg.from}`);
        await msg.reply(
            `💉 *SALA DE VACINAS*\n\n` +
            `🕒 *Horário:* Segunda a Sexta, das 7h30 às 11h15 e das 13h00 às 16h30.\n` +
            `⚠️ *Atenção:* Às terças-feiras o posto fecha às 15h00 para reunião de equipe.\n\n` +
            `📌 *Febre amarela:* somente às quartas-feiras de manhã.\n` +
            `📌 *Tríplice viral:* somente às quintas-feiras, manhã e tarde.\n\n` +
            `🪪 *O que trazer:* Cartão SUS, CPF e Caderneta de Vacinação.` +
            RODAPE
        );
    } 
    //repete 
   else if (textoUsuario === '4') {
        console.log(`[Bot Respondeu] Enviou Info de Atendimento da Enfermeira para ${contato.pushname || msg.from}`);
        await msg.reply(
            `👩‍⚕️ *ATENDIMENTO DA ENFERMEIRA*\n\n` +
            `Confira abaixo os serviços realizados pela enfermagem:\n\n` +
            `♀️ *Saúde da Mulher:* pré-natal, testes rápidos, consulta de enfermagem, exame preventivo e solicitação de mamografia.\n\n` +
            `🧸 *Saúde da Criança:* teste do pezinho, teste do olhinho e consultas de puericultura.\n\n` +
            `🩸 *Testes Rápidos:* triagem e realização de testes para Hepatite B e C, HIV e Sífilis.\n\n` +
            `📅 *Para agendar qualquer um destes:* compareça no posto, agende pelo WhatsApp diretamente com a recepcionista (opção 6) ou ligue para o telefone fixo (99) 9999-9999.` +
            RODAPE
        );
    }
    //repete 
     else if (textoUsuario === '5') {
        console.log(`[Bot Respondeu] Enviou Info de receitas para ${contato.pushname || msg.from}`);
        await msg.reply(
            `💊 *RENOVAÇÃO DE RECEITAS*\n\n` +
            `🕒 *Horário:* Segunda a Sexta, das 7h30 às 11h30 e das 13h00 às 17h00.\n` +
            `⚠️ *Atenção:* Às terças-feiras o posto fecha às 15h00 para reunião de equipe.\n\n` +
            `📌 *Como renovar:* envie à recepcionista do posto uma foto da *RECEITA* e, após a confirmação, busque-a no posto de saúde.` +
            RODAPE
        );
    } 
    //repete 
     else if (textoUsuario === '6') {
        console.log(`[Bot Respondeu] Enviou Info de Recepção para ${contato.pushname || msg.from}`);
        atendimentoHumano.add(numeroPaciente);
        console.log(`[Bot Pausado] Encaminhado para a recepção para ${contato.pushname || msg.from}`);

        // Se estiver fora do horário do posto, avisa que a resposta só virá dentro do expediente
        const avisoDeHorario = dentroDoHorarioDoPosto()
            ? `💬 *Atendimento por texto:* descreva detalhadamente sua dúvida abaixo e aguarde. A recepcionista responderá assim que liberar os atendimentos presenciais.`
            : `⏰ *Fora do horário de atendimento:* sua mensagem foi recebida, mas só será respondida dentro do horário de funcionamento do posto.\n` +
              `🕒 *Horário do posto:* ${TEXTO_HORARIO_POSTO}`;

        await msg.reply(
            `👤 *FALAR COM A RECEPÇÃO*\n\n` +
            `📞 *Atendimento rápido:* ligue para o telefone fixo (99) 9999-9999 e evite filas virtuais.\n\n` +
            avisoDeHorario +
            RODAPE
        );
    }
    
    // Se ele escrever algo errado ou qualquer coisa caí de volta nas opções/ serve como um tratamento de erro
    else {
        console.log(`[Bot Respondeu] Mensagem recebida disparou o Menu Principal para ${contato.pushname || msg.from}`);
        //ja larga o menu principal de novo
        await msg.reply(menuPrincipal);
    }
});
// posso apertar ctrl c para sair do bot e n corromper os arquivos na pasta cache e auth
process.on('SIGINT', async () => {
    console.log('🛑 Encerrando o bot...');
    await client.destroy();
    process.exit(0);
});
// Executa processo de inicialização com tudo o que foi configurado acima o
client.initialize();