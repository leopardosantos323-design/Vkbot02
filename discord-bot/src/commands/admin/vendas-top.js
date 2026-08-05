const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vendas-top')
    .setDescription('[ADMIN] Ranking dos produtos mais vendidos'),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const vendas = db.getVendas();
    if (vendas.length === 0) return interaction.reply({ content: '📊 Nenhuma venda registrada.', ephemeral: true });

    const ranking = {};
    for (const v of vendas) {
      if (!ranking[v.produto]) ranking[v.produto] = { qtd: 0, total: 0 };
      ranking[v.produto].qtd += v.quantidade;
      ranking[v.produto].total += v.preco;
    }

    const sorted = Object.entries(ranking).sort((a, b) => b[1].qtd - a[1].qtd).slice(0, 10);
    const medals = ['🥇', '🥈', '🥉'];
    const linhas = sorted.map(([nome, dados], i) =>
      `${medals[i] || `${i + 1}.`} **${nome}** — ${dados.qtd} vendidos — R$ ${dados.total.toFixed(2)}`
    );

    const embed = new EmbedBuilder()
      .setTitle('🏆 Top Produtos Mais Vendidos')
      .setDescription(linhas.join('\n'))
      .setColor(0xFEE75C)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
