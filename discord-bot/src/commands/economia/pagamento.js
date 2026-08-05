const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pagamento')
    .setDescription('Ver informações de pagamento e como adicionar saldo'),
  async execute(interaction) {
    const config = db.getConfig();
    const embed = new EmbedBuilder()
      .setTitle('💳 Como Realizar Pagamento')
      .setColor(0x5865F2)
      .setDescription('Para adicionar saldo e realizar compras, faça o pagamento via PIX:')
      .addFields(
        { name: '🔑 Chave PIX', value: config.pix ? `\`${config.pix}\`` : '❌ Não configurada. Use /configurarpix' },
        { name: '📋 Instruções', value: '1️⃣ Faça o PIX com o valor desejado\n2️⃣ Envie o comprovante no ticket de suporte (/ticket)\n3️⃣ Aguarde a confirmação do admin' },
      )
      .setFooter({ text: 'Use /ticket para abrir suporte e enviar comprovante' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
