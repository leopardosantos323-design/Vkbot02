const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pix')
    .setDescription('Ver a chave PIX para pagamento'),
  async execute(interaction) {
    const config = db.getConfig();
    if (!config.pix) return interaction.reply({ content: '❌ Chave PIX não configurada. Contate um administrador.', ephemeral: true });

    await interaction.reply({
      content: `💰 **Chave PIX:** \`${config.pix}\`\nApós o pagamento, abra um ticket com /ticket e envie o comprovante.`,
      ephemeral: true,
    });
  },
};
