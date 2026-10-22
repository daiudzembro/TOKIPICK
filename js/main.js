// ============================================
// TOKIPICK — funciones compartidas (TOKIPICK3)
// Carrito, favoritos, placard, swipe con drag real,
// mini carrito lateral, modal de compra y validaciones.
// Usa localStorage como "base de datos" temporal
// mientras no hay backend conectado.
// ============================================

const STORAGE_KEYS = {
  cart: "tokipick_cart",
  favorites: "tokipick_favorites",
  closet: "tokipick_closet",
  purchases: "tokipick_purchases",
  swipes: "tokipick_swipes",
};

// Storage helpers 

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readStore(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  writeStore(STORAGE_KEYS.cart, cart);
  updateCartBadge();
}

function addToCart(productId, size) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId && i.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, size, qty: 1 });
  }
  saveCart(cart);
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(productId, size) {
  const cart = getCart().filter((i) => !(i.id === productId && i.size === size));
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getFavorites() {
  return readStore(STORAGE_KEYS.favorites, []);
}

function toggleFavorite(productId) {
  let favs = getFavorites();
  if (favs.includes(productId)) {
    favs = favs.filter((id) => id !== productId);
  } else {
    favs.push(productId);
  }
  writeStore(STORAGE_KEYS.favorites, favs);
  return favs.includes(productId);
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

// Prendas de ejemplo del closet
const DEFAULT_CLOSET = [
  { id: "c1", name: "Favorite top", category: "top", image: "assets/closet/favorite-top.jpg" },
  { id: "c2", name: "Worn-in jeans", category: "bottom", image: "assets/closet/worn-in-jeans.jpg" },
  { id: "c3", name: "Black dress", category: "dress", image: "assets/closet/black-dress.jpg" },
  { id: "c4", name: "White sneakers", category: "footwear", image: "assets/closet/white-sneakers.jpg" },
  { id: "c5", name: "Plaid shirt", category: "top", image: "assets/closet/plaid-shirt.jpg" },
  { id: "c6", name: "Cargo pants", category: "bottom", image: "assets/closet/cargo-pants.jpg" },
  { id: "c7", name: "Denim jacket", category: "outerwear", image: "assets/closet/denim-jacket.jpg" },
];

function getCloset() {
  return readStore(STORAGE_KEYS.closet, DEFAULT_CLOSET);
}

function closetImage(item) {
  if (item.image) return item.image;
  const base = DEFAULT_CLOSET.find((d) => d.id === item.id);
  return base ? base.image : null;
}

function saveCloset(items) {
  writeStore(STORAGE_KEYS.closet, items);
}

function addClosetItem(name, category) {
  const items = getCloset();
  items.push({ id: "c" + Date.now(), name, category });
  saveCloset(items);
  return items;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getSwipesToday() {
  const data = readStore(STORAGE_KEYS.swipes, null);
  return data && data.date === todayKey() ? data.count : 0;
}

function addSwipe() {
  writeStore(STORAGE_KEYS.swipes, { date: todayKey(), count: getSwipesToday() + 1 });
}

function getPurchases() {
  return readStore(STORAGE_KEYS.purchases, []);
}

function addPurchases(cartItems) {
  const purchases = getPurchases();
  cartItems.forEach((item) => purchases.push(item));
  writeStore(STORAGE_KEYS.purchases, purchases);
}

// Los Toast 

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

//  Sidebar cart badge 

function updateCartBadge() {
  document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
    const count = cartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

//  Pills genericos 

function setupPillGroup(selector, onChange) {
  const pills = document.querySelectorAll(selector);
  pills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      if (typeof onChange === "function") onChange(pill);
    });
  });
}

//  drawer de navegacion

function setupSidebar() {
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector("[data-sidebar-overlay]");
  if (!toggle || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  toggle.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);
}

//  drawer cart izquierdo

function renderCartDrawer() {
  const itemsBox = document.querySelector("[data-cart-drawer-items]");
  if (!itemsBox) return;

  const cart = getCart();
  if (!cart.length) {
    itemsBox.innerHTML = `<p style="color:var(--gray-text); padding:10px 0;">You haven't added anything yet.</p>`;
    return;
  }

  itemsBox.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.id);
      return `
      <div class="cart-drawer-item">
        ${productPhotoHtml(product)}
        <div>
          <strong>${product.name}</strong><br />
          <span style="font-size:0.82rem; color:var(--gray-text);">${product.brand} · Size ${item.size} · Qty ${item.qty}</span><br />
          <span class="rating-stars">${starsHtml(product.rating)}</span>
        </div>
      </div>`;
    })
    .join("");
}

function openCartDrawer() {
  document.querySelector("[data-cart-drawer]")?.classList.add("open");
  document.querySelector("[data-cart-drawer-overlay]")?.classList.add("open");
}

function closeCartDrawer() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-cart-drawer-overlay]")?.classList.remove("open");
}

function setupCartDrawer() {
  const drawer = document.querySelector("[data-cart-drawer]");
  if (!drawer) return;
  document.querySelector("[data-cart-drawer-close]")?.addEventListener("click", closeCartDrawer);
  document.querySelector("[data-cart-drawer-overlay]")?.addEventListener("click", closeCartDrawer);
  renderCartDrawer();
}

//  confirmacion de compra 

function ensurePurchaseModal() {
  let modal = document.querySelector("[data-purchase-modal]");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.setAttribute("data-purchase-modal", "");
  modal.innerHTML = `
    <div class="modal-box">
      <div class="check-circle">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h2>Purchase complete!</h2>
      <p class="order-id" data-purchase-order></p>
      <p data-purchase-summary style="color:var(--gray-text); font-size:0.9rem;"></p>
      <div class="modal-actions">
        <a href="home.html" class="btn-primary">Keep shopping</a>
        <a href="profile.html" class="btn-secondary">View my purchases</a>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
  return modal;
}

function showPurchaseModal(cartItems) {
  const modal = ensurePurchaseModal();
  const orderId = Math.floor(1000 + Math.random() * 9000);
  modal.querySelector("[data-purchase-order]").textContent = `Order #${orderId}`;
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  modal.querySelector("[data-purchase-summary]").textContent = `${itemCount} item${itemCount === 1 ? "" : "s"} on the way. You'll get an email with your shipment tracking.`;
  modal.classList.add("open");
}

// chat con Toki (sin IA)

function setupChat() {
  const form = document.querySelector("[data-chat-form]");
  const input = document.querySelector("[data-chat-input]");
  const messages = document.querySelector("[data-chat-messages]");
  if (!form || !input || !messages) return;

  const respuestasToki = [
    "Let me check what's in your closet and put something together.",
    "Great choice! Want me to show you options to complete the look?",
    "I can compare a couple of pieces if you're deciding between several.",
    "Tell me more about the occasion and I'll build a fitting outfit.",
    "Check the Compare section to see price and quality side by side.",
  ];

  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.className = "card chat-bubble " + (from === "user" ? "chat-user" : "chat-bot");
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
      const respuesta = respuestasToki[Math.floor(Math.random() * respuestasToki.length)];
      addMessage(respuesta, "bot");
    }, 500);
  });
}

//  Foto de producto con fallback

function productPhotoInner(product) {
  return `
    <img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.remove();" />
    <span class="ph-text">${product.name}</span>`;
}

function productPhotoHtml(product, sizeStyle) {
  const style = sizeStyle ? ` style="${sizeStyle}"` : "";
  return `<div class="img-placeholder"${style}>${productPhotoInner(product)}</div>`;
}

//  Render de tarjeta de producto 

function renderProductCard(product) {
  const fav = isFavorite(product.id);
  const sizeOptionsHtml = product.sizes
    .map((s, i) => `<span class="size-option ${i === 0 ? "selected" : ""}" data-inline-size="${s}">${s}</span>`)
    .join("");

  return `
    <div class="item-card" data-product-card="${product.id}">
      <a class="thumb-link" href="product.html?id=${product.id}">
        ${productPhotoHtml(product)}
      </a>
      <div class="top-row">
        <span class="brand">${product.brand}</span>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <a class="name" href="product.html?id=${product.id}">${product.name}</a>
      <div class="match"><span>Matches ${product.matchItems} items</span><span>${product.match}%</span></div>

      <div class="card-actions">
        <button type="button" class="icon-btn ${fav ? "is-active" : ""}" data-fav-btn="${product.id}" aria-label="Save to favorites">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 21s-7.2-4.5-9.7-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.7 6c-2.5 4.5-9.7 9-9.7 9Z"/></svg>
        </button>
        <button type="button" class="btn-add" data-toggle-size="${product.id}">Add to cart</button>
      </div>

      <div class="inline-size-row" data-size-row="${product.id}" style="display:none;">${sizeOptionsHtml}</div>
    </div>`;
}

function wireProductGridEvents(container) {
  container.querySelectorAll("[data-fav-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-fav-btn"));
      const active = toggleFavorite(id);
      btn.classList.toggle("is-active", active);
      showToast(active ? "Saved to favorites" : "Removed from favorites");
    });
  });

  //  size inline antes del carrito
  container.querySelectorAll("[data-toggle-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-toggle-size");
      const row = container.querySelector(`[data-size-row="${id}"]`);
      if (!row) return;
      const isOpen = row.style.display !== "none";
      row.style.display = isOpen ? "none" : "flex";
      btn.textContent = isOpen ? "Add to cart" : "Choose size ↑";
    });
  });

  container.querySelectorAll("[data-size-row]").forEach((row) => {
    row.querySelectorAll("[data-inline-size]").forEach((sizeBtn) => {
      sizeBtn.addEventListener("click", () => {
        row.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"));
        sizeBtn.classList.add("selected");

        const id = Number(row.getAttribute("data-size-row"));
        const size = sizeBtn.getAttribute("data-inline-size");
        const product = getProductById(id);
        addToCart(id, size);
        showToast(`${product.name} (size ${size}) added to cart`);

        row.style.display = "none";
        const toggleBtn = container.querySelector(`[data-toggle-size="${id}"]`);
        if (toggleBtn) toggleBtn.textContent = "Add to cart";
      });
    });
  });
}

function renderGrid(container, products) {
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <p>No items to show here.</p>
      </div>`;
    return;
  }
  container.innerHTML = products.map(renderProductCard).join("");
  wireProductGridEvents(container);
}

// INIT por pantalla

function initHome() {
  const grid = document.querySelector("[data-home-grid]");
  if (!grid) return;
  const sorted = [...PRODUCTS].sort((a, b) => b.match - a.match).slice(0, 8);
  renderGrid(grid, sorted);
}

function initSearch() {
  const grid = document.querySelector("[data-search-grid]");
  const input = document.querySelector("[data-search-input]");
  if (!grid || !input) return;

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  input.value = initialQuery;
  input.focus();

  function runSearch() {
    const term = input.value.trim().toLowerCase();
    const results = term
      ? PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term) ||
            CATEGORY_LABELS[p.category].toLowerCase().includes(term)
        )
      : PRODUCTS;
    renderGrid(grid, results);
  }

  input.addEventListener("input", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
  runSearch();
}

// SWIPE

function initSwipe() {
  const stage = document.querySelector("[data-swipe-stack]");
  const favList = document.querySelector("[data-swipe-favorites]");
  const counter = document.querySelector("[data-swipe-counter]");
  const tabs = document.querySelectorAll("[data-swipe-tab]");
  const swipesTodayEl = document.querySelector("[data-swipes-today]");
  const heartBadge = document.querySelector("[data-heart-badge]");
  const heartCount = document.querySelector("[data-heart-count]");
  if (!stage) return;

  if (swipesTodayEl) swipesTodayEl.textContent = getSwipesToday();

  let deck = [...PRODUCTS];
  let index = 0;
  let dragging = false;
  let startX = 0;
  let currentX = 0;
  let cardEl = null;

  function pulseHeart() {
    if (!heartBadge) return;
    if (heartCount) heartCount.textContent = getFavorites().length;
    heartBadge.classList.add("pulse");
    setTimeout(() => heartBadge.classList.remove("pulse"), 260);
  }

  function buildCard(product) {
    const el = document.createElement("div");
    el.className = "card swipe-card";
    el.innerHTML = `
      <span class="stamp like">LIKE</span>
      <span class="stamp nope">DISLIKE</span>
      ${productPhotoHtml(product, "aspect-ratio:3/4; height:auto; margin-bottom:12px;")}
      <div class="swipe-info">
        <h2>${product.brand}</h2>
        <p>${product.name} — ${formatPrice(product.price)}</p>
        <p class="swipe-hint">← Swipe to DISLIKE · Swipe to LIKE →</p>
      </div>`;
    return el;
  }

  function renderCard() {
    stage.innerHTML = "";
    if (index >= deck.length) {
      stage.innerHTML = `
        <div class="card empty-state" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6 9 17l-5-5"/></svg>
          <p>You've seen all of today's items. Come back tomorrow for more!</p>
        </div>`;
      if (counter) counter.textContent = "";
      return;
    }
    cardEl = buildCard(deck[index]);
    stage.appendChild(cardEl);
    attachDrag(cardEl);
    if (counter) counter.textContent = `· ${index + 1}/${deck.length}`;
  }

  function setCardTransform(el, dx) {
    const rotate = dx / 18;
    el.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
    const likeStamp = el.querySelector(".stamp.like");
    const nopeStamp = el.querySelector(".stamp.nope");
    const intensity = Math.min(Math.abs(dx) / 100, 1);
    if (dx > 0) {
      likeStamp.style.opacity = intensity;
      nopeStamp.style.opacity = 0;
    } else if (dx < 0) {
      nopeStamp.style.opacity = intensity;
      likeStamp.style.opacity = 0;
    } else {
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
    }
  }

  function finishDecision(liked) {
    const product = deck[index];
    addSwipe();
    if (swipesTodayEl) swipesTodayEl.textContent = getSwipesToday();
    if (product && liked) {
      const favs = getFavorites();
      if (!favs.includes(product.id)) {
        favs.push(product.id);
        writeStore(STORAGE_KEYS.favorites, favs);
      }
      pulseHeart();
    }
    index += 1;
    renderCard();
    renderFavorites();
  }

  function flingCard(direction) {
    if (!cardEl) return;
    const liked = direction === "right";
    cardEl.classList.add("animate");
    const flyX = liked ? window.innerWidth : -window.innerWidth;
    setCardTransform(cardEl, flyX);
    const stamp = cardEl.querySelector(liked ? ".stamp.like" : ".stamp.nope");
    if (stamp) stamp.style.opacity = 1;
    setTimeout(() => finishDecision(liked), 320);
  }

  function resetCard() {
    if (!cardEl) return;
    cardEl.classList.add("animate");
    setCardTransform(cardEl, 0);
    setTimeout(() => cardEl && cardEl.classList.remove("animate"), 300);
  }

  function attachDrag(el) {
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      currentX = 0;
      el.classList.remove("animate");
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      currentX = e.clientX - startX;
      setCardTransform(el, currentX);
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (currentX > 110) {
        flingCard("right");
      } else if (currentX < -110) {
        flingCard("left");
      } else {
        resetCard();
      }
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  }

  function renderFavorites() {
    if (!favList) return;
    const favs = getFavorites();
    const items = PRODUCTS.filter((p) => favs.includes(p.id));
    if (heartCount) heartCount.textContent = favs.length;
    if (!items.length) {
      favList.innerHTML = `<p style="color:var(--gray-text);">You haven't saved anything yet. Swipe right on what you like.</p>`;
      return;
    }
    favList.innerHTML = `<div class="grid">${items.map(renderProductCard).join("")}</div>`;
    wireProductGridEvents(favList);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const view = tab.getAttribute("data-swipe-tab");
      document.querySelector("[data-swipe-explore]").style.display = view === "explore" ? "" : "none";
      document.querySelector("[data-swipe-favlist]").style.display = view === "favorites" ? "" : "none";
      if (view === "favorites") renderFavorites();
    });
  });

  renderCard();
  renderFavorites();
}

function initCloset() {
  const grid = document.querySelector("[data-closet-grid]");
  const statItems = document.querySelector("[data-closet-count]");
  if (!grid) return;

  let currentFilter = "all";

  function render() {
    const items = getCloset().filter((i) => currentFilter === "all" || i.category === currentFilter);
    if (statItems) statItems.textContent = getCloset().length;

    const cards = items
      .map(
        (item) => `
      <div class="item-card">
        <div class="img-placeholder">
          ${closetImage(item) ? `<img class="product-photo" src="${closetImage(item)}" alt="${item.name}" loading="lazy" onerror="this.remove();" />` : ""}
          <span class="ph-text">${item.name}</span>
        </div>
        <div class="name">${item.name}</div>
        <div style="color:var(--gray-text); font-size:0.8rem;">${CATEGORY_LABELS[item.category] || item.category}</div>
      </div>`
      )
      .join("");

    grid.innerHTML =
      cards +
      `<button type="button" class="closet-add-tile" data-closet-add-inline aria-label="Add item to closet">
        <span class="plus">+</span>
        <span>Add item</span>
      </button>`;

    grid.querySelector("[data-closet-add-inline]")?.addEventListener("click", openAddForm);
  }

  function openAddForm() {
    openClosetModal((name, category) => {
      addClosetItem(name, category);
      render();
      showToast("Item added to your closet");
    });
  }

  setupPillGroup("[data-closet-filter]", (pill) => {
    currentFilter = pill.getAttribute("data-closet-filter");
    render();
  });

  document.querySelector("[data-closet-add]")?.addEventListener("click", openAddForm);

  render();
}

function initOutfit() {
  const slots = document.querySelector("[data-outfit-slots]");
  const preview = document.querySelector("[data-outfit-preview]");
  const label = document.querySelector("[data-outfit-label]");
  const prevBtn = document.querySelector("[data-outfit-prev]");
  const nextBtn = document.querySelector("[data-outfit-next]");
  if (!slots) return;

  const byCategory = {
    top: PRODUCTS.filter((p) => p.category === "top"),
    bottom: PRODUCTS.filter((p) => p.category === "bottom"),
    footwear: PRODUCTS.filter((p) => p.category === "footwear"),
    accessory: PRODUCTS.filter((p) => p.category === "accessory"),
  };

  const outfits = [];
  const maxLen = Math.max(...Object.values(byCategory).map((arr) => arr.length));
  for (let i = 0; i < maxLen; i++) {
    outfits.push({
      top: byCategory.top[i % byCategory.top.length],
      bottom: byCategory.bottom[i % byCategory.bottom.length],
      footwear: byCategory.footwear[i % byCategory.footwear.length],
      accessory: byCategory.accessory[i % byCategory.accessory.length],
    });
  }

  let index = 0;

  function render() {
    const outfit = outfits[index];
    const rows = ["top", "bottom", "footwear", "accessory"]
      .map((cat) => {
        const item = outfit[cat];
        return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:12px;">
            ${productPhotoHtml(item, "width:50px; height:50px; margin:0;")}
            <div><strong>${CATEGORY_LABELS[cat]}</strong><br /><span style="font-size:0.85rem; color:var(--gray-text);">${item.brand} · ${item.name}</span></div>
          </div>
          <a href="product.html?id=${item.id}" class="pill">View</a>
        </div>`;
      })
      .join("");
    slots.innerHTML = rows;

    if (preview) preview.textContent = outfit.top.brand[0] + outfit.bottom.brand[0];
    if (label) label.textContent = `Outfit ${index + 1} / ${outfits.length}`;
  }

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + outfits.length) % outfits.length;
    render();
  });
  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % outfits.length;
    render();
  });

  render();
}

function initCompare() {
  const left = document.querySelector("[data-compare-left]");
  const right = document.querySelector("[data-compare-right]");
  const leftSelect = document.querySelector("[data-compare-left-select]");
  const rightSelect = document.querySelector("[data-compare-right-select]");
  if (!left || !right) return;

  function optionsHtml(selectedId) {
    return PRODUCTS.map(
      (p) => `<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${p.brand} — ${p.name}</option>`
    ).join("");
  }

  function renderSide(container, productId) {
    const product = getProductById(productId);
    container.innerHTML = `
      ${productPhotoHtml(product, "width:100%; max-width:320px; aspect-ratio:3/4; height:auto; margin:0 auto 12px;")}
      <div style="display:flex; justify-content:space-between; margin-top:10px;">
        <strong>${product.name}<br /><span style="font-weight:400;">${formatPrice(product.price)}</span></strong>
        <span>${product.brand}</span>
      </div>
      <p>Quality <strong style="float:right;">${product.quality}%</strong></p>
      <p style="color:var(--pink-dark);">Matches your closet <strong style="float:right; color:var(--text-dark);">${product.match}%</strong></p>`;
  }

  function render() {
    const leftId = Number(leftSelect.value);
    const rightId = Number(rightSelect.value);
    renderSide(left, leftId);
    renderSide(right, rightId);
  }

  leftSelect.innerHTML = optionsHtml(PRODUCTS[9].id);
  rightSelect.innerHTML = optionsHtml(PRODUCTS[1].id);

  leftSelect.addEventListener("change", render);
  rightSelect.addEventListener("change", render);

  render();
}

function initCart() {
  const list = document.querySelector("[data-cart-list]");
  const summary = document.querySelector("[data-cart-summary]");
  const sizeCount = document.querySelector("[data-cart-size]");
  const completeBtn = document.querySelector("[data-cart-complete]");
  if (!list) return;

  function render() {
    const cart = getCart();

    if (!cart.length) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M3 4h2l2.4 11.3a2 2 0 0 0 2 1.7h7.4a2 2 0 0 0 2-1.6L21 8H6"/></svg>
          <p>Your cart is empty. Explore Home or Swipe to find something.</p>
        </div>`;
      if (summary) summary.innerHTML = "";
      if (sizeCount) sizeCount.textContent = "0";
      return;
    }

    let total = 0;
    list.innerHTML = cart
      .map((item) => {
        const product = getProductById(item.id);
        const lineTotal = product.price * item.qty;
        total += lineTotal;
        return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:12px;">
            ${productPhotoHtml(product, "width:60px; height:60px; margin:0; font-size:0.65rem;")}
            <div>
              <strong>${product.name}</strong><br />
              <span style="font-size:0.85rem; color:var(--gray-text);">${product.brand} · Size ${item.size} · Qty ${item.qty}</span><br />
              <span style="font-size:0.8rem; color:var(--pink-dark);">✓ Matches with ${product.matchItems} items in your closet</span>
            </div>
          </div>
          <div style="text-align:right;">
            <strong>${formatPrice(lineTotal)}</strong><br />
            <button type="button" class="pill" style="margin-top:6px; font-size:0.75rem; padding:4px 12px;" data-cart-remove="${item.id}" data-size="${item.size}">Remove</button>
          </div>
        </div>`;
      })
      .join("");

    list.querySelectorAll("[data-cart-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeFromCart(Number(btn.getAttribute("data-cart-remove")), btn.getAttribute("data-size"));
        render();
      });
    });

    if (sizeCount) sizeCount.textContent = cartCount();

    if (summary) {
      const lines = cart
        .map((item) => {
          const product = getProductById(item.id);
          return `<p style="display:flex; justify-content:space-between;"><span>${product.name} (${item.size}) x${item.qty}</span><span>${formatPrice(product.price * item.qty)}</span></p>`;
        })
        .join("");
      summary.innerHTML = `
        <p style="display:flex; justify-content:space-between;"><span>Cart size</span><strong>${cartCount()}</strong></p>
        ${lines}
        <p style="display:flex; justify-content:space-between;"><span>Shipment</span><span>Free</span></p>
        <hr />
        <p style="display:flex; justify-content:space-between; font-weight:700;"><span>Total</span><span>${formatPrice(total)}</span></p>`;
    }
  }

  completeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) return;
    addPurchases(cart);
    showPurchaseModal(cart);
    saveCart([]);
    render();
  });

  render();
}

function initProduct() {
  const wrap = document.querySelector("[data-product-detail]");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id")) || PRODUCTS[0];

  wrap.querySelector("[data-product-image]").innerHTML = productPhotoInner(product);
  wrap.querySelector("[data-product-brand]").textContent = product.brand;
  wrap.querySelector("[data-product-name]").textContent = product.name;
  wrap.querySelector("[data-product-price]").textContent = formatPrice(product.price);
  wrap.querySelector("[data-product-desc]").textContent = product.desc;
  wrap.querySelector("[data-product-match]").textContent = `Matches with ${product.matchItems} items from your closet — ${product.match}%`;
  const ratingEl = wrap.querySelector("[data-product-rating]");
  if (ratingEl) ratingEl.textContent = starsHtml(product.rating);

  const sizeSelector = wrap.querySelector("[data-product-sizes]");
  let selectedSize = product.sizes[0];
  sizeSelector.innerHTML = product.sizes
    .map((s, i) => `<button type="button" class="size-option ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`)
    .join("");

  sizeSelector.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeSelector.querySelectorAll(".size-option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.getAttribute("data-size");
    });
  });

  const favBtn = wrap.querySelector("[data-product-fav]");
  if (favBtn) {
    favBtn.classList.toggle("is-active", isFavorite(product.id));
    favBtn.addEventListener("click", () => {
      const active = toggleFavorite(product.id);
      favBtn.classList.toggle("is-active", active);
      showToast(active ? "Saved to favorites" : "Removed from favorites");
    });
  }

  const addBtn = wrap.querySelector("[data-product-add]");
  addBtn?.addEventListener("click", () => {
    addToCart(product.id, selectedSize);
    showToast(`${product.name} (size ${selectedSize}) added to cart`);
  });

  const others = document.querySelector("[data-product-others]");
  if (others) {
    const suggestions = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 2);
    others.innerHTML = suggestions
      .map(
        (p) => `
      <div class="item-card">
        <a class="thumb-link" href="product.html?id=${p.id}">${productPhotoHtml(p)}</a>
        <a class="name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="brand">${p.brand}</div>
      </div>`
      )
      .join("");
  }
}

function initProfile() {
  const purchaseGrid = document.querySelector("[data-profile-purchases]");
  const statsPurchases = document.querySelector("[data-profile-stat-purchases]");
  const statsItems = document.querySelector("[data-profile-stat-items]");
  const statsSwipes = document.querySelector("[data-profile-stat-swipes]");
  if (!purchaseGrid && !statsPurchases) return;

  const purchases = getPurchases();
  const totalBought = purchases.reduce((sum, p) => sum + p.qty, 0);
  if (statsPurchases) statsPurchases.textContent = totalBought;
  if (statsItems) statsItems.textContent = getCloset().length;
  if (statsSwipes) statsSwipes.textContent = getSwipesToday();

  if (!purchaseGrid) return;

  if (!purchases.length) {
    purchaseGrid.innerHTML = `<p style="color:var(--gray-text);">You haven't completed any purchases yet.</p>`;
    return;
  }

  purchaseGrid.innerHTML = purchases
    .map((item) => {
      const product = getProductById(item.id);
      return `
      <div class="item-card">
        <a class="thumb-link" href="product.html?id=${product.id}">${productPhotoHtml(product)}</a>
        <a class="name" href="product.html?id=${product.id}">${product.name}</a>
        <div style="color:var(--gray-text); font-size:0.8rem;">${product.brand} · Size ${item.size} · Qty ${item.qty}</div>
      </div>`;
    })
    .join("");
}


// Agregar al carrito

function openClosetModal(onAdd) {
  let modal = document.querySelector("[data-closet-modal]");

  if (!modal) {
    const options = Object.keys(CATEGORY_LABELS)
      .map((key) => `<option value="${key}">${CATEGORY_LABELS[key]}</option>`)
      .join("");

    modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.setAttribute("data-closet-modal", "");
    modal.innerHTML = `
      <div class="modal-box modal-form">
        <button type="button" class="modal-close" data-modal-close aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <h2>Add to your closet</h2>
        <p class="modal-sub">Upload a piece you already own.</p>
        <form data-closet-form novalidate>
          <div class="field">
            <label for="closet-name">Item name</label>
            <input type="text" id="closet-name" placeholder="e.g. Black jacket" autocomplete="off" />
            <div class="field-error"></div>
          </div>
          <div class="field">
            <label for="closet-category">Category</label>
            <select id="closet-category" class="select-styled">${options}</select>
          </div>
          <div class="modal-actions modal-actions-row">
            <button type="button" class="btn-secondary" data-modal-close>Cancel</button>
            <button type="submit" class="btn-primary">Add item</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-modal-close]")) modal.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.classList.remove("open");
    });
  }

  // se re-enlaza el submit cada vez para usar el callback actual
  const form = modal.querySelector("[data-closet-form]");
  const nameInput = modal.querySelector("#closet-name");
  const categorySelect = modal.querySelector("#closet-category");
  const errorEl = modal.querySelector(".field-error");

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.classList.add("invalid");
      errorEl.textContent = "Enter a name for the item";
      return;
    }
    onAdd(name, categorySelect.value);
    modal.classList.remove("open");
  };

  nameInput.value = "";
  nameInput.classList.remove("invalid");
  errorEl.textContent = "";
  categorySelect.value = "top";
  modal.classList.add("open");
  setTimeout(() => nameInput.focus(), 60);
}

// SETTING del perfil

function initSettings() {
  const openers = document.querySelectorAll("[data-settings-open]");
  if (!openers.length) return;

  const items = [
    { label: "Privacy", icon: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>' },
    { label: "Passwords", icon: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9"/><path d="M16 7l3 3"/>' },
    { label: "Payment methods", icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
    { label: "Returns", icon: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>' },
    { label: "Language", icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>' },
  ];

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.setAttribute("data-settings-modal", "");
  modal.innerHTML = `
    <div class="modal-box modal-form">
      <button type="button" class="modal-close" data-modal-close aria-label="Close settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h2>Settings</h2>
      <p class="modal-sub">Manage your account preferences.</p>
      <div class="settings-list">
        ${items
          .map(
            (it) => `
          <button type="button" class="settings-item">
            <svg class="icon" viewBox="0 0 24 24">${it.icon}</svg>
            <span>${it.label}</span>
            <svg class="icon chev" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>`
          )
          .join("")}
      </div>
    </div>`;
  document.body.appendChild(modal);

  openers.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("open");
    })
  );

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-modal-close]")) modal.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("open");
  });
}

// LOGIN / REGISTER

function initAuth() {
  const loginForm = document.querySelector("[data-login-form]");
  const registerForm = document.querySelector("[data-register-form]");

  function setError(input, message) {
    const field = input.closest(".field");
    const errorEl = field?.querySelector(".field-error");
    input.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const user = loginForm.querySelector("#user");
      const pass = loginForm.querySelector("#pass");
      let valid = true;

      if (!user.value.trim()) {
        setError(user, "Enter your email or username");
        valid = false;
      } else {
        setError(user, "");
      }

      if (!pass.value) {
        setError(pass, "Enter your password");
        valid = false;
      } else {
        setError(pass, "");
      }

      if (!valid) e.preventDefault();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const name = registerForm.querySelector("#name");
      const email = registerForm.querySelector("#email");
      const pass = registerForm.querySelector("#pass");
      const pass2 = registerForm.querySelector("#pass2");
      let valid = true;

      if (!name.value.trim()) {
        setError(name, "Enter your name");
        valid = false;
      } else {
        setError(name, "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError(email, "Enter a valid email");
        valid = false;
      } else {
        setError(email, "");
      }

      if (pass.value.length < 6) {
        setError(pass, "At least 6 characters");
        valid = false;
      } else {
        setError(pass, "");
      }

      if (pass2.value !== pass.value || !pass2.value) {
        setError(pass2, "Passwords don't match");
        valid = false;
      } else {
        setError(pass2, "");
      }

      if (!valid) e.preventDefault();
    });
  }
}

// Arranque

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupCartDrawer();
  setupChat();
  updateCartBadge();
  initAuth();

  initHome();
  initSearch();
  initSwipe();
  initCloset();
  initOutfit();
  initCompare();
  initCart();
  initProduct();
  initProfile();
  initSettings();
});
