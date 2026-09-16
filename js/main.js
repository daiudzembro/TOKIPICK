// ============================================
// TOKIPICK — funciones compartidas
// Todo lo que hace interactiva a la app vive acá:
// carrito, favoritos, placard, swipe, comparación,
// outfit generator, y validaciones de login/register.
// Usa localStorage como "base de datos" temporal
// mientras no hay backend conectado.
// ============================================

const STORAGE_KEYS = {
  cart: "tokipick_cart",
  favorites: "tokipick_favorites",
  closet: "tokipick_closet",
  purchases: "tokipick_purchases",
};

// ---------- Storage helpers ----------

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

function getCloset() {
  return readStore(STORAGE_KEYS.closet, [
    { id: "c1", name: "Top favorito", category: "top" },
    { id: "c2", name: "Jean gastado", category: "bottom" },
    { id: "c3", name: "Vestido negro", category: "dress" },
    { id: "c4", name: "Zapatillas blancas", category: "footwear" },
    { id: "c5", name: "Camisa a cuadros", category: "top" },
    { id: "c6", name: "Pantalón cargo", category: "bottom" },
    { id: "c7", name: "Campera de jean", category: "outerwear" },
  ]);
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

function getPurchases() {
  return readStore(STORAGE_KEYS.purchases, []);
}

function addPurchases(cartItems) {
  const purchases = getPurchases();
  cartItems.forEach((item) => purchases.push(item));
  writeStore(STORAGE_KEYS.purchases, purchases);
}

// ---------- Toast ----------

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

// ---------- Sidebar cart badge ----------

function updateCartBadge() {
  const badge = document.querySelector("[data-cart-badge]");
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

// ---------- Pills / tabs genéricos ----------

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

// ---------- Sidebar (drawer) ----------

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

// ---------- Chat con Toki ----------

function setupChat() {
  const form = document.querySelector("[data-chat-form]");
  const input = document.querySelector("[data-chat-input]");
  const messages = document.querySelector("[data-chat-messages]");
  if (!form || !input || !messages) return;

  const respuestasToki = [
    "Dejame ver qué tenés en tu closet para armarte algo con eso.",
    "¡Buena elección! ¿Querés que te muestre opciones para completarlo?",
    "Puedo comparar un par de prendas si querés decidir entre varias.",
    "Contame más sobre la ocasión y te armo un outfit acorde.",
    "Fijate en la sección Compare si querés ver precio y calidad lado a lado.",
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

// ---------- Render de tarjeta de producto ----------

function renderProductCard(product) {
  const fav = isFavorite(product.id);
  const sizesHtml = product.sizes
    .slice(0, 4)
    .map((s) => `<span class="size-chip">${s}</span>`)
    .join("");

  return `
    <div class="item-card" data-product-card="${product.id}">
      <a class="thumb-link" href="product.html?id=${product.id}">
        <div class="img-placeholder">${product.name}</div>
      </a>
      <div class="top-row">
        <span class="brand">${product.brand}</span>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <a class="name" href="product.html?id=${product.id}">${product.name}</a>
      <div class="sizes">${sizesHtml}</div>
      <div class="match"><span>Matches ${product.matchItems} items</span><span>${product.match}%</span></div>
      <div class="card-actions">
        <button type="button" class="icon-btn ${fav ? "is-active" : ""}" data-fav-btn="${product.id}" aria-label="Guardar en favoritos">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 21s-7.2-4.5-9.7-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.7 6c-2.5 4.5-9.7 9-9.7 9Z"/></svg>
        </button>
        <button type="button" class="btn-add" data-quick-add="${product.id}">Add to cart</button>
      </div>
    </div>`;
}

function wireProductGridEvents(container) {
  container.querySelectorAll("[data-fav-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-fav-btn"));
      const active = toggleFavorite(id);
      btn.classList.toggle("is-active", active);
      showToast(active ? "Guardado en favoritos" : "Quitado de favoritos");
    });
  });

  container.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-quick-add"));
      const product = getProductById(id);
      const size = product.sizes[0];
      addToCart(id, size);
      showToast(`${product.name} (talle ${size}) agregado al carrito`);
    });
  });
}

function renderGrid(container, products) {
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <p>No encontramos prendas para mostrar acá.</p>
      </div>`;
    return;
  }
  container.innerHTML = products.map(renderProductCard).join("");
  wireProductGridEvents(container);
}

// ============================================
// Inicializadores por pantalla
// ============================================

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
  runSearch();
}

function initSwipe() {
  const stack = document.querySelector("[data-swipe-stack]");
  const favList = document.querySelector("[data-swipe-favorites]");
  const likeBtn = document.querySelector("[data-swipe-like]");
  const dislikeBtn = document.querySelector("[data-swipe-dislike]");
  const counter = document.querySelector("[data-swipe-counter]");
  const tabs = document.querySelectorAll("[data-swipe-tab]");
  if (!stack) return;

  let deck = [...PRODUCTS];
  let index = 0;

  function renderCard() {
    if (index >= deck.length) {
      stack.innerHTML = `
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6 9 17l-5-5"/></svg>
          <p>Ya viste todas las prendas de hoy. ¡Volvé mañana por más!</p>
        </div>`;
      return;
    }
    const product = deck[index];
    stack.innerHTML = `
      <div class="img-placeholder" style="height:280px;">${product.name}</div>
      <h2 style="margin:8px 0 0;">${product.brand}</h2>
      <p>${product.name} — ${formatPrice(product.price)}</p>
      <p style="color:var(--gray-text); font-size:0.85rem;">← Swipe to dismiss &nbsp;·&nbsp; Swipe to save →</p>`;
    if (counter) counter.textContent = `· ${index + 1}/${deck.length}`;
  }

  function next(liked) {
    const product = deck[index];
    if (product && liked) {
      const favs = getFavorites();
      if (!favs.includes(product.id)) {
        favs.push(product.id);
        writeStore(STORAGE_KEYS.favorites, favs);
      }
    }
    index += 1;
    renderCard();
    renderFavorites();
  }

  function renderFavorites() {
    if (!favList) return;
    const favs = getFavorites();
    const items = PRODUCTS.filter((p) => favs.includes(p.id));
    if (!items.length) {
      favList.innerHTML = `<p style="color:var(--gray-text);">Todavía no guardaste nada. Hacé swipe a la derecha en lo que te guste.</p>`;
      return;
    }
    favList.innerHTML = `<div class="grid">${items.map(renderProductCard).join("")}</div>`;
    wireProductGridEvents(favList);
  }

  likeBtn?.addEventListener("click", () => next(true));
  dislikeBtn?.addEventListener("click", () => next(false));

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
  const addBtn = document.querySelector("[data-closet-add]");
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
        <div class="img-placeholder">${item.name}</div>
        <div class="name">${item.name}</div>
        <div style="color:var(--gray-text); font-size:0.8rem;">${CATEGORY_LABELS[item.category] || item.category}</div>
      </div>`
      )
      .join("");

    grid.innerHTML =
      cards +
      `<button type="button" class="item-card" data-closet-add-inline style="align-items:center; justify-content:center; cursor:pointer; border:1px dashed var(--navy); background:transparent; min-height:140px;">
        <span style="font-size:1.8rem; color:var(--navy);">+</span>
      </button>`;

    grid.querySelector("[data-closet-add-inline]")?.addEventListener("click", openAddForm);
  }

  function openAddForm() {
    const name = prompt("¿Qué prenda querés subir a tu placard? (ej: Campera negra)");
    if (!name) return;
    const category = prompt("Categoría: top, bottom, footwear, accessory, outerwear o dress", "top");
    const valid = ["top", "bottom", "footwear", "accessory", "outerwear", "dress"];
    addClosetItem(name.trim(), valid.includes((category || "").trim()) ? category.trim() : "top");
    render();
    showToast("Prenda agregada a tu placard");
  }

  setupPillGroup("[data-closet-filter]", (pill) => {
    currentFilter = pill.getAttribute("data-closet-filter");
    render();
  });

  addBtn?.addEventListener("click", openAddForm);

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
            <div class="img-placeholder" style="width:50px; height:50px; margin:0;">${item.name}</div>
            <div><strong>${CATEGORY_LABELS[cat]}</strong><br /><span style="font-size:0.85rem; color:var(--gray-text);">${item.brand} · ${item.name}</span></div>
          </div>
          <a href="product.html?id=${item.id}" class="pill">Ver</a>
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
    const best = product.match >= 80;
    container.innerHTML = `
      ${
        best
          ? `<span style="position:absolute; top:16px; right:16px; background:var(--navy); color:var(--pink); padding:6px 12px; border-radius:16px; font-size:0.75rem; display:flex; align-items:center; gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.7 5 5 1.7-5 1.7L12 16l-1.7-4.6-5-1.7 5-1.7Z"/></svg>
              Best option
            </span>`
          : ""
      }
      <div class="img-placeholder" style="height:220px;">${product.name}</div>
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
          <p>Tu carrito está vacío. Explorá Home o Swipe para encontrar algo.</p>
        </div>`;
      if (summary) summary.innerHTML = "";
      if (sizeCount) sizeCount.textContent = "0";
      if (completeBtn) completeBtn.setAttribute("aria-disabled", "true");
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
            <div class="img-placeholder" style="width:60px; height:60px; margin:0; font-size:0.65rem;">${product.name}</div>
            <div>
              <strong>${product.name}</strong><br />
              <span style="font-size:0.85rem; color:var(--gray-text);">${product.brand} · Talle ${item.size} · Cant. ${item.qty}</span><br />
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
    saveCart([]);
    render();
    showToast("¡Compra realizada con éxito!");
  });

  render();
}

function initProduct() {
  const wrap = document.querySelector("[data-product-detail]");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id")) || PRODUCTS[0];

  wrap.querySelector("[data-product-image]").textContent = product.name;
  wrap.querySelector("[data-product-brand]").textContent = product.brand;
  wrap.querySelector("[data-product-name]").textContent = product.name;
  wrap.querySelector("[data-product-price]").textContent = formatPrice(product.price);
  wrap.querySelector("[data-product-desc]").textContent = product.desc;
  wrap.querySelector("[data-product-match]").textContent = `Matches with ${product.matchItems} items from your closet — ${product.match}%`;

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
      showToast(active ? "Guardado en favoritos" : "Quitado de favoritos");
    });
  }

  const addBtn = wrap.querySelector("[data-product-add]");
  addBtn?.addEventListener("click", () => {
    addToCart(product.id, selectedSize);
    showToast(`${product.name} (talle ${selectedSize}) agregado al carrito`);
  });

  const others = document.querySelector("[data-product-others]");
  if (others) {
    const suggestions = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 2);
    others.innerHTML = suggestions
      .map(
        (p) => `
      <div class="item-card">
        <a class="thumb-link" href="product.html?id=${p.id}"><div class="img-placeholder">${p.name}</div></a>
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
  if (!purchaseGrid && !statsPurchases) return;

  const purchases = getPurchases();
  if (statsPurchases) statsPurchases.textContent = purchases.length;
  if (statsItems) statsItems.textContent = getCloset().length;

  if (purchaseGrid) {
    if (!purchases.length) {
      purchaseGrid.innerHTML = `<p style="color:var(--gray-text);">Todavía no completaste ninguna compra.</p>`;
      return;
    }
    purchaseGrid.innerHTML = purchases
      .map((item) => {
        const product = getProductById(item.id);
        return `<div class="img-placeholder">${product.name}</div>`;
      })
      .join("");
  }
}

// ---------- Login / Register ----------

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
        setError(user, "Ingresá tu email o usuario");
        valid = false;
      } else {
        setError(user, "");
      }

      if (!pass.value) {
        setError(pass, "Ingresá tu contraseña");
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
        setError(name, "Ingresá tu nombre");
        valid = false;
      } else {
        setError(name, "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError(email, "Ingresá un email válido");
        valid = false;
      } else {
        setError(email, "");
      }

      if (pass.value.length < 6) {
        setError(pass, "Mínimo 6 caracteres");
        valid = false;
      } else {
        setError(pass, "");
      }

      if (pass2.value !== pass.value || !pass2.value) {
        setError(pass2, "Las contraseñas no coinciden");
        valid = false;
      } else {
        setError(pass2, "");
      }

      if (!valid) e.preventDefault();
    });
  }
}

// ============================================
// Arranque
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
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
});
