const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Mostrar estoque rapidamente'),
  async execute(interaction) {
    const produtos = db.getProdutos();
    if (produtos.length === 0) return interaction.reply({ content: '📦 Sem produtos.', ephemeral: true });

    const linhas = produtos.map(p => {
      const emoji = p.estoque === 0 ? '🔴' : p.estoque <= 3 ? '🟡' : '🟢';
      return `${emoji} **${p.nome}**: ${p.estoque}`;
    });

    await interaction.reply({ content: `**📦 Estoque Rápido**\n${linhas.join('\n')}` });
  },
};
