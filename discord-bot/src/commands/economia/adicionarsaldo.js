const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adicionarsaldo')
    .setDescription('[ADMIN] Adicionar saldo a um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addNumberOption(o => o.setName('valor').setDescription('Valor a adicionar').setRequired(true).setMinValue(0.01)),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const alvo = interaction.options.getUser('usuario');
    const valor = interaction.options.getNumber('valor');
    const novoSaldo = db.updateSaldo(alvo.id, valor);

    await interaction.reply({
      content: `✅ Adicionado **R$ ${valor.toFixed(2)}** para ${alvo}.\n💰 Saldo atual: **R$ ${novoSaldo.toFixed(2)}**`,
    });
  },
};
