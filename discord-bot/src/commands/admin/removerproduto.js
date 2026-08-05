const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerproduto')
    .setDescription('[ADMIN] Remover um produto da loja')
    .addStringOption(o => o.setName('nome').setDescription('Nome do produto').setRequired(true)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('nome');
    const ok = db.removeProduto(nome);

    if (!ok) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });
    await interaction.reply({ content: `✅ Produto **${nome}** removido da loja.` });
  },
};
