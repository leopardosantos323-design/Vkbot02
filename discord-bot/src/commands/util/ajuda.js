const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Lista completa de comandos disponíveis'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Lista de Comandos')
      .setColor(0x5865F2)
      .addFields(
        {
          name: '🛒 Loja',
          value: '`/loja` Ver produtos\n`/comprar` Comprar produto\n`/estoque` Ver estoque\n`/stock` Estoque rápido\n`/preco` Ver preço',
        },
        {
          name: '💰 Economia',
          value: '`/saldo` Ver saldo\n`/pagamento` Info de pagamento\n`/pix` Ver chave PIX',
        },
        {
          name: '📦 Pedidos',
          value: '`/pedido` Status de pedido\n`/meuspedidos` Seus pedidos\n`/cancelar` Cancelar pedido',
        },
        {
          name: '📊 Utilidades',
          value: '`/perfil` Seu perfil\n`/cupom` Resgatar cupom\n`/avaliar` Avaliar compra\n`/ticket` Abrir suporte\n`/info` Info da loja\n`/ping` Latência do bot',
        },
        {
          name: '👑 Admin',
          value: '`/addproduto` `/removerproduto` `/editarproduto`\n`/setpreco` `/setcategoria` `/addstock`\n`/removestock` `/restock` `/adicionarsaldo`\n`/removersaldo` `/vendas` `/vendas-top`\n`/clientes` `/blacklist` `/unblacklist`\n`/configurarpix` `/configurarpainelticket`',
        },
      )
      .setFooter({ text: 'Bot de Vendas · Use /info para mais informações da loja' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
