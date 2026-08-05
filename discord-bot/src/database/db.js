const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readFile(filename) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFile(filename, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ─── Produtos ───────────────────────────────────────────────────────────────

const db = {
  // Config geral
  getConfig() {
    return readFile('config.json') || { pix: null, ticketCategory: null, lojaInfo: { nome: 'Minha Loja', descricao: 'Bem-vindo à nossa loja!' } };
  },
  saveConfig(config) {
    writeFile('config.json', config);
  },

  // Produtos
  getProdutos() {
    return readFile('produtos.json') || [];
  },
  saveProdutos(produtos) {
    writeFile('produtos.json', produtos);
  },
  getProduto(nome) {
    return this.getProdutos().find(p => p.nome.toLowerCase() === nome.toLowerCase());
  },
  addProduto(produto) {
    const produtos = this.getProdutos();
    produtos.push(produto);
    this.saveProdutos(produtos);
  },
  updateProduto(nome, dados) {
    const produtos = this.getProdutos();
    const idx = produtos.findIndex(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (idx === -1) return false;
    produtos[idx] = { ...produtos[idx], ...dados };
    this.saveProdutos(produtos);
    return true;
  },
  removeProduto(nome) {
    const produtos = this.getProdutos();
    const novos = produtos.filter(p => p.nome.toLowerCase() !== nome.toLowerCase());
    if (novos.length === produtos.length) return false;
    this.saveProdutos(novos);
    return true;
  },

  // Usuários (saldo)
  getUsuarios() {
    return readFile('usuarios.json') || {};
  },
  saveUsuarios(usuarios) {
    writeFile('usuarios.json', usuarios);
  },
  getUsuario(userId) {
    const usuarios = this.getUsuarios();
    if (!usuarios[userId]) {
      usuarios[userId] = { saldo: 0, compras: 0, avaliacao: null };
      this.saveUsuarios(usuarios);
    }
    return usuarios[userId];
  },
  updateSaldo(userId, valor) {
    const usuarios = this.getUsuarios();
    if (!usuarios[userId]) usuarios[userId] = { saldo: 0, compras: 0 };
    usuarios[userId].saldo += valor;
    this.saveUsuarios(usuarios);
    return usuarios[userId].saldo;
  },

  // Pedidos
  getPedidos() {
    return readFile('pedidos.json') || [];
  },
  savePedidos(pedidos) {
    writeFile('pedidos.json', pedidos);
  },
  addPedido(pedido) {
    const pedidos = this.getPedidos();
    pedidos.push(pedido);
    this.savePedidos(pedidos);
  },
  getPedido(id) {
    return this.getPedidos().find(p => p.id === id);
  },
  updatePedido(id, dados) {
    const pedidos = this.getPedidos();
    const idx = pedidos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    pedidos[idx] = { ...pedidos[idx], ...dados };
    this.savePedidos(pedidos);
    return true;
  },
  getPedidosUsuario(userId) {
    return this.getPedidos().filter(p => p.userId === userId);
  },

  // Cupons
  getCupons() {
    return readFile('cupons.json') || {};
  },
  saveCupons(cupons) {
    writeFile('cupons.json', cupons);
  },
  getCupom(codigo) {
    return this.getCupons()[codigo.toUpperCase()] || null;
  },

  // Blacklist
  getBlacklist() {
    return readFile('blacklist.json') || [];
  },
  saveBlacklist(lista) {
    writeFile('blacklist.json', lista);
  },
  isBlacklisted(userId) {
    return this.getBlacklist().includes(userId);
  },
  addBlacklist(userId) {
    const lista = this.getBlacklist();
    if (!lista.includes(userId)) { lista.push(userId); this.saveBlacklist(lista); }
  },
  removeBlacklist(userId) {
    const lista = this.getBlacklist().filter(id => id !== userId);
    this.saveBlacklist(lista);
  },

  // Vendas
  getVendas() {
    return readFile('vendas.json') || [];
  },
  saveVendas(vendas) {
    writeFile('vendas.json', vendas);
  },
  addVenda(venda) {
    const vendas = this.getVendas();
    vendas.push(venda);
    this.saveVendas(vendas);
  },

  // Avaliações
  getAvaliacoes() {
    return readFile('avaliacoes.json') || [];
  },
  saveAvaliacoes(avaliacoes) {
    writeFile('avaliacoes.json', avaliacoes);
  },
  addAvaliacao(avaliacao) {
    const avaliacoes = this.getAvaliacoes();
    avaliacoes.push(avaliacao);
    this.saveAvaliacoes(avaliacoes);
  },
};

module.exports = db;
