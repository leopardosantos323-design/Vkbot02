const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meuspedidos')
    .setDescription('Ver todos os seus pedidos'),
  async execute(interaction) {
    const pedidos = db.getPedidosUsuario(interaction.user.id);

    if (pedidos.length === 0) return interaction.reply({ content: '📦 Você não tem pedidos ainda.', ephemeral: true });

    const ultimos = pedidos.slice(-10).reverse();
    const linhas = ultimos.map(p =>
      `> \`${p.id}\` **${p.produto}** x${p.quantidade} — ${p.status} — R$ ${p.preco.toFixed(2)}`
    );

    const embed = new EmbedBuilder()
      .setTitle('📦 Meus Pedidos')
      .setDescription(linhas.join('\n'))
      .setColor(0x5865F2)
      .setFooter({ text: `Total de pedidos: ${pedidos.length} · Exibindo os últimos 10` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
