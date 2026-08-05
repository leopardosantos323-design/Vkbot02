const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avaliar')
    .setDescription('Avaliar sua compra')
    .addStringOption(o => o.setName('pedido').setDescription('ID do pedido').setRequired(true))
    .addIntegerOption(o => o.setName('nota').setDescription('Nota de 1 a 5').setRequired(true).setMinValue(1).setMaxValue(5))
    .addStringOption(o => o.setName('comentario').setDescription('Comentário (opcional)')),
  async execute(interaction) {
    const pedidoId = interaction.options.getString('pedido').toUpperCase();
    const nota = interaction.options.getInteger('nota');
    const comentario = interaction.options.getString('comentario') || '';
    const userId = interaction.user.id;

    const pedido = db.getPedido(pedidoId);
    if (!pedido) return interaction.reply({ content: `❌ Pedido \`${pedidoId}\` não encontrado.`, ephemeral: true });
    if (pedido.userId !== userId) return interaction.reply({ content: '🚫 Este pedido não é seu.', ephemeral: true });
    if (pedido.status !== 'Entregue') return interaction.reply({ content: '❌ Só é possível avaliar pedidos já entregues.', ephemeral: true });

    const avaliacoes = db.getAvaliacoes();
    if (avaliacoes.find(a => a.pedidoId === pedidoId)) {
      return interaction.reply({ content: '⚠️ Você já avaliou este pedido.', ephemeral: true });
    }

    const stars = '⭐'.repeat(nota) + '☆'.repeat(5 - nota);
    db.addAvaliacao({ pedidoId, userId, produto: pedido.produto, nota, comentario, data: new Date().toISOString() });

    await interaction.reply({
      content: `✅ Avaliação registrada!\n${stars} **${nota}/5** para **${pedido.produto}**\n${comentario ? `💬 "${comentario}"` : ''}`,
    });
  },
};
