const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configurarpix')
    .setDescription('[ADMIN] Definir a chave PIX da loja')
    .addStringOption(o => o.setName('chave').setDescription('Chave PIX (CPF, e-mail, telefone ou aleatória)').setRequired(true)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const chave = interaction.options.getString('chave');
    const config = db.getConfig();
    config.pix = chave;
    db.saveConfig(config);

    await interaction.reply({ content: `✅ Chave PIX configurada: \`${chave}\``, ephemeral: true });
  },
};
