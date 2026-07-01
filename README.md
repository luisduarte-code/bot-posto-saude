# bot-posto-saude

Bot para auxiliar no atendimento via WhatsApp do posto de saúde, oferecendo menu de opções, informações de horário e atendimento humano.

## 🚀 Visão geral

Este projeto é um bot simples para o WhatsApp que responde automaticamente a opções de atendimento do posto de saúde e encaminha o paciente para um atendente humano quando necessário.

## ✅ Funcionalidades

- Menu principal com opções numeradas
- Atendimento médico, odontológico, vacinas, enfermagem e renovação de receitas
- Encaminhamento para recepção via texto
- Detecção de horários de funcionamento do posto
- Geração de QR code no terminal para autenticação do WhatsApp Web

## ⚙️ Pré-requisitos

- Node.js instalado
- Google Chrome instalado
- Conexão com a internet

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/luisduarte-code/bot-posto-saude.git
```

2. Instale as dependências:

```bash
npm install
```

## ▶️ Uso

1. Abra o projeto no terminal
2. Execute:

```bash
node index.js
```

3. Escaneie o QR code exibido no terminal com o WhatsApp do celular
4. O bot ficará pronto para responder automaticamente

## 🔧 Configuração

No `index.js`, verifique o caminho do Chrome dentro de `puppeteer.executablePath`:

```js
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
```

Ajuste esse caminho se o Chrome estiver instalado em outro local.

## 💡 Observações

- O bot ignora mensagens de grupos
- O atendimento humano só é ativado quando o usuário escolhe a opção 6
- O bot rejeita mensagens antigas enviadas antes do início do processo

## 📁 Estrutura do projeto

- `index.js` — código do bot
- `package.json` — dependências e metadados

## 📌 Licença

Licenciado como `ISC`.
