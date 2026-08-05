const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('saldo')
    .setDescription('Ver seu saldo atual'),
  async execute(interaction) {
    const usuario = db.getUsuario(interaction.user.id);
    const embed = new EmbedBuilder()
      .setTitle('💰 Seu Saldo')
      .setColor(0x57F287)
      .addFields(
        { name: 'Saldo', value: `R$ ${usuario.saldo.toFixed(2)}`, inline: true },
        { name: 'Compras realizadas', value: `${usuario.compras || 0}`, inline: true },
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
