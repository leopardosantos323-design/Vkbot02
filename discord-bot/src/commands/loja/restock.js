const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restock')
    .setDescription('[ADMIN] Reabastecer um produto para a quantidade definida')
    .addStringOption(o => o.setName('produto').setDescription('Nome do produto').setRequired(true))
    .addIntegerOption(o => o.setName('quantidade').setDescription('Nova quantidade em estoque').setRequired(true).setMinValue(0)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('produto');
    const qtd = interaction.options.getInteger('quantidade');
    const ok = db.updateProduto(nome, { estoque: qtd });

    if (!ok) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });
    await interaction.reply({ content: `✅ Estoque de **${nome}** definido para **${qtd}** unidade(s).` });
  },
};
