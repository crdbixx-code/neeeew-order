/* ═══════════════════════════════════════════════════════════
   PlayBeat Digital — Central Data Layer (playbeat-db.js)
   localStorage-based shared database for all pages.
   Include on ALL pages: <script src="playbeat-db.js"></script>
   ═══════════════════════════════════════════════════════════ */

window.PlayBeatDB = (function () {
  'use strict';

  /* ─── Storage keys ─── */
  const KEYS = {
    products: 'pb_products_v2',
    orders: 'pb_orders_v2',
    coupons: 'pb_coupons_v2',
    cms: 'pb_cms_v2',
    settings: 'pb_settings_v2',
    cart: 'pb_cart_v2',
    wishlist: 'pb_wishlist_v2',
    sections: 'pb_sections_v2',
    catalog: 'pb_catalog_v2', // legacy compat
  };

  /* ─── Helpers ─── */
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
  }
  function uid() {
    return 'pb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function emit(event, detail) {
    window.dispatchEvent(new CustomEvent('playbeat:' + event, { detail }));
  }

  /* ═══════════════════════════════════════════════════
     PRODUCTS
  ═══════════════════════════════════════════════════ */
  function getProducts() {
    return read(KEYS.products) || [];
  }

  function saveProducts(arr) {
    write(KEYS.products, arr);
    emit('products-changed', arr);
  }

  function addProduct(p) {
    const arr = getProducts();
    const product = Object.assign({
      id: uid(),
      name: '',
      category: '',
      type: 'Digital Key',
      section: 'home',
      price: 0,
      salePrice: null,
      buyingPrice: 0,
      originalPrice: null,
      discount: 0,
      offer: '',
      amount: '',
      description: '',
      image: '',
      status: 'Active',
      createdAt: new Date().toISOString(),
    }, p);
    arr.push(product);
    saveProducts(arr);
    return product;
  }

  function updateProduct(id, updates) {
    const arr = getProducts();
    const idx = arr.findIndex(p => p.id === id);
    if (idx === -1) return null;
    arr[idx] = Object.assign(arr[idx], updates, { updatedAt: new Date().toISOString() });
    saveProducts(arr);
    return arr[idx];
  }

  function deleteProduct(id) {
    const arr = getProducts().filter(p => p.id !== id);
    saveProducts(arr);
  }

  function getProductsBySection(section) {
    return getProducts().filter(p => p.section === section && p.status === 'Active');
  }

  function getProductsByCategory(cat) {
    if (!cat) return getProducts().filter(p => p.status === 'Active');
    return getProducts().filter(p =>
      p.status === 'Active' &&
      (p.category || '').toLowerCase().includes(cat.toLowerCase())
    );
  }

  function searchProducts(q) {
    const lower = q.toLowerCase();
    return getProducts().filter(p =>
      p.status !== 'Draft' &&
      (
        (p.name || '').toLowerCase().includes(lower) ||
        (p.category || '').toLowerCase().includes(lower) ||
        (p.type || '').toLowerCase().includes(lower) ||
        (p.description || '').toLowerCase().includes(lower)
      )
    );
  }

  /* ═══════════════════════════════════════════════════
     ORDERS
  ═══════════════════════════════════════════════════ */
  function getOrders() {
    return read(KEYS.orders) || [];
  }

  function saveOrders(arr) {
    write(KEYS.orders, arr);
    emit('orders-changed', arr);
  }

  function addOrder(o) {
    const arr = getOrders();
    const order = Object.assign({
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      customer: 'Guest',
      email: '',
      phone: '',
      items: [],
      total: 0,
      status: 'Pending',
      paymentMethod: 'WhatsApp',
      createdAt: new Date().toISOString(),
    }, o);
    arr.unshift(order);
    saveOrders(arr);
    emit('new-order', order);
    return order;
  }

  function updateOrderStatus(id, status) {
    const arr = getOrders();
    const idx = arr.findIndex(o => o.id === id);
    if (idx === -1) return null;
    arr[idx].status = status;
    arr[idx].updatedAt = new Date().toISOString();
    saveOrders(arr);
    return arr[idx];
  }

  /* ═══════════════════════════════════════════════════
     CART
  ═══════════════════════════════════════════════════ */
  function getCart() {
    return read(KEYS.cart) || [];
  }

  function saveCart(arr) {
    write(KEYS.cart, arr);
    emit('cart-changed', arr);
  }

  function addToCart(product, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find(c => c.productId === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image || '',
        category: product.category || '',
        qty,
      });
    }
    saveCart(cart);
    emit('cart-add', product);
  }

  function removeFromCart(productId) {
    saveCart(getCart().filter(c => c.productId !== productId));
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartTotal() {
    return getCart().reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  function getCartCount() {
    return getCart().reduce((sum, c) => sum + c.qty, 0);
  }

  /* ═══════════════════════════════════════════════════
     WISHLIST
  ═══════════════════════════════════════════════════ */
  function getWishlist() {
    return read(KEYS.wishlist) || [];
  }

  function toggleWishlist(product) {
    const list = getWishlist();
    const idx = list.findIndex(w => w.productId === product.id);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push({ productId: product.id, name: product.name, price: product.salePrice || product.price, image: product.image || '', category: product.category || '' });
    }
    write(KEYS.wishlist, list);
    emit('wishlist-changed', list);
    return idx === -1; // true = added
  }

  function isInWishlist(productId) {
    return getWishlist().some(w => w.productId === productId);
  }

  /* ═══════════════════════════════════════════════════
     COUPONS
  ═══════════════════════════════════════════════════ */
  function getCoupons() {
    return read(KEYS.coupons) || [];
  }

  function saveCoupons(arr) {
    write(KEYS.coupons, arr);
  }

  function addCoupon(c) {
    const arr = getCoupons();
    arr.push(Object.assign({ id: uid(), createdAt: new Date().toISOString() }, c));
    saveCoupons(arr);
  }

  function validateCoupon(code, cartTotal) {
    const now = new Date();
    const coupon = getCoupons().find(c => c.code === code.toUpperCase() && c.status === 'Active');
    if (!coupon) return { valid: false, msg: 'Invalid coupon code.' };
    if (coupon.expiry && new Date(coupon.expiry) < now) return { valid: false, msg: 'Coupon expired.' };
    const discount = parseFloat(coupon.discount) || 0;
    const isPercent = String(coupon.discount).includes('%');
    const saving = isPercent ? (cartTotal * discount / 100) : discount;
    return { valid: true, saving, coupon };
  }

  /* ═══════════════════════════════════════════════════
     CMS / SETTINGS
  ═══════════════════════════════════════════════════ */
  function getCMS() {
    return read(KEYS.cms) || { hero: 'PlayBeat Digital Marketplace', trending: '🔥 Trending Deals', bestvalue: '💎 Best Value' };
  }

  function saveCMS(data) {
    write(KEYS.cms, data);
    emit('cms-changed', data);
  }

  function getSettings() {
    return read(KEYS.settings) || {
      email: 'support@playbeat.digital',
      whatsapp: '+92 339 0005715',
      telegram: '@pbeatdigi',
      username: 'admin',
      storeName: 'PlayBeat Digital',
      currency: 'PKR',
    };
  }

  function saveSettings(data) {
    write(KEYS.settings, data);
    emit('settings-changed', data);
  }

  /* ═══════════════════════════════════════════════════
     STATS
  ═══════════════════════════════════════════════════ */
  function getStats() {
    const products = getProducts();
    const orders = getOrders();
    const active = products.filter(p => p.status === 'Active');
    const totalValue = active.reduce((s, p) => s + (parseFloat(p.price) || 0), 0);
    const totalEarnings = orders.filter(o => o.status === 'Delivered' || o.status === 'Paid')
      .reduce((s, o) => s + (parseFloat(o.total) || 0), 0);

    // By section count
    const sectionMap = {};
    products.forEach(p => {
      sectionMap[p.section] = (sectionMap[p.section] || 0) + 1;
    });

    // By category
    const catMap = {};
    products.forEach(p => {
      const c = p.category || 'Other';
      catMap[c] = (catMap[c] || 0) + 1;
    });

    return {
      totalProducts: products.length,
      activeProducts: active.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      totalInventoryValue: totalValue.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      bySection: sectionMap,
      byCategory: catMap,
      recentOrders: orders.slice(0, 5),
    };
  }

  /* ═══════════════════════════════════════════════════
     CHECKOUT helper — places order from cart
  ═══════════════════════════════════════════════════ */
  function checkout(customerInfo, couponCode) {
    const cart = getCart();
    if (!cart.length) return null;
    const settings = getSettings();
    let total = getCartTotal();
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      const v = validateCoupon(couponCode, total);
      if (v.valid) { discount = v.saving; coupon = v.coupon; }
    }

    const order = addOrder({
      customer: customerInfo.name || 'Guest',
      email: customerInfo.email || '',
      phone: customerInfo.phone || '',
      items: cart.slice(),
      subtotal: total,
      discount,
      coupon: coupon ? coupon.code : null,
      total: Math.max(0, total - discount),
      status: 'Pending',
      currency: settings.currency || 'PKR',
    });

    clearCart();
    return order;
  }

  /* ═══════════════════════════════════════════════════
     PRODUCT CARD RENDERER  (shared UI utility)
  ═══════════════════════════════════════════════════ */
  function renderProductCard(product, opts) {
    opts = opts || {};
    const price = parseFloat(product.salePrice || product.price) || 0;
    const origPx = product.salePrice ? parseFloat(product.price) : null;
    const discount = product.discount || (origPx ? Math.round((1 - price / origPx) * 100) : 0);
    const badge = product.offer || (discount >= 5 ? discount + '% OFF' : '');
    const gradients = [
      'linear-gradient(135deg,#1b2838,#2a475e)',
      'linear-gradient(135deg,#1a0000,#5e1717)',
      'linear-gradient(135deg,#0d1b2a,#1b4332)',
      'linear-gradient(135deg,#12001f,#3d0066)',
      'linear-gradient(135deg,#1a1a2e,#16213e)',
      'linear-gradient(135deg,#0d1d36,#0a3060)',
    ];
    const grad = gradients[Math.abs((product.name || '').charCodeAt(0) || 0) % gradients.length];
    const emoji = product.image && product.image.startsWith('http') ? '' : (product.image || '📦');
    const imgHtml = product.image && product.image.startsWith('http')
      ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
      : `<span style="font-size:2.5rem;">${emoji}</span>`;

    const wishlisted = isInWishlist(product.id);

    const settings = getSettings();
    const currency = settings.currency || 'PKR';

    return `
    <div class="pb-product-card" data-id="${product.id}" style="background:var(--bg2,#111318);border:1px solid rgba(245,166,35,.14);border-radius:12px;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:pointer;position:relative;"
      onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 32px rgba(245,166,35,.18)'"
      onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div style="height:140px;background:${grad};display:flex;align-items:center;justify-content:center;position:relative;">
        ${imgHtml}
        ${badge ? `<span style="position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#8a5400,#f5a623);color:#020a16;font-size:10px;font-weight:700;padding:3px 8px;border-radius:3px;letter-spacing:.8px;">${badge}</span>` : ''}
        ${product.status === 'Out of Stock' ? `<span style="position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;color:#ff5a5a;font-weight:700;font-size:12px;letter-spacing:1px;">OUT OF STOCK</span>` : ''}
        <button onclick="event.stopPropagation();PlayBeatDB.toggleWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')});this.textContent=PlayBeatDB.isInWishlist('${product.id}')?'❤️':'♡';this.style.color=PlayBeatDB.isInWishlist('${product.id}')?'#f5a623':'rgba(255,255,255,.6)';"
          style="position:absolute;top:10px;right:10px;background:rgba(8,20,44,.7);border:none;cursor:pointer;font-size:16px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:${wishlisted ? '#f5a623' : 'rgba(255,255,255,.6)'};transition:color .2s;">
          ${wishlisted ? '❤️' : '♡'}
        </button>
      </div>
      <div style="padding:14px;">
        <div style="font-size:10px;color:#7a9ac8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${product.category || product.type || ''}</div>
        <div style="font-weight:700;color:#e2ecff;font-size:14px;margin-bottom:10px;line-height:1.4;min-height:36px;">${product.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <span style="font-size:17px;font-weight:800;color:#f5a623;">${currency} ${price.toLocaleString()}</span>
          ${origPx ? `<span style="font-size:12px;color:#4a6a90;text-decoration:line-through;">${currency} ${origPx.toLocaleString()}</span>` : ''}
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="event.stopPropagation();PlayBeatDB.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')});PlayBeatUI.showAddedToCart('${product.name.replace(/'/g, "\\'")}');"
            style="flex:1;background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.3);color:#f5a623;padding:8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.8px;transition:all .2s;"
            onmouseenter="this.style.background='rgba(245,166,35,.22)'" onmouseleave="this.style.background='rgba(245,166,35,.12)'"
            ${product.status === 'Out of Stock' ? 'disabled' : ''}>
            🛒 CART
          </button>
          <button onclick="event.stopPropagation();PlayBeatUI.buyNow(${JSON.stringify(product).replace(/"/g, '&quot;')});"
            style="flex:1;background:linear-gradient(135deg,#8a5400,#f5a623);border:none;color:#020a16;padding:8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.8px;transition:filter .2s;"
            onmouseenter="this.style.filter='brightness(1.15)'" onmouseleave="this.style.filter=''"
            ${product.status === 'Out of Stock' ? 'disabled style="opacity:.5;cursor:not-allowed;"' : ''}>
            ⚡ BUY
          </button>
        </div>
      </div>
    </div>`;
  }

  /* ═══════════════════════════════════════════════════
     EMPTY STATE helper
  ═══════════════════════════════════════════════════ */
  function emptyState(label) {
    return `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#3d5a88;">
      <div style="font-size:3rem;margin-bottom:16px;">📦</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:8px;">No ${label || 'products'} yet</div>
      <div style="font-size:12px;">Add products in the Admin panel to display them here.</div>
    </div>`;
  }

  /* ─── Public API ─── */
  return {
    // Products
    getProducts, addProduct, updateProduct, deleteProduct,
    getProductsBySection, getProductsByCategory, searchProducts,
    saveProducts,
    // Orders
    getOrders, addOrder, updateOrderStatus,
    // Cart
    getCart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount,
    // Wishlist
    getWishlist, toggleWishlist, isInWishlist,
    // Coupons
    getCoupons, addCoupon, saveCoupons, validateCoupon,
    // CMS / Settings
    getCMS, saveCMS, getSettings, saveSettings,
    // Stats
    getStats,
    // Checkout
    checkout,
    // Rendering
    renderProductCard, emptyState,
    // Utils
    uid, emit,
    KEYS,
  };
})();

/* ═══════════════════════════════════════════════════════════
   PlayBeatUI — shared UI helpers (cart drawer, toasts, etc.)
   ═══════════════════════════════════════════════════════════ */
window.PlayBeatUI = (function () {
  'use strict';

  function showToast(msg, duration) {
    let el = document.getElementById('pb-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pb-toast';
      el.style.cssText = 'position:fixed;bottom:90px;right:20px;background:#f5a623;color:#020a16;padding:12px 20px;border-radius:8px;font-weight:700;font-size:13px;opacity:0;transform:translateY(20px);transition:all .3s;z-index:99999;pointer-events:none;max-width:280px;box-shadow:0 4px 20px rgba(245,166,35,.35);';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; }, duration || 2800);
  }

  function updateCartBadge() {
    const count = PlayBeatDB.getCartCount();
    document.querySelectorAll('.pb-cart-badge,.wish-count').forEach(el => { el.textContent = count; el.style.display = count ? '' : 'none'; });
  }

  function showAddedToCart(name) {
    showToast('🛒 Added to cart: ' + name);
    updateCartBadge();
  }

  function buyNow(product) {
    const s = PlayBeatDB.getSettings();
    const wa = (s.whatsapp || '+921234567890').replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi! I'd like to buy:\n*${product.name}*\nPrice: ${s.currency || 'PKR'} ${(product.salePrice || product.price).toLocaleString()}\n\nPlease confirm availability.`);
    window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
  }

  function renderCartDrawer() {
    let drawer = document.getElementById('pb-cart-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'pb-cart-drawer';
      document.body.appendChild(drawer);
    }

    const cart = PlayBeatDB.getCart();
    const total = PlayBeatDB.getCartTotal();
    const s = PlayBeatDB.getSettings();
    const currency = s.currency || 'PKR';
    const wa = (s.whatsapp || '+921234567890').replace(/\D/g, '');

    const itemsHtml = cart.length ? cart.map(item => `
      <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(245,166,35,.08);">
        <div style="width:48px;height:48px;background:#0d1d36;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">
          ${item.image && item.image.startsWith('http') ? `<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : (item.image || '📦')}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:#e2ecff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
          <div style="font-size:12px;color:#7a9ac8;">${currency} ${item.price.toLocaleString()} × ${item.qty}</div>
        </div>
        <button onclick="PlayBeatDB.removeFromCart('${item.productId}');PlayBeatUI.renderCartDrawer();" style="background:rgba(255,90,90,.12);border:none;color:#ff5a5a;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px;">✕</button>
      </div>`).join('') : `<div style="text-align:center;padding:40px 20px;color:#3d5a88;">
        <div style="font-size:2.5rem;margin-bottom:12px;">🛒</div>
        <div style="font-size:13px;">Your cart is empty</div>
      </div>`;

    drawer.innerHTML = `
    <div id="pb-cart-overlay" onclick="document.getElementById('pb-cart-drawer').style.transform='translateX(100%)'" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9990;"></div>
    <div style="position:fixed;top:0;right:0;bottom:0;width:380px;max-width:95vw;background:#071224;border-left:1px solid rgba(245,166,35,.2);z-index:9991;display:flex;flex-direction:column;transition:transform .3s;overflow:hidden;">
      <div style="padding:20px;border-bottom:1px solid rgba(245,166,35,.15);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:16px;font-weight:700;color:#f5a623;">🛒 Cart <span style="font-size:12px;color:#7a9ac8;">(${PlayBeatDB.getCartCount()} items)</span></div>
        <button onclick="document.getElementById('pb-cart-drawer').style.transform='translateX(100%)'" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#7a9ac8;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;">✕</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:0 20px;">${itemsHtml}</div>
      ${cart.length ? `
      <div style="padding:20px;border-top:1px solid rgba(245,166,35,.15);">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <span style="color:#7a9ac8;">Total</span>
          <span style="font-size:18px;font-weight:800;color:#f5a623;">${currency} ${total.toLocaleString()}</span>
        </div>
        <a href="https://wa.me/${wa}?text=${encodeURIComponent('Hi! I\'d like to order:\n' + cart.map(c => `- ${c.name} × ${c.qty} = ${currency} ${(c.price * c.qty).toLocaleString()}`).join('\n') + `\n\nTotal: ${currency} ${total.toLocaleString()}`)}" target="_blank" rel="noopener"
          style="display:block;text-align:center;background:linear-gradient(135deg,#8a5400,#f5a623);color:#020a16;padding:14px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:.8px;margin-bottom:10px;">
          ⚡ Checkout via WhatsApp
        </a>
        <button onclick="PlayBeatDB.clearCart();PlayBeatUI.renderCartDrawer();" style="width:100%;background:rgba(255,90,90,.1);border:1px solid rgba(255,90,90,.2);color:#ff5a5a;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;">🗑 Clear Cart</button>
      </div>` : ''}
    </div>`;
    drawer.style.transform = 'translateX(0)';
  }

  function openCart() {
    renderCartDrawer();
  }

  function initCartButton() {
    // Wire the wishlist button to open cart
    document.querySelectorAll('.btn-wish, [data-action="cart"]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openCart();
      });
    });

    // Add cart badge to wishlist/cart buttons
    const btn = document.querySelector('.btn-wish');
    if (btn && !btn.querySelector('.wish-count')) {
      const badge = document.createElement('span');
      badge.className = 'wish-count pb-cart-badge';
      badge.style.cssText = 'position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#8a5400,#f5a623);color:#020a16;font-size:9px;font-family:"Share Tech Mono",monospace;font-weight:700;min-width:16px;height:16px;border-radius:2px;display:none;align-items:center;justify-content:center;padding:0 3px;';
      btn.style.position = 'relative';
      btn.appendChild(badge);
    }
    updateCartBadge();
  }

  function injectProductsIntoGrid(gridEl, products, emptyMsg) {
    if (!gridEl) return;
    if (!products || !products.length) {
      gridEl.innerHTML = PlayBeatDB.emptyState(emptyMsg);
      return;
    }
    gridEl.innerHTML = products.map(p => PlayBeatDB.renderProductCard(p)).join('');
  }

  /* Listen for cart changes */
  window.addEventListener('playbeat:cart-changed', function () {
    updateCartBadge();
  });

  return { showToast, updateCartBadge, showAddedToCart, buyNow, openCart, renderCartDrawer, initCartButton, injectProductsIntoGrid };
})();