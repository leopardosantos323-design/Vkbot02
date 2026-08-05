const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

const statusColors = {
  'Aguardando entrega': 0xFEE75C,
  'Entregue': 0x57F287,
  'Cancelado': 0xED4245,
  'Em processamento': 0x5865F2,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pedido')
    .setDescription('Ver o status de um pedido')
    .addStringOption(o => o.setName('id').setDescription('ID do pedido').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('id').toUpperCase();
    const pedido = db.getPedido(id);

    if (!pedido) return interaction.reply({ content: `❌ Pedido \`${id}\` não encontrado.`, ephemeral: true });
    if (pedido.userId !== interaction.user.id && !interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '🚫 Este pedido não é seu.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📦 Pedido #${pedido.id}`)
      .setColor(statusColors[pedido.status] || 0x5865F2)
      .addFields(
        { name: 'Produto', value: `${pedido.produto} x${pedido.quantidade}`, inline: true },
        { name: 'Total', value: `R$ ${pedido.preco.toFixed(2)}`, inline: true },
        { name: 'Status', value: pedido.status, inline: true },
        { name: 'Data', value: new Date(pedido.data).toLocaleString('pt-BR'), inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
