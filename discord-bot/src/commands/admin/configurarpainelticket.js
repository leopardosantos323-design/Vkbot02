const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configurarpainelticket')
    .setDescription('[ADMIN] Enviar painel de abertura de tickets no canal atual'),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('🎫 Suporte & Atendimento')
      .setDescription('Clique no botão abaixo para abrir um ticket de suporte.\n\nUse para:\n• Enviar comprovante de pagamento\n• Dúvidas sobre pedidos\n• Suporte geral')
      .setColor(0x5865F2)
      .setFooter({ text: 'Um atendente irá responder em breve.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('abrir_ticket')
        .setLabel('🎫 Abrir Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de tickets enviado!', ephemeral: true });
  },
};
