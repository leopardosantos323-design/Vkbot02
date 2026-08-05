# 🏪 Bot de Vendas Discord

Bot completo de loja/vendas para Discord com sistema de produtos, pedidos, economia e suporte via ticket.

---

## ⚡ Configuração Rápida

### 1. Criar o Bot no Discord

1. Acesse [discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique em **New Application** → dê um nome
3. Vá em **Bot** → clique em **Add Bot**
4. Copie o **Token** (guarde, você vai precisar)
5. Em **Bot**, ative os Privileged Intents:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Vá em **OAuth2 → URL Generator**:
   - Selecione `bot` e `applications.commands`
   - Permissões: `Manage Channels`, `Send Messages`, `Read Messages`, `Embed Links`, `View Channel`
   - Copie o link gerado e convide o bot para seu servidor

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=id_do_bot         # Application ID na página do developer
GUILD_ID=id_do_servidor     # ID do servidor (opcional, para registrar comandos mais rápido)
ADMIN_ROLE_ID=id_do_cargo   # ID do cargo de administrador
```

**Como pegar os IDs:** Ative o Modo Desenvolvedor no Discord (Configurações → Avançado → Modo Desenvolvedor) e clique com botão direito em qualquer servidor/cargo/usuário para copiar o ID.

### 3. Instalar e registrar comandos

```bash
npm install
node src/deploy-commands.js   # Registra os slash commands
npm start                     # Inicia o bot
```

---

## 🚀 Deploy no Railway via GitHub

1. **Suba o código para o GitHub:**
   ```bash
   cd discord-bot
   git init
   git add .
   git commit -m "feat: bot de vendas discord"
   git remote add origin https://github.com/seu-usuario/seu-repo.git
   git push -u origin main
   ```

2. **No Railway ([railway.app](https://railway.app)):**
   - Clique em **New Project → Deploy from GitHub repo**
   - Selecione seu repositório
   - Vá em **Variables** e adicione as variáveis do `.env`
   - O bot sobe automaticamente! 🎉

3. **Registrar os comandos (só 1 vez):**
   - No Railway, vá em **Settings → Deploy**
   - Em **Start Command**, coloque temporariamente: `node src/deploy-commands.js`
   - Aguarde executar → volte para `node src/index.js`

---

## 📋 Comandos Disponíveis

### 🛒 Loja
| Comando | Descrição |
|---------|-----------|
| `/loja` | Ver todos os produtos disponíveis |
| `/comprar <produto>` | Comprar um produto (aceita `cupom`) |
| `/estoque` | Ver estoque completo com indicadores |
| `/stock` | Exibição rápida do estoque |
| `/preco <produto>` | Ver preço e detalhes de um produto |

### 💰 Economia
| Comando | Descrição |
|---------|-----------|
| `/saldo` | Ver seu saldo atual |
| `/pagamento` | Instruções de pagamento |
| `/pix` | Ver a chave PIX |

### 📦 Pedidos
| Comando | Descrição |
|---------|-----------|
| `/pedido <id>` | Ver status de um pedido |
| `/meuspedidos` | Listar todos os seus pedidos |
| `/cancelar <id>` | Cancelar pedido pendente (estorna saldo) |

### 📊 Utilidades
| Comando | Descrição |
|---------|-----------|
| `/perfil` | Ver seu perfil de cliente |
| `/cupom <codigo>` | Verificar/resgatar cupom de desconto |
| `/avaliar <id> <nota>` | Avaliar uma compra (1-5 ⭐) |
| `/ticket <assunto>` | Abrir canal privado de suporte |
| `/info` | Informações da loja e estatísticas |
| `/ping` | Ver latência do bot |
| `/ajuda` | Lista completa de comandos |

### 👑 Administração
| Comando | Descrição |
|---------|-----------|
| `/addproduto` | Adicionar produto |
| `/removerproduto` | Remover produto |
| `/editarproduto` | Editar nome/descrição |
| `/setpreco` | Alterar preço |
| `/setcategoria` | Definir categoria |
| `/addstock` | Adicionar unidades ao estoque |
| `/removestock` | Remover unidades do estoque |
| `/restock` | Definir estoque para uma quantidade |
| `/adicionarsaldo` | Adicionar saldo a um usuário |
| `/removersaldo` | Remover saldo de um usuário |
| `/vendas` | Ver vendas recentes |
| `/vendas-top` | Ranking de produtos mais vendidos |
| `/clientes` | Top clientes por valor gasto |
| `/blacklist <usuario>` | Bloquear comprador |
| `/unblacklist <usuario>` | Desbloquear comprador |
| `/configurarpix <chave>` | Definir chave PIX |
| `/configurarpainelticket` | Enviar painel de tickets no canal |

---

## 💡 Como Adicionar Cupons

Edite `data/cupons.json` diretamente:

```json
{
  "PROMO10": { "percentual": 10 },
  "DESCONTO20": { "percentual": 20 },
  "BLACK50": { "percentual": 50 }
}
```

---

## 📁 Estrutura de Arquivos

```
discord-bot/
├── src/
│   ├── index.js              # Arquivo principal
│   ├── deploy-commands.js    # Registrar comandos
│   ├── commands/
│   │   ├── loja/             # Comandos de loja
│   │   ├── economia/         # Saldo e pagamentos
│   │   ├── pedidos/          # Gestão de pedidos
│   │   ├── admin/            # Comandos administrativos
│   │   └── util/             # Utilitários
│   └── database/
│       └── db.js             # Banco de dados JSON
├── data/                     # Dados persistidos (JSON)
├── .env.example              # Modelo de variáveis
├── railway.json              # Configuração Railway
└── package.json
```
