const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('estoque')
    .setDescription('Ver o estoque de todos os produtos'),
  async execute(interaction) {
    const produtos = db.getProdutos();
    if (produtos.length === 0) return interaction.reply({ content: '📦 Nenhum produto cadastrado.', ephemeral: true });

    const linhas = produtos.map(p => {
      const emoji = p.estoque === 0 ? '🔴' : p.estoque <= 3 ? '🟡' : '🟢';
      return `${emoji} **${p.nome}** — ${p.estoque} unidade(s) | R$ ${p.preco.toFixed(2)}`;
    });

    const embed = new EmbedBuilder()
      .setTitle('📦 Estoque da Loja')
      .setDescription(linhas.join('\n'))
      .setColor(0xFEE75C)
      .setFooter({ text: '🟢 Normal · 🟡 Baixo · 🔴 Esgotado' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
