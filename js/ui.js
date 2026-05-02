/* ================================
   UI.JS - Versão final robusta
   ================================ */

console.log('🚀 ui.js carregado');

// ========== UTILITÁRIOS ==========
function toBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

function getImagePath(assetPath) {
  if (!assetPath) return 'assets/icons/XD2.png';
  
  var isProductPage = window.location.pathname.includes('/pages/produtos/');
  
  if (isProductPage && assetPath.startsWith('assets/')) {
    return '../../' + assetPath;
  }
  return assetPath;
}

// ========== RENDERIZAR PRODUTOS ==========
function renderProducts(products) {
  var container = document.querySelector('.products-list');
  if (!container) {
    console.error('❌ Container .products-list não encontrado');
    return;
  }

  if (!products && window.getProducts) {
    products = window.getProducts();
    console.log('📦 Produtos obtidos do store:', products.length, products.map(function(p) { return p.name; }));
  }

  if (!products || !Array.isArray(products)) {
    console.error('❌ Produtos inválidos');
    return;
  }

  console.log('🔄 Renderizando', products.length, 'produtos');
  container.innerHTML = '';

  // ➕ Loading skeleton enquanto renderiza
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="skeleton-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;padding:40px 0;"><div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div></div>';
    return;
  }

  products.forEach(function(p, i) {
    try {
      var card = document.createElement('article');
      var isDisabled = !!p.disabled;
      card.className = 'product-card' + (isDisabled ? ' product-disabled' : '');
      // Animação será controlada via CSS com stagger usando nth-child

       var price = Number(p.price) || 0;
       var hasPromo = p.promoEnabled && p.promoPrice && p.promoPrice < price;
        var priceHTML = hasPromo
          ? '<span class="price-old">' + toBRL(price) + '</span><span class="price-new">' + toBRL(p.promoPrice) + '</span>'
          : toBRL(price);
        var badge = hasPromo ? '<div class="badge-promo">🔥 Oferta</div>' : '';
        var disabledBadge = isDisabled ? '<div class="badge-disabled">Indisponível</div>' : '';
        var addButtonAttrs = isDisabled ? 'disabled aria-disabled="true"' : '';
        var addButtonLabel = isDisabled ? 'Indisponível' : 'Adicionar ao carrinho';

        // Gerar slug do produto para URL
        var productSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        var imgPath = getImagePath(p.img);

        card.innerHTML = `
          ${badge}
          ${disabledBadge}
          <div class="product-image">
            <img src="${imgPath || 'assets/icons/XD2.png'}" alt="${p.name || 'Produto'}" loading="lazy" onerror="this.src='${getImagePath('assets/icons/XD2.png')}'">
          </div>
          <div class="product-info">
            <h3 class="product-name">${p.name || 'Sem nome'}</h3>
            <p class="product-price">${priceHTML}</p>
            <div class="product-actions">
              <button type="button" class="product-button" data-id="${p.id}" ${addButtonAttrs}>${addButtonLabel}</button>
              <a href="${isDisabled ? '#' : 'pages/produtos/' + productSlug + '.html'}" class="product-details-btn${isDisabled ? ' disabled' : ''}" ${isDisabled ? 'aria-disabled="true" tabindex="-1"' : ''}>Ver Detalhes</a>
            </div>
          </div>
        `;
        // Armazenar URL de detalhes no data attribute
        card.dataset.detailsUrl = 'pages/produtos/' + productSlug + '.html';
      container.appendChild(card);
    } catch (err) {
      console.error('❌ Erro ao renderizar produto', p, err);
    }
  });

  console.log('✅ Renderização concluída. Cards criados:', container.children.length);

  bindAddToCartButtons();
  bindProductCardClicks();
  setTimeout(forceProductImages, 100);
}

// ========== RENDERIZAR CARRINHO ==========
function renderCart() {
  var cartItems = document.querySelector('.cart-items');
  var cartCountEl = document.querySelector('.cart-count');
  var cartTotalEl = document.getElementById('cart-total');

  if (!cartItems) return;

  var cart = window.getCart ? window.getCart() : [];
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty" style="text-align:center;padding:40px;color:var(--muted);"><p>Seu carrinho está vazio.</p></div>';
  } else {
    cart.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'cart-item';
      var imgPath = getImagePath(item.img);
      div.innerHTML = `
        <div class="cart-item-left">
          <div class="cart-thumb"><img src="${imgPath || 'assets/icons/XD2.png'}" alt="${item.name}" onerror="this.src='${getImagePath('assets/icons/XD2.png')}'"></div>
          <div class="cart-meta">
            <div class="cart-name">${item.name}</div>
            <div class="cart-price">${toBRL(item.price)}</div>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="qty-controls">
            <button class="qty-decrease" data-id="${item.id}">−</button>
            <input class="qty-input" data-id="${item.id}" type="number" min="1" value="${item.qty}">
            <button class="qty-increase" data-id="${item.id}">+</button>
          </div>
          <div class="cart-sub">${toBRL(item.price * item.qty)}</div>
          <button class="remove-item" data-id="${item.id}">✕</button>
        </div>
      `;
      cartItems.appendChild(div);
    });
  }

  if (cartCountEl) cartCountEl.textContent = window.getCartCount ? window.getCartCount() : 0;
  if (cartTotalEl) cartTotalEl.textContent = toBRL(window.getCartTotal ? window.getCartTotal() : 0);

  // Checkout button
  var checkoutBtn = document.querySelector('.checkout-button');
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.classList.add('disabled');
      checkoutBtn.setAttribute('aria-disabled', 'true');
      checkoutBtn.setAttribute('tabindex', '-1');
    } else {
      checkoutBtn.classList.remove('disabled');
      checkoutBtn.removeAttribute('aria-disabled');
      checkoutBtn.removeAttribute('tabindex');
    }
  }

  bindCartItemEvents();
}

function bindAddToCartButtons() {
  document.querySelectorAll('.product-card .product-button').forEach(function(btn) {
    btn.onclick = function(e) {
      if (this.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      var id = this.dataset.id;
      var products = window.getProducts ? window.getProducts() : [];
      var product = products.find(function(p) { return p.id == id; });
      if (!product || product.disabled) return;

      if (window.addToCart) window.addToCart(product, 1);
      renderCart();

      // Abrir carrinho
      var cartSidebar = document.getElementById('cart-sidebar');
      var cartOverlay = document.getElementById('cart-overlay');
      if (cartSidebar) cartSidebar.classList.add('active');
      if (cartOverlay) cartOverlay.classList.add('active');

      // Toast
      if (window.showToast) window.showToast(product.name + ' adicionado!', 'success');
      else alert(product.name + ' adicionado ao carrinho!');

      // Feedback visual
      this.textContent = 'Adicionado ✓';
      this.style.background = '#10b981';
      setTimeout(function() {
        btn.textContent = 'Adicionar ao carrinho';
        btn.style.background = '';
      }, 900);
    };
  });
}

// ========== VINCULAR CLIQUES NOS CARDS ==========
function bindProductCardClicks() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    card.onclick = function(e) {
      // Não navegar se foi clicado em um elemento interativo (botões, links)
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.product-actions')) {
        return;
      }

      if (card.classList.contains('product-disabled')) {
        return;
      }

      // Navegar para página de detalhes
      var detailsUrl = this.dataset.detailsUrl;
      if (detailsUrl) {
        window.location.href = detailsUrl;
      }
    };

    // Adicionar cursor pointer visual no hover
    card.style.cursor = 'pointer';
  });
}

function bindCartItemEvents() {
  document.querySelectorAll('.qty-increase').forEach(function(b) {
    b.onclick = function() {
      var id = this.dataset.id;
      var input = document.querySelector('.qty-input[data-id="' + id + '"]');
      if (window.updateQuantity) window.updateQuantity(id, Number(input.value || 1) + 1);
      renderCart();
    };
  });

  document.querySelectorAll('.qty-decrease').forEach(function(b) {
    b.onclick = function() {
      var id = this.dataset.id;
      var input = document.querySelector('.qty-input[data-id="' + id + '"]');
      var newQ = Number(input.value || 1) - 1;
      if (window.updateQuantity) window.updateQuantity(id, newQ);
      renderCart();
    };
  });

  document.querySelectorAll('.qty-input').forEach(function(inp) {
    inp.onchange = function() {
      var id = this.dataset.id;
      var v = Number(this.value || 1);
      if (isNaN(v) || v < 1) {
        this.value = 1;
        if (window.updateQuantity) window.updateQuantity(id, 1);
      } else {
        if (window.updateQuantity) window.updateQuantity(id, v);
      }
      renderCart();
    };
  });

  document.querySelectorAll('.remove-item').forEach(function(b) {
    b.onclick = function() {
      if (window.removeFromCart) window.removeFromCart(this.dataset.id);
      renderCart();
    };
  });
}

// ========== TEMA ==========
function setTheme(theme) {
  try {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('xd-theme', theme);
  } catch(e) {}
}

function toggleTheme() {
  var current = localStorage.getItem('xd-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  var saved = localStorage.getItem('xd-theme') || 'dark';
  setTheme(saved);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.onclick = toggleTheme;
}

// ========== MARQUEE ==========
function initMarquee() {
  var marquee = document.querySelector('.marquee');
  if (!marquee) return;

  var spans = marquee.querySelectorAll('span');
  if (spans.length < 2) {
    var text = marquee.textContent.trim();
    marquee.innerHTML = '<span>' + text + '</span><span aria-hidden="true">' + text + '</span>';
  }

  var first = marquee.querySelector('span');
  if (!first) return;

  var styleId = 'xd-marquee-style';
  var existing = document.getElementById(styleId);
  if (existing) existing.remove();

  var shift = first.offsetWidth + 32;
  var speed = 60;
  var duration = Math.max(6, Math.round((shift / speed) * 10) / 10);

  var style = document.createElement('style');
  style.id = styleId;
  style.textContent = '@keyframes xdMarquee { 0%{ transform: translateX(0); } 100%{ transform: translateX(-' + shift + 'px); } } .marquee { animation: xdMarquee ' + duration + 's linear infinite !important; }';
  document.head.appendChild(style);
}

// ========== MOBILE ==========
function detectMobile() {
  document.body.classList.toggle('mobile', window.innerWidth < 768);
}

// ========== BUSCA E FILTROS ==========
function filterProducts() {
  var products = window.getProducts ? window.getProducts() : [];
  var search = window.currentSearch || '';
  var filter = window.currentFilter || 'all';

  if (search) {
    search = search.toLowerCase().trim();
    products = products.filter(function(p) {
      return (p.name && p.name.toLowerCase().includes(search)) ||
             (p.description && p.description.toLowerCase().includes(search));
    });
  }

  switch (filter) {
    case 'promo':
      products = products.filter(function(p) { return p.promoEnabled && p.promoPrice < p.price; });
      break;
    case 'low':
      products.sort(function(a, b) {
        var pa = a.promoEnabled && a.promoPrice < a.price ? a.promoPrice : a.price;
        var pb = b.promoEnabled && b.promoPrice < b.price ? b.promoPrice : b.price;
        return pa - pb;
      });
      break;
    case 'high':
      products.sort(function(a, b) {
        var pa = a.promoEnabled && a.promoPrice < a.price ? a.promoPrice : a.price;
        var pb = b.promoEnabled && b.promoPrice < b.price ? b.promoPrice : b.price;
        return pb - pa;
      });
      break;
  }

  renderProducts(products);
}

function initSearch() {
  var searchInput = document.getElementById('product-search');
  var searchClear = document.getElementById('search-clear');
  if (!searchInput) return;

  // ➕ Persistir busca localStorage
  const savedSearch = localStorage.getItem('searchQuery') || '';
  searchInput.value = savedSearch;
  window.currentSearch = savedSearch;

  searchInput.addEventListener('input', function() {
    window.currentSearch = this.value;
    localStorage.setItem('searchQuery', this.value);
    if (searchClear) searchClear.classList.toggle('visible', this.value.length > 0);
    filterProducts();
  });

  if (searchClear) {
    searchClear.addEventListener('click', function() {
      searchInput.value = '';
      window.currentSearch = '';
      searchClear.classList.remove('visible');
      filterProducts();
      searchInput.focus();
    });
  }
}

function initFilters() {
  var filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  var filterBtns = filterBar.querySelectorAll('.filter-btn');
  
  // ➕ Restaurar filtro salvo
  const savedFilter = localStorage.getItem('currentFilter') || 'all';
  window.currentFilter = savedFilter;
  const activeBtn = filterBar.querySelector(`[data-filter="${savedFilter}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      window.currentFilter = this.dataset.filter;
      localStorage.setItem('currentFilter', this.dataset.filter);
      filterProducts();
    });
  });
  
  filterProducts(); // Render inicial com filtro salvo
}

function bindPromoButton() {
  var btn = document.getElementById('view-promos');
  if (!btn) return;
  btn.addEventListener('click', function() {
    window.currentFilter = 'promo';
    var promoBtn = document.querySelector('[data-filter="promo"]');
    if (promoBtn) {
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      promoBtn.classList.add('active');
    }
    filterProducts();
    var section = document.getElementById('products');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ========== IMAGENS ==========
function forceProductImages() {
  document.querySelectorAll('.product-image img').forEach(function(img) {
    img.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:85%;max-height:85%;width:auto;height:auto;object-fit:contain;display:block;z-index:2;transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);';
    img.onerror = function() { this.style.opacity = '0.3'; this.style.filter = 'grayscale(100%)'; };
    if (img.complete) img.style.transform = 'translate(-50%,-50%)';
  });

  document.querySelectorAll('.product-image').forEach(function(container) {
    container.style.cssText = 'position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:16px;';
  });
}

function observeProductImages() {
  var observer = new MutationObserver(function() {
    setTimeout(forceProductImages, 100);
  });
  var productsList = document.querySelector('.products-list');
  if (productsList) observer.observe(productsList, { childList: true, subtree: true });
}

// ========== CONTADORES ==========
function animateCounters() {
  document.querySelectorAll('.counter').forEach(function(counter) {
    var target = parseInt(counter.dataset.target);
    var duration = 2000;
    var increment = target / (duration / 16);
    var current = 0;

    function update() {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString('pt-BR');
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString('pt-BR') + '+';
      }
    }

    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          update();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    obs.observe(counter);
  });
}

// ========== TOAST NOTIFICATIONS ==========
window.showToast = function(message, type, duration) {
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  var icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.innerHTML = '<div class="toast-content"><span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-message">' + message + '</span></div><div class="toast-timer" style="animation-duration:' + (duration || 4000) + 'ms;"></div>';
  container.appendChild(toast);

  setTimeout(function() {
    toast.classList.add('removing');
    setTimeout(function() {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, 300);
  }, duration || 4000);
};

// ========== INICIALIZAR ==========
function initUI() {
  console.log('🚀 Inicializando UI...');
  try {
    initTheme();
    renderProducts();
    renderCart();
    bindCartControls();
    bindPromoButton();
    initMarquee();
    initSearch();
    initFilters();
    detectMobile();
    forceProductImages();
    observeProductImages();
    animateCounters();

    window.addEventListener('resize', function() { setTimeout(initMarquee, 200); });
    window.addEventListener('resize', function() { setTimeout(detectMobile, 200); });
    window.addEventListener('load', forceProductImages);

    console.log('✅ UI inicializada!');
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

function bindCartControls() {
  var openCartBtn = document.getElementById('open-cart');
  var closeCartBtn = document.getElementById('close-cart');
  var cartOverlay = document.getElementById('cart-overlay');
  var cartSidebar = document.getElementById('cart-sidebar');
  var checkoutLink = document.querySelector('.checkout-button');
  var clearBtn = document.querySelector('.clear-cart');

  // ➕ ESC fecha carrinho (melhor UX)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar?.classList.contains('active')) {
      cartSidebar.classList.remove('active');
      cartOverlay?.classList.remove('active');
      document.querySelector('#product-search')?.focus();
    }
  });

  if (openCartBtn) {
    openCartBtn.onclick = function() {
      if (cartSidebar) cartSidebar.classList.add('active');
      if (cartOverlay) cartOverlay.classList.add('active');
    };
  }

  if (closeCartBtn) {
    closeCartBtn.onclick = function() {
      if (cartSidebar) cartSidebar.classList.remove('active');
      if (cartOverlay) cartOverlay.classList.remove('active');
    };
  }

  if (cartOverlay) {
    cartOverlay.onclick = function() {
      if (cartSidebar) cartSidebar.classList.remove('active');
      if (this) this.classList.remove('active');
    };
  }

  if (checkoutLink) {
    checkoutLink.addEventListener('click', function(e) {
      var cart = window.getCart ? window.getCart() : [];
      if (cart.length === 0) {
        e.preventDefault();
        alert('Seu carrinho está vazio!');
      } else {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (confirm('Limpar carrinho?')) {
        if (window.clearCart) window.clearCart();
        renderCart();
        alert('Carrinho limpo!');
      }
    });
  }
}

// ========== AUTO-START ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}

// ========== EXPORT ==========
window.renderProducts = renderProducts;
window.renderCart = renderCart;
window.initUI = initUI;
window.filterProducts = filterProducts;
window.updateCartUI = function() {
  if (window.renderCart) window.renderCart();

  const count = window.getCartCount ? window.getCartCount() : 0;
  const el = document.querySelector('.cart-count');
  if (el) el.textContent = count;

  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartSidebar) cartSidebar.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
};

window.setupProductPage = function(productId) {
  // ➕ Auto-detect se não passado via param
  if (!productId) {
    const script = document.querySelector('script[data-product-id]');
    productId = script ? script.dataset.productId : null;
  }
  
  if (!window.getProductById || !productId) return;
  const product = window.getProductById(Number(productId));
  if (!product) return;

  // ➕ Setup variações custom se existirem
  const script = document.querySelector(`script[data-product-id="${productId}"]`);
  if (script && script.dataset.variations) {
    product.variations = JSON.parse(script.dataset.variations);
    setupVariationControls(productId);
  }

  const priceEl = document.getElementById('product-price');
  const priceOld = document.getElementById('price-old');
  const priceNew = document.getElementById('price-new');
  const discountBadge = document.getElementById('discount-badge');

  if (priceEl) {
    priceEl.textContent = toBRL(product.promoEnabled && product.promoPrice && product.promoPrice < product.price ? product.promoPrice : product.price);
  }

  if (priceOld && priceNew) {
    if (product.promoEnabled && product.promoPrice && product.promoPrice < product.price) {
      priceOld.textContent = toBRL(product.price);
      priceNew.textContent = toBRL(product.promoPrice);
      if (discountBadge) discountBadge.textContent = '-' + Math.round((1 - product.promoPrice / product.price) * 100) + '% OFF';
    } else {
      priceOld.style.display = 'none';
      if (priceNew) priceNew.textContent = toBRL(product.price);
      if (discountBadge) discountBadge.style.display = 'none';
    }
  }

  document.querySelectorAll('.btn-primary-add').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.addToCart) window.addToCart(product, 1);
      if (window.updateCartUI) window.updateCartUI();
      if (window.showToast) window.showToast(product.name + ' adicionado!', 'success');
    });
  });
};

// showToast já exposto acima

console.log('✅ UI exportado');
