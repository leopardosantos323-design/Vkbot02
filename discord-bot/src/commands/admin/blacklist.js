const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('[ADMIN] Bloquear um usuário de fazer compras')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário a bloquear').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo do bloqueio')),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const alvo = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo informado';

    if (db.isBlacklisted(alvo.id)) {
      return interaction.reply({ content: `⚠️ ${alvo} já está na blacklist.`, ephemeral: true });
    }

    db.addBlacklist(alvo.id);
    await interaction.reply({ content: `🚫 ${alvo} adicionado à blacklist.\n📝 Motivo: ${motivo}` });
  },
};
