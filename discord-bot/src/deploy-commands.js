require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandFolders = ['loja', 'economia', 'pedidos', 'admin', 'util'];

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, 'commands', folder);
  if (!fs.existsSync(commandsPath)) continue;
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command) commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`📤 Registrando ${commands.length} comandos...`);
    let data;
    if (process.env.GUILD_ID) {
      data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      console.log(`✅ ${data.length} comandos registrados no servidor (instantâneo)!`);
    } else {
      data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log(`✅ ${data.length} comandos registrados globalmente (pode levar até 1h para aparecer)!`);
    }
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err);
  }
})();
