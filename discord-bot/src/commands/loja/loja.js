const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Ver todos os produtos disponíveis na loja'),
  async execute(interaction) {
    const produtos = db.getProdutos().filter(p => p.estoque > 0);
    const config = db.getConfig();

    if (produtos.length === 0) {
      return interaction.reply({ content: '🏪 A loja está sem produtos no momento. Volte mais tarde!', ephemeral: true });
    }

    const categorias = [...new Set(produtos.map(p => p.categoria || 'Geral'))];
    const embed = new EmbedBuilder()
      .setTitle(`🏪 ${config.lojaInfo?.nome || 'Loja'}`)
      .setDescription(config.lojaInfo?.descricao || 'Bem-vindo à nossa loja!')
      .setColor(0x5865F2)
      .setFooter({ text: 'Use /comprar <produto> para comprar · /preco <produto> para ver o preço' })
      .setTimestamp();

    for (const cat of categorias) {
      const prodCat = produtos.filter(p => (p.categoria || 'Geral') === cat);
      const linhas = prodCat.map(p => `> **${p.nome}** — R$ ${p.preco.toFixed(2)} | 📦 ${p.estoque} em estoque`);
      embed.addFields({ name: `📂 ${cat}`, value: linhas.join('\n') });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
