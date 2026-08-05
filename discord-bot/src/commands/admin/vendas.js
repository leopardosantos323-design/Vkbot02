const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vendas')
    .setDescription('[ADMIN] Ver vendas realizadas')
    .addIntegerOption(o => o.setName('limite').setDescription('Quantidade de vendas para exibir (padrão: 10)').setMinValue(1).setMaxValue(25)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const limite = interaction.options.getInteger('limite') || 10;
    const vendas = db.getVendas().slice(-limite).reverse();

    if (vendas.length === 0) return interaction.reply({ content: '📊 Nenhuma venda registrada ainda.', ephemeral: true });

    const total = vendas.reduce((acc, v) => acc + v.preco, 0);
    const linhas = vendas.map(v =>
      `> \`${v.id}\` **${v.produto}** x${v.quantidade} — R$ ${v.preco.toFixed(2)} — <@${v.userId}> — ${new Date(v.data).toLocaleDateString('pt-BR')}`
    );

    const embed = new EmbedBuilder()
      .setTitle('📊 Vendas Recentes')
      .setDescription(linhas.join('\n'))
      .setColor(0x57F287)
      .addFields({ name: `💰 Total (últimas ${vendas.length})`, value: `R$ ${total.toFixed(2)}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
