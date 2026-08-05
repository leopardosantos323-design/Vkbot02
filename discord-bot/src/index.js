require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Carregar todos os comandos de todas as pastas
const commandFolders = ['loja', 'economia', 'pedidos', 'admin', 'util'];
for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, 'commands', folder);
  if (!fs.existsSync(commandsPath)) continue;
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot online como ${c.user.tag}`);
  console.log(`📦 ${client.commands.size} comandos carregados`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`Erro no comando /${interaction.commandName}:`, err);
      const msg = { content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    }
  }

  // Ticket: botão fechar
  if (interaction.isButton() && interaction.customId === 'fechar_ticket') {
    if (!interaction.channel.name.startsWith('ticket-')) return;
    await interaction.reply({ content: '🔒 Fechando o ticket...', ephemeral: true });
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
});

client.login(process.env.DISCORD_TOKEN);
