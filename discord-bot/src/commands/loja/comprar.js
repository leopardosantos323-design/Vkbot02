const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comprar')
    .setDescription('Comprar um produto da loja')
    .addStringOption(o => o.setName('produto').setDescription('Nome do produto').setRequired(true))
    .addIntegerOption(o => o.setName('quantidade').setDescription('Quantidade (padrão: 1)').setMinValue(1))
    .addStringOption(o => o.setName('cupom').setDescription('Código de cupom de desconto')),
  async execute(interaction) {
    const nomeProduto = interaction.options.getString('produto');
    const qtd = interaction.options.getInteger('quantidade') || 1;
    const codigoCupom = interaction.options.getString('cupom');
    const userId = interaction.user.id;

    if (db.isBlacklisted(userId)) {
      return interaction.reply({ content: '🚫 Você está na blacklist e não pode realizar compras.', ephemeral: true });
    }

    const produto = db.getProduto(nomeProduto);
    if (!produto) return interaction.reply({ content: `❌ Produto **${nomeProduto}** não encontrado. Use /loja para ver os disponíveis.`, ephemeral: true });
    if (produto.estoque < qtd) return interaction.reply({ content: `❌ Estoque insuficiente. Disponível: **${produto.estoque}** unidade(s).`, ephemeral: true });

    const usuario = db.getUsuario(userId);
    let precoTotal = produto.preco * qtd;
    let descontoMsg = '';

    if (codigoCupom) {
      const cupom = db.getCupom(codigoCupom);
      if (!cupom) return interaction.reply({ content: '❌ Cupom inválido ou expirado.', ephemeral: true });
      const desconto = precoTotal * (cupom.percentual / 100);
      precoTotal -= desconto;
      descontoMsg = `\n🎟️ Cupom **${codigoCupom}** aplicado: -${cupom.percentual}% (-R$ ${desconto.toFixed(2)})`;
    }

    if (usuario.saldo < precoTotal) {
      return interaction.reply({
        content: `❌ Saldo insuficiente!\n💰 Seu saldo: **R$ ${usuario.saldo.toFixed(2)}**\n🛒 Total: **R$ ${precoTotal.toFixed(2)}**`,
        ephemeral: true,
      });
    }

    // Processar compra
    const pedidoId = uuidv4().slice(0, 8).toUpperCase();
    db.updateSaldo(userId, -precoTotal);
    db.updateProduto(produto.nome, { estoque: produto.estoque - qtd });

    const pedido = {
      id: pedidoId,
      userId,
      username: interaction.user.username,
      produto: produto.nome,
      quantidade: qtd,
      preco: precoTotal,
      status: 'Aguardando entrega',
      data: new Date().toISOString(),
    };
    db.addPedido(pedido);

    const venda = { ...pedido, tipo: 'venda' };
    db.addVenda(venda);

    const novoSaldo = db.getUsuario(userId).saldo;
    const embed = new EmbedBuilder()
      .setTitle('✅ Compra Realizada!')
      .setColor(0x57F287)
      .addFields(
        { name: '📦 Produto', value: `${produto.nome} x${qtd}`, inline: true },
        { name: '💰 Total Pago', value: `R$ ${precoTotal.toFixed(2)}${descontoMsg}`, inline: true },
        { name: '🆔 Pedido', value: `\`${pedidoId}\``, inline: true },
        { name: '💳 Saldo Restante', value: `R$ ${novoSaldo.toFixed(2)}`, inline: true },
        { name: '📋 Status', value: 'Aguardando entrega', inline: true },
      )
      .setFooter({ text: 'Use /pedido para ver o status · /avaliar para avaliar após receber' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
