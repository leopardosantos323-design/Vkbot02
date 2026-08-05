const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('preco')
    .setDescription('Ver o preço de um produto')
    .addStringOption(o => o.setName('produto').setDescription('Nome do produto').setRequired(true)),
  async execute(interaction) {
    const nome = interaction.options.getString('produto');
    const produto = db.getProduto(nome);

    if (!produto) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`💰 Preço — ${produto.nome}`)
      .setColor(0x5865F2)
      .addFields(
        { name: 'Preço', value: `R$ ${produto.preco.toFixed(2)}`, inline: true },
        { name: 'Estoque', value: `${produto.estoque} unidade(s)`, inline: true },
        { name: 'Categoria', value: produto.categoria || 'Geral', inline: true },
      );
    if (produto.descricao) embed.setDescription(produto.descricao);

    await interaction.reply({ embeds: [embed] });
  },
};
