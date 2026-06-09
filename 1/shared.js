/* PlayBeat Digital — Shared JavaScript
   Include on every storefront page via:
   <script src="shared.js"></script>
   ============================================ */

(function () {
  'use strict';

  /* ── Active nav highlight ─── */
  function setActiveNav() {
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === page) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  /* ── Search bar focus glow ─── */
  function initSearch() {
    var bar = document.querySelector('.search-bar');
    var input = document.querySelector('.search-input');
    if (!bar || !input) return;
    input.addEventListener('focus', function () {
      bar.style.borderColor = '#f5a623';
      bar.style.boxShadow = '0 0 0 1px rgba(245,166,35,.18),0 0 18px rgba(245,166,35,0.28)';
    });
    input.addEventListener('blur', function () {
      bar.style.borderColor = '';
      bar.style.boxShadow = '';
    });
    var btn = document.querySelector('.search-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var q = input.value.trim();
        if (q) alert('Searching for: ' + q);
      });
    }
  }

  /* ── Floating WhatsApp button ─── */
  function initWhatsApp() {
    if (document.querySelector('.floating-whatsapp')) return;
    var btn = document.createElement('a');
    btn.href = 'https://wa.me/1234567890';
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.className = 'floating-whatsapp';
    btn.setAttribute('aria-label', 'Chat on WhatsApp');
    btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';
    btn.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#25D366;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:9999;text-decoration:none;box-shadow:0 4px 18px rgba(37,211,102,.4);transition:transform .2s,box-shadow .2s;';
    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.08)';
      btn.style.boxShadow = '0 6px 24px rgba(37,211,102,.55)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
      btn.style.boxShadow = '0 4px 18px rgba(37,211,102,.4)';
    });
    document.body.appendChild(btn);
  }

  /* ── Footer year ─── */
  function setYear() {
    var el = document.getElementById('yr');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Category bar tab clicks ─── */
  function initCatTabs() {
    document.querySelectorAll('.cat-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.cat-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });
  }


  /* ── Cart state ─── */
  var cart = [];
  var wishlist = [];

  /* ── Wishlist toggle ─── */
  function initWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var card = btn.closest('.product-card');
        var name = card ? (card.querySelector('h3') || card.querySelector('h2')) : null;
        var productName = name ? name.textContent.trim() : 'Item';
        if (btn.textContent === '♡') {
          btn.textContent = '♥';
          btn.style.color = '#f5a623';
          wishlist.push(productName);
          showToast('Added to wishlist: ' + productName);
        } else {
          btn.textContent = '♡';
          btn.style.color = '';
          wishlist = wishlist.filter(function(i){ return i !== productName; });
          showToast('Removed from wishlist');
        }
      });
    });
    // Header wishlist button
    var btnWish = document.querySelector('.btn-wish');
    if (btnWish) {
      btnWish.addEventListener('click', function () {
        if (wishlist.length === 0) {
          showToast('Your wishlist is empty');
        } else {
          showToast('Wishlist: ' + wishlist.join(', '));
        }
      });
    }
  }

  /* ── Add to cart ─── */
  function initCartButtons() {
    document.querySelectorAll('.add-cart-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.product-card');
        var name = card ? (card.querySelector('h3') || card.querySelector('h2')) : null;
        var price = card ? card.querySelector('.price') : null;
        var productName = name ? name.textContent.trim() : 'Item';
        var productPrice = price ? price.textContent.trim() : '';
        cart.push({ name: productName, price: productPrice });
        showToast('Added to cart: ' + productName);
        btn.textContent = '✔ Added';
        btn.style.background = 'rgba(34,214,138,0.18)';
        btn.style.color = '#22d68a';
        setTimeout(function () {
          btn.textContent = 'Add to Cart';
          btn.style.background = '';
          btn.style.color = '';
        }, 1800);
      });
    });
  }

  /* ── Buy now ─── */
  function initBuyNowButtons() {
    document.querySelectorAll('.buy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.product-card');
        var name = card ? (card.querySelector('h3') || card.querySelector('h2')) : null;
        var productName = name ? name.textContent.trim() : 'this item';
        showToast('Redirecting to checkout for: ' + productName);
        setTimeout(function () {
          alert('Checkout for: ' + productName + '\n\nPlease contact us via WhatsApp or Telegram to complete your order.');
        }, 400);
      });
    });
  }

  /* ── Hero search ─── */
  function initHeroSearch() {
    var heroBtn = document.querySelector('.hero-search button');
    var heroInput = document.querySelector('.hero-search input');
    if (heroBtn && heroInput) {
      heroBtn.addEventListener('click', function () {
        var q = heroInput.value.trim();
        if (q) {
          showToast('Searching for: ' + q);
        }
      });
      heroInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') heroBtn.click();
      });
    }
  }

  /* ── Sign In modal ─── */
  function initSignIn() {
    var btn = document.querySelector('.btn-login');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(2,10,22,.85);backdrop-filter:blur(6px);z-index:9998;display:flex;align-items:center;justify-content:center;';
      overlay.innerHTML = '<div style="background:linear-gradient(180deg,#08132d,#071224);border:1px solid rgba(245,166,35,.28);border-radius:16px;padding:32px 28px;width:360px;max-width:92%;color:#e2ecff;position:relative;">' +
        '<button id="pb-close-modal" style="position:absolute;top:12px;right:14px;background:none;border:none;color:#3d5a88;font-size:20px;cursor:pointer;">✕</button>' +
        '<div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#3d5a88;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">PlayBeat Digital</div>' +
        '<h2 style="font-family:'Orbitron',sans-serif;font-size:20px;font-weight:700;color:#f5a623;margin:0 0 20px;">Sign In</h2>' +
        '<input id="pb-email" type="email" placeholder="Email address" style="width:100%;background:rgba(8,20,44,.85);border:1px solid rgba(245,166,35,.2);border-radius:6px;color:#e2ecff;font-family:'DM Sans',sans-serif;font-size:13px;padding:10px 12px;margin-bottom:10px;outline:none;box-sizing:border-box;" />' +
        '<input id="pb-pass" type="password" placeholder="Password" style="width:100%;background:rgba(8,20,44,.85);border:1px solid rgba(245,166,35,.2);border-radius:6px;color:#e2ecff;font-family:'DM Sans',sans-serif;font-size:13px;padding:10px 12px;margin-bottom:16px;outline:none;box-sizing:border-box;" />' +
        '<button id="pb-signin-btn" style="width:100%;background:linear-gradient(135deg,#8a5400,#c07800,#f5a623);border:none;border-radius:6px;color:#020a16;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;padding:11px;cursor:pointer;">Sign In</button>' +
        '<p style="text-align:center;font-size:11px;color:#3d5a88;margin-top:14px;">Don't have an account? <a href="#" style="color:#f5a623;text-decoration:none;">Register</a></p>' +
        '</div>';
      document.body.appendChild(overlay);
      document.getElementById('pb-close-modal').addEventListener('click', function () { document.body.removeChild(overlay); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) document.body.removeChild(overlay); });
      document.getElementById('pb-signin-btn').addEventListener('click', function () {
        showToast('Sign-in coming soon! Contact us via WhatsApp.');
        setTimeout(function () { if (document.body.contains(overlay)) document.body.removeChild(overlay); }, 1200);
      });
    });
  }

  /* ── Toast notification ─── */
  function showToast(msg) {
    var existing = document.getElementById('pb-toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.id = 'pb-toast';
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:88px;right:18px;background:linear-gradient(135deg,#8a5400,#f5a623);color:#020a16;padding:10px 18px;border-radius:8px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:1px;font-weight:700;z-index:10000;opacity:0;transform:translateY(10px);transition:all .25s;max-width:280px;word-break:break-word;';
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, 2500);
  }

  /* ── Newsletter subscribe ─── */
  function initNewsletter() {
    document.querySelectorAll('.site-footer button').forEach(function (btn) {
      if (btn.textContent.trim().toLowerCase() === 'subscribe') {
        btn.addEventListener('click', function () {
          var input = btn.previousElementSibling;
          if (input && input.type === 'email' && input.value.trim()) {
            showToast('Subscribed! Thank you.');
            input.value = '';
          } else {
            showToast('Please enter a valid email.');
          }
        });
      }
    });
  }

  /* ── Join PlayBeat button ─── */
  function initJoinButton() {
    var btn = document.querySelector('.btn-prime');
    if (!btn) return;
    btn.addEventListener('click', function () {
      showToast('Join PlayBeat — Coming Soon! Stay tuned.');
    });
  }

  /* ── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initSearch();
    initWhatsApp();
    setYear();
    initCatTabs();
    initWishlistButtons();
    initCartButtons();
    initBuyNowButtons();
    initHeroSearch();
    initSignIn();
    initNewsletter();
    initJoinButton();
  });
})();
