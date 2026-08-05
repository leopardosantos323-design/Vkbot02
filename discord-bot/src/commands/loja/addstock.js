const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addstock')
    .setDescription('[ADMIN] Adicionar unidades ao estoque de um produto')
    .addStringOption(o => o.setName('produto').setDescription('Nome do produto').setRequired(true))
    .addIntegerOption(o => o.setName('quantidade').setDescription('Quantidade a adicionar').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('produto');
    const qtd = interaction.options.getInteger('quantidade');
    const produto = db.getProduto(nome);

    if (!produto) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });

    db.updateProduto(nome, { estoque: produto.estoque + qtd });
    await interaction.reply({ content: `✅ Adicionado **+${qtd}** ao estoque de **${nome}**. Total: **${produto.estoque + qtd}**` });
  },
};
