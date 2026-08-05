const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cupom')
    .setDescription('Resgatar um cupom de desconto')
    .addStringOption(o => o.setName('codigo').setDescription('Código do cupom').setRequired(true)),
  async execute(interaction) {
    const codigo = interaction.options.getString('codigo').toUpperCase();
    const cupom = db.getCupom(codigo);

    if (!cupom) {
      return interaction.reply({ content: '❌ Cupom inválido ou expirado.', ephemeral: true });
    }

    await interaction.reply({
      content: `🎟️ Cupom **${codigo}** válido!\n💸 Desconto: **${cupom.percentual}%** em qualquer produto.\nUse ao comprar: \`/comprar <produto> cupom:${codigo}\``,
      ephemeral: true,
    });
  },
};
