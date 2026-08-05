const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abrir um ticket de suporte')
    .addStringOption(o => o.setName('assunto').setDescription('Assunto do ticket').setRequired(true)),
  async execute(interaction) {
    const assunto = interaction.options.getString('assunto');
    const guild = interaction.guild;
    const userId = interaction.user.id;

    // Verificar se já tem ticket aberto
    const existente = guild.channels.cache.find(c => c.name === `ticket-${userId}`);
    if (existente) {
      return interaction.reply({ content: `❌ Você já tem um ticket aberto: ${existente}`, ephemeral: true });
    }

    try {
      const canal = await guild.channels.create({
        name: `ticket-${userId}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
          { id: userId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
          { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
        ],
      });

      if (process.env.ADMIN_ROLE_ID) {
        await canal.permissionOverwrites.create(process.env.ADMIN_ROLE_ID, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('fechar_ticket')
          .setLabel('🔒 Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await canal.send({
        content: `👋 Olá ${interaction.user}! Seu ticket foi aberto.\n**Assunto:** ${assunto}\n\nUm atendente irá te ajudar em breve. Use o botão abaixo para fechar quando resolver.`,
        components: [row],
      });

      await interaction.reply({ content: `✅ Ticket aberto! ${canal}`, ephemeral: true });
    } catch (err) {
      console.error('Erro ao criar ticket:', err);
      await interaction.reply({ content: '❌ Não foi possível criar o ticket. Verifique se o bot tem permissão de gerenciar canais.', ephemeral: true });
    }
  },
};
