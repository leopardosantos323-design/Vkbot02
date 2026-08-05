const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ver a latência do bot'),
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Calculando...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong!\n📡 Latência: **${latency}ms**\n💓 API: **${client.ws.ping}ms**`);
  },
};
