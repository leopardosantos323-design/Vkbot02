const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editarproduto')
    .setDescription('[ADMIN] Editar nome ou descrição de um produto')
    .addStringOption(o => o.setName('nome').setDescription('Nome atual do produto').setRequired(true))
    .addStringOption(o => o.setName('novonome').setDescription('Novo nome'))
    .addStringOption(o => o.setName('descricao').setDescription('Nova descrição')),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('nome');
    const novoNome = interaction.options.getString('novonome');
    const descricao = interaction.options.getString('descricao');

    const dados = {};
    if (novoNome) dados.nome = novoNome;
    if (descricao) dados.descricao = descricao;

    if (Object.keys(dados).length === 0) return interaction.reply({ content: '❌ Forneça ao menos um campo para editar.', ephemeral: true });

    const ok = db.updateProduto(nome, dados);
    if (!ok) return interaction.reply({ content: `❌ Produto **${nome}** não encontrado.`, ephemeral: true });

    const campo = novoNome ? `Nome → **${novoNome}**` : '';
    const desc = descricao ? `Descrição atualizada.` : '';
    await interaction.reply({ content: `✅ Produto **${nome}** atualizado! ${campo} ${desc}` });
  },
};
