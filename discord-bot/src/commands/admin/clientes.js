const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clientes')
    .setDescription('[ADMIN] Listar clientes com mais compras'),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const vendas = db.getVendas();
    if (vendas.length === 0) return interaction.reply({ content: '👥 Nenhum cliente ainda.', ephemeral: true });

    const clientes = {};
    for (const v of vendas) {
      if (!clientes[v.userId]) clientes[v.userId] = { qtd: 0, total: 0, username: v.username };
      clientes[v.userId].qtd += v.quantidade;
      clientes[v.userId].total += v.preco;
    }

    const sorted = Object.entries(clientes).sort((a, b) => b[1].total - a[1].total).slice(0, 10);
    const linhas = sorted.map(([id, dados], i) =>
      `${i + 1}. <@${id}> (${dados.username}) — ${dados.qtd} compra(s) — R$ ${dados.total.toFixed(2)}`
    );

    const embed = new EmbedBuilder()
      .setTitle('👥 Top Clientes')
      .setDescription(linhas.join('\n'))
      .setColor(0x5865F2)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
