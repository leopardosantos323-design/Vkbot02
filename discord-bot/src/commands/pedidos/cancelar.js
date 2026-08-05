const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancelar')
    .setDescription('Cancelar um pedido (somente se estiver aguardando entrega)')
    .addStringOption(o => o.setName('id').setDescription('ID do pedido').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('id').toUpperCase();
    const pedido = db.getPedido(id);

    if (!pedido) return interaction.reply({ content: `❌ Pedido \`${id}\` não encontrado.`, ephemeral: true });
    if (pedido.userId !== interaction.user.id && !interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '🚫 Este pedido não é seu.', ephemeral: true });
    }
    if (pedido.status !== 'Aguardando entrega') {
      return interaction.reply({ content: `❌ Não é possível cancelar um pedido com status **${pedido.status}**.`, ephemeral: true });
    }

    // Estornar saldo e estoque
    db.updateSaldo(pedido.userId, pedido.preco);
    const produto = db.getProduto(pedido.produto);
    if (produto) db.updateProduto(pedido.produto, { estoque: produto.estoque + pedido.quantidade });
    db.updatePedido(id, { status: 'Cancelado' });

    await interaction.reply({
      content: `✅ Pedido \`${id}\` cancelado!\n💰 **R$ ${pedido.preco.toFixed(2)}** devolvido ao seu saldo.`,
      ephemeral: true,
    });
  },
};
