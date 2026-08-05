const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/db');

function isAdmin(interaction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  if (!adminRoleId) return interaction.member.permissions.has('Administrator');
  return interaction.member.roles.cache.has(adminRoleId) || interaction.member.permissions.has('Administrator');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addproduto')
    .setDescription('[ADMIN] Adicionar um novo produto à loja')
    .addStringOption(o => o.setName('nome').setDescription('Nome do produto').setRequired(true))
    .addNumberOption(o => o.setName('preco').setDescription('Preço em R$').setRequired(true).setMinValue(0.01))
    .addIntegerOption(o => o.setName('estoque').setDescription('Quantidade em estoque').setRequired(true).setMinValue(0))
    .addStringOption(o => o.setName('categoria').setDescription('Categoria do produto'))
    .addStringOption(o => o.setName('descricao').setDescription('Descrição do produto')),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: '🚫 Sem permissão.', ephemeral: true });

    const nome = interaction.options.getString('nome');
    if (db.getProduto(nome)) return interaction.reply({ content: `❌ Produto **${nome}** já existe.`, ephemeral: true });

    const produto = {
      nome,
      preco: interaction.options.getNumber('preco'),
      estoque: interaction.options.getInteger('estoque'),
      categoria: interaction.options.getString('categoria') || 'Geral',
      descricao: interaction.options.getString('descricao') || '',
      criadoEm: new Date().toISOString(),
    };
    db.addProduto(produto);

    await interaction.reply({
      content: `✅ Produto **${nome}** adicionado!\n💰 Preço: R$ ${produto.preco.toFixed(2)} | 📦 Estoque: ${produto.estoque}`,
    });
  },
};
