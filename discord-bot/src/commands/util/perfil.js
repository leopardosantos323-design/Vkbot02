const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Ver seu perfil de cliente')
    .addUserOption(o => o.setName('usuario').setDescription('Ver perfil de outro usuário (admin)')),
  async execute(interaction) {
    const alvo = interaction.options.getUser('usuario') || interaction.user;
    const usuario = db.getUsuario(alvo.id);
    const pedidos = db.getPedidosUsuario(alvo.id);
    const bloqueado = db.isBlacklisted(alvo.id);
    const avaliacoes = db.getAvaliacoes().filter(a => a.userId === alvo.id);
    const mediaAvaliacao = avaliacoes.length ? (avaliacoes.reduce((a, b) => a + b.nota, 0) / avaliacoes.length).toFixed(1) : 'N/A';

    const embed = new EmbedBuilder()
      .setTitle(`👤 Perfil — ${alvo.username}`)
      .setThumbnail(alvo.displayAvatarURL())
      .setColor(bloqueado ? 0xED4245 : 0x5865F2)
      .addFields(
        { name: '💰 Saldo', value: `R$ ${usuario.saldo.toFixed(2)}`, inline: true },
        { name: '📦 Pedidos', value: `${pedidos.length}`, inline: true },
        { name: '⭐ Avaliação Média', value: mediaAvaliacao, inline: true },
        { name: '🚫 Blacklist', value: bloqueado ? 'Sim' : 'Não', inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
