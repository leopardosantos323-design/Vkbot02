const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpreco')
    .setDescription('[ADMIN] Alterar o preço de um produto')
    .addStringOption(o => o.setName('produto').setDescription('Nome do produto').setRequired(true))
    .addNumberOption(o => o.setName('preco').setDescription('Novo preço em R$').setRequired(true).setMinValue(0.01)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('produto');
    const preco = interaction.options.getNumber('preco');
    const ok = db.updateProduto(nome, { preco });

    if (!ok) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });
    await interaction.reply({ content: `✅ Preço de **${nome}** alterado para **R$ ${preco.toFixed(2)}**` });
  },
};
