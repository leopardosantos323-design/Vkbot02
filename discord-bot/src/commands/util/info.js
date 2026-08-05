const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Ver informações da loja'),
  async execute(interaction, client) {
    const config = db.getConfig();
    const produtos = db.getProdutos();
    const vendas = db.getVendas();
    const totalVendido = vendas.reduce((a, v) => a + v.preco, 0);

    const embed = new EmbedBuilder()
      .setTitle(`🏪 ${config.lojaInfo?.nome || 'Loja'}`)
      .setDescription(config.lojaInfo?.descricao || 'Bem-vindo à nossa loja!')
      .setColor(0x5865F2)
      .addFields(
        { name: '📦 Produtos', value: `${produtos.length}`, inline: true },
        { name: '✅ Vendas', value: `${vendas.length}`, inline: true },
        { name: '💰 Total Vendido', value: `R$ ${totalVendido.toFixed(2)}`, inline: true },
        { name: '🏓 Latência', value: `${client.ws.ping}ms`, inline: true },
      )
      .setFooter({ text: 'Use /loja para ver os produtos disponíveis' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
