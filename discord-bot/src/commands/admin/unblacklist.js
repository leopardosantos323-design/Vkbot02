const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unblacklist')
    .setDescription('[ADMIN] Desbloquear um usuário da blacklist')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário a desbloquear').setRequired(true)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const alvo = interaction.options.getUser('usuario');
    if (!db.isBlacklisted(alvo.id)) {
      return interaction.reply({ content: `⚠️ ${alvo} não está na blacklist.`, ephemeral: true });
    }

    db.removeBlacklist(alvo.id);
    await interaction.reply({ content: `✅ ${alvo} removido da blacklist. Pode comprar novamente.` });
  },
};
