/* ================================
   STORE.JS - Versão completa funcional
   ================================ */

console.log('store.js carregado');

// PRODUTOS - Produtos principais da loja
// ✅ Validação: disabled, stock, promoPrice
const PRODUCTS = [
  { id: 1, name: "Minecraft Premium", price: 60.00, promoPrice: 40.90, promoEnabled: true, img: "assets/images/minejava.png", description: "Conta Minecraft Java Edition original", disabled: false },
  { id: 2, name: "Valorant Mista", price: 150.00, promoPrice: 0, promoEnabled: false, img: "assets/images/conta valorant.png", description: "Conta com skins exclusivas", disabled: false },
  { id: 3, name: "Discord Nitro", price: 19.90, promoPrice: 0, promoEnabled: false, img: "assets/images/discordnitro.png", description: "Nitro ativo com badges", disabled: false },
  { id: 4, name: "Xbox Game Pass", price: 34.90, promoPrice: 0, promoEnabled: false, img: "assets/images/xbox.png", description: "Acesso a jogos do Xbox", disabled: false },
  { id: 5, name: "Dinheiro GTA ONLINE", price: 99.90, promoPrice: 79.90, promoEnabled: true, img: "assets/images/gta.png", description: "Descrição aqui", disabled: false },
  { id: 6, name: "Epic Games Conta Sortida", price: 3.00, promoPrice: 0, promoEnabled: false, img: "assets/images/epic.png", description: "Assinatura para jogos PS", disabled: true }
]
// Expor produtos globalmente
window.PRODUCTS = PRODUCTS;

// Funções do store
window.getProducts = function() {
  return PRODUCTS.slice();
};

window.getCart = function() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
};

window.saveCart = function(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
};

window.addToCart = function(product, qty = 1) {
  // ✅ Validação robusta
  if (!product || product.disabled) {
    console.warn('❌ Produto desabilitado:', product?.name);
    if (window.showToast) window.showToast('Produto indisponível!', 'warning');
    return false;
  }
  if (product.stock !== undefined && product.stock < qty) {
    console.warn('❌ Estoque insuficiente:', product.name);
    if (window.showToast) window.showToast(`Estoque: ${product.stock} unidades`, 'warning');
    return false;
  }
  const cart = window.getCart();
  const existing = cart.find(i => i.id == product.id);
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty || 1);
    if (!existing.img && product.img) existing.img = product.img;
  } else {
    cart.push({ id: product.id, name: product.name, price: Number(product.price), qty: Number(qty || 1), img: product.img || '' });
  }
  window.saveCart(cart);
  console.log('✅ Adicionado:', product.name);
  return true;
};

window.updateQuantity = function(id, qty) {
  const cart = window.getCart();
  const idx = cart.findIndex(i => i.id == id);
  if (idx === -1) return;
  qty = Number(qty);
  if (qty <= 0) cart.splice(idx, 1);
  else cart[idx].qty = qty;
  window.saveCart(cart);
};

window.removeFromCart = function(id) {
  const cart = window.getCart();
  const idx = cart.findIndex(i => i.id == id);
  if (idx !== -1) {
    cart.splice(idx, 1);
    window.saveCart(cart);
  }
};

window.clearCart = function() {
  window.saveCart([]);
};

window.getProductPrice = function(product) {
  // ✅ Preço efetivo (considera promo)
  if (product.promoEnabled && product.promoPrice > 0 && product.promoPrice < product.price) {
    return Number(product.promoPrice);
  }
  return Number(product.price);
};

window.getCartTotal = function() {
  const cart = window.getCart();
  return cart.reduce((total, item) => {
    const product = window.getProductById(item.id);
    const price = product ? window.getProductPrice(product) : Number(item.price);
    return total + price * (Number(item.qty) || 1);
  }, 0);
};

window.getCartCount = function() {
  const cart = window.getCart();
  return cart.reduce((total, item) => total + (Number(item.qty) || 1), 0);
};

window.applyCoupon = function(code, percentage, expires = null) {
  // ✅ Cupons com expiração opcional (dias)
  const coupon = {
    code: code.toUpperCase(),
    percentage: Math.max(0, Math.min(90, Number(percentage))), // 0-90%
    expires: expires ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000).toISOString() : null,
    appliedAt: new Date().toISOString()
  };
  localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
  console.log('🎟️ Cupom aplicado:', code, percentage + '%', expires ? `expira em ${expires} dias` : 'sem expiração');
};

window.removeCoupon = function() {
  localStorage.removeItem('appliedCoupon');
};

window.getAppliedCoupon = function() {
  try {
    const raw = localStorage.getItem('appliedCoupon');
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
};

window.getDiscount = function(subtotal) {
  const coupon = window.getAppliedCoupon();
  if (!coupon) return 0;
  
  // ✅ Validação cupom expirado
  if (coupon.expires && new Date(coupon.expires) < new Date()) {
    window.removeCoupon();
    return 0;
  }
  
  return (subtotal * coupon.percentage) / 100;
};

window.getCartTotalWithDiscount = function() {
  const subtotal = window.getCartTotal();
  const discount = window.getDiscount(subtotal);
  return subtotal - discount;
};

window.addProduct = function(product) {
  console.log('🛒 addProduct chamado', product);
  var newId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(function(p) { return p.id; })) + 1 : 1;
  product.id = newId;
  product.promoPrice = product.promoPrice || 0;
  product.promoEnabled = product.promoEnabled || false;
  product.disabled = product.disabled || false;
  product.img = product.img || 'assets/icons/XD2.png';
  product.description = product.description || '';
  PRODUCTS.push(product);
  window.PRODUCTS = PRODUCTS;
  console.log('✅ Produto adicionado:', product.name, '| Total:', PRODUCTS.length);
  if (window.renderProducts) {
    console.log('🔄 Chamando renderProducts()...');
    window.renderProducts();
  }
  return product;
};

window.removeProduct = function(id) {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index !== -1) {
    const removed = PRODUCTS.splice(index, 1)[0];
    window.PRODUCTS = PRODUCTS;
    console.log('❌ Produto removido:', removed.name);
    if (window.renderProducts) window.renderProducts();
    return true;
  }
  console.warn('Produto ID ' + id + ' não encontrado');
  return false;
};

window.updateProduct = function(id, updates) {
  const product = PRODUCTS.find(p => p.id === id);
  if (product) {
    Object.assign(product, updates);
    window.PRODUCTS = PRODUCTS;
    console.log('✅ Produto ID ' + id + ' atualizado');
    if (window.renderProducts) window.renderProducts();
    return product;
  }
  console.warn('Produto ID ' + id + ' não encontrado');
  return null;
};

window.clearAllProducts = function() {
  const count = PRODUCTS.length;
  PRODUCTS.length = 0;
  window.PRODUCTS = PRODUCTS;
  console.log('❌ ' + count + ' produtos removidos');
  if (window.renderProducts) window.renderProducts();
};

window.removeProduct = function(id) {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index !== -1) {
    const removed = PRODUCTS.splice(index, 1)[0];
    window.PRODUCTS = PRODUCTS;
    return true;
  }
  return false;
};

window.updateProduct = function(id, updates) {
  const product = PRODUCTS.find(p => p.id === id);
  if (product) {
    Object.assign(product, updates);
    window.PRODUCTS = PRODUCTS;
    return product;
  }
  return null;
};

window.listProducts = function() {
  console.table(PRODUCTS.map(p => ({
    ID: p.id,
    Nome: p.name,
    Preço: 'R$ ' + Number(p.price).toFixed(2),
    Promo: p.promoEnabled ? 'R$ ' + Number(p.promoPrice).toFixed(2) : 'Não',
    Imagem: p.img
  })));
  return PRODUCTS;
};

window.getProductById = function(id) {
  return PRODUCTS.find(p => p.id === id) || null;
};

window.isProductDisabled = function(id) {
  const product = window.getProductById(id);
  return !!(product && product.disabled);
};

window.setProductDisabled = function(id, disabled) {
  return window.updateProduct(id, { disabled: !!disabled });
};

window.disableProduct = function(id) {
  return window.setProductDisabled(id, true);
};

window.enableProduct = function(id) {
  return window.setProductDisabled(id, false);
};

// ✅ Eventos para sync UI (Observador pattern)
window.addEventListener('store:cartUpdated', function() {
  if (window.renderCart) window.renderCart();
});

window.dispatchCartUpdate = function() {
  window.dispatchEvent(new CustomEvent('store:cartUpdated'));
};

console.log('✅ Store v2.0 - Melhorias funcionais aplicadas!');
console.log('🆕 Novas features: getProductPrice(), coupons expiração, validação stock, eventos!');


console.log('✅ Store functions expostas globalmente');
