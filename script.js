// ==========================================
// OZODBEK-ART & PHLOX STORE JAVASCRIPT
// ==========================================

// --- TELEGRAM BOT DEFAULT SOZLAMALARI ---
// Foydalanuvchi o'z bot ma'lumotlarini kiritishi yoki sozlamalardan o'zgartirishi mumkin
const DEFAULT_TELEGRAM_CONFIG = {
  botToken: "8263605074:AAG3cIDxY-CnZpXWtUE5MfmPwPDmG541Ms8", // Ulangan yangi bot tokeni
  chatId: "5337490769", // Chat ID (Ozodbek)
  telegramUsername: "ozodbek_art_bot" // Fallback t.me link
};

// LocalStorage dan o'qish
function getTelegramConfig() {
  const saved = localStorage.getItem("ozodbek_telegram_config");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Agar avvalgi eski token yoki eski chat ID saqlanib qolgan bo'lsa, yangisiga almashtirish
      if (parsed.botToken === "7683939612:AAH9fIcxkS26LgLvhq6z_o3rWb7vP9u1V7Q" || !parsed.botToken) {
        parsed.botToken = DEFAULT_TELEGRAM_CONFIG.botToken;
      }
      if (parsed.chatId === "5876384792" || !parsed.chatId) {
        parsed.chatId = DEFAULT_TELEGRAM_CONFIG.chatId;
      }
      return { ...DEFAULT_TELEGRAM_CONFIG, ...parsed };
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_TELEGRAM_CONFIG;
}

function saveTelegramConfig(botToken, chatId, telegramUsername) {
  const config = {
    botToken: botToken.trim() || DEFAULT_TELEGRAM_CONFIG.botToken,
    chatId: chatId.trim() || DEFAULT_TELEGRAM_CONFIG.chatId,
    telegramUsername: (telegramUsername || "").trim().replace('@', '') || DEFAULT_TELEGRAM_CONFIG.telegramUsername
  };
  localStorage.setItem("ozodbek_telegram_config", JSON.stringify(config));
  showToast("✅ Telegram sozlamalari muvaffaqiyatli saqlandi!", "success");
}

// --- MAHSULOTLAR RO'YXATI (DATABASE) ---
const PRODUCTS = [
  {
    id: 1,
    name: "Android Art Edition",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 10000,
    oldPrice: 15000,
    badge: "Hot",
    rating: 5.0,
    reviews: 24,
    image: "./image copy 6.png",
    url: "mahsulot-1.html",
    description: "Sifatli va ishonchli san'at namunasi — qo'lda ishlangan eksklyuziv Android dizayni."
  },
  {
    id: 2,
    name: "Samsung Galaxy S21 Art",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 12000,
    oldPrice: 16000,
    badge: "Sale -25%",
    rating: 4.9,
    reviews: 38,
    image: "./image copy 7.png",
    url: "samsung-s21.html",
    description: "Flagman kamera va Dynamic AMOLED uslubidagi noyob karton san'at asari."
  },
  {
    id: 3,
    name: "Redmi Workstation Monoblock",
    category: "computers",
    categoryName: "Kompyuterlar",
    price: 25000,
    oldPrice: 35000,
    badge: "Trend",
    rating: 5.0,
    reviews: 19,
    image: "./image copy 5.png",
    url: "redmi.html",
    description: "Katta monitor, klaviatura va sichqonchadan iborat to'liq ish stoli art to'plami."
  },
  {
    id: 4,
    name: "iPhone 17 Pro Max Cardboard",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 15000,
    oldPrice: 20000,
    badge: "Bestseller",
    rating: 5.0,
    reviews: 52,
    image: "./image copy 3.png",
    url: "samsung-a54.html",
    description: "Olma logotipi va uch kamerali kelajak avlod iPhone 17 Pro Max qo'l mehnati."
  },
  {
    id: 5,
    name: "LG Velvet Paper Craft",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 10000,
    oldPrice: 14000,
    badge: "Art",
    rating: 4.8,
    reviews: 16,
    image: "./image copy 2.png",
    url: "lg-velvet.html",
    description: "Klassik LG Velvet uslubidagi o'ziga xos chizilgan dizayn."
  },
  {
    id: 6,
    name: "Goodwell Eco Art Unit",
    category: "accessories",
    categoryName: "Aksessuarlar",
    price: 18000,
    oldPrice: 22000,
    badge: "Sale",
    rating: 4.9,
    reviews: 11,
    image: "./image copy 8.jpg",
    url: "galaxy-s24.html",
    description: "Noyob Goodwell eko quti san'ati — interyer uchun original dekoratsiya."
  },
  {
    id: 7,
    name: "Galaxy S26 Ultra Pro Edition",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 20000,
    oldPrice: 28000,
    badge: "New",
    rating: 5.0,
    reviews: 43,
    image: "./image.png",
    url: "samsungA.html",
    description: "S-Pen qalamchasi va to'rt kamerali kuchli Galaxy S26 Ultra dizayni."
  },
  {
    id: 8,
    name: "Samsung Classic Dark Edition",
    category: "smartphones",
    categoryName: "Smartfonlar",
    price: 11000,
    oldPrice: 15000,
    badge: "Popular",
    rating: 4.9,
    reviews: 29,
    image: "./image copy.png",
    url: "samsung-s21.html",
    description: "Qora fonda stikerli va yorqin uslubdagi Samsung qo'l mehnati."
  }
];

// --- SAVAT (CART) BOSHQARUVI ---
let cart = [];

function loadCart() {
  const saved = localStorage.getItem("ozodbek_cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem("ozodbek_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(productId, count = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += count;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: count
    });
  }

  saveCart();
  showToast(`🛒 "${product.name}" savatga qo'shildi!`, "success");
  openCartDrawer();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  showToast("Mahsulot savatdan o'chirildi", "info");
}

function clearCart() {
  cart = [];
  saveCart();
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-count-badge");
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? "inline-flex" : "none";
  });
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

// --- SAVAT DRAWERINI CHIZISH ---
function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItems");
  const totalElem = document.getElementById("cartDrawerTotal");
  const emptyElem = document.getElementById("cartDrawerEmpty");
  const footerElem = document.getElementById("cartDrawerFooter");

  if (!container || !totalElem) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyElem) emptyElem.style.display = "block";
    if (footerElem) footerElem.style.display = "none";
    totalElem.textContent = "0 so'm";
    return;
  }

  if (emptyElem) emptyElem.style.display = "none";
  if (footerElem) footerElem.style.display = "block";

  let html = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-controls">
            <button onclick="updateCartQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="O'chirish">🗑</button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalElem.textContent = formatPrice(total);
}

// --- DRAWER VA MODALLAR OCHISH/YOPISH ---
function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("modalBackdrop");
  if (drawer) drawer.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("modalBackdrop");
  if (drawer) drawer.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function openCheckoutModal(singleProduct = null) {
  closeCartDrawer();
  const modal = document.getElementById("checkoutModal");
  const backdrop = document.getElementById("modalBackdrop");
  const summaryElem = document.getElementById("checkoutOrderSummary");
  const totalElem = document.getElementById("checkoutOrderTotal");

  let itemsToOrder = [];
  if (singleProduct) {
    itemsToOrder = [{
      id: singleProduct.id,
      name: singleProduct.name,
      price: singleProduct.price,
      quantity: 1,
      image: singleProduct.image
    }];
  } else {
    itemsToOrder = [...cart];
  }

  if (itemsToOrder.length === 0) {
    showToast("⚠️ Buyurtma berish uchun savatingiz bo'sh!", "warning");
    return;
  }

  // Buyurtma sarhisobini chiqarish
  let total = 0;
  let html = "";
  itemsToOrder.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="checkout-summary-row">
        <span>${item.name} × ${item.quantity}</span>
        <strong>${formatPrice(itemTotal)}</strong>
      </div>
    `;
  });

  if (summaryElem) summaryElem.innerHTML = html;
  if (totalElem) totalElem.textContent = formatPrice(total);

  window.currentCheckoutItems = itemsToOrder;

  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("modalBackdrop");
  const config = getTelegramConfig();

  const tokenInput = document.getElementById("settingBotToken");
  const chatIdInput = document.getElementById("settingChatId");
  const usernameInput = document.getElementById("settingBotUsername");

  if (tokenInput) tokenInput.value = config.botToken;
  if (chatIdInput) chatIdInput.value = config.chatId;
  if (usernameInput) usernameInput.value = config.telegramUsername || "";

  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function openSearchModal() {
  const modal = document.getElementById("searchModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
  setTimeout(() => {
    const input = document.getElementById("searchInputModal");
    if (input) input.focus();
  }, 100);
}

function closeSearchModal() {
  const modal = document.getElementById("searchModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function closeAllModals() {
  closeCartDrawer();
  closeCheckoutModal();
  closeSettingsModal();
  closeSearchModal();
  closeLoginModal();
}

// --- TELEGRAMGA ZAKAZ YUBORISH (ENG ASOSIY XUSUSIYAT) ---
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("checkoutForm");
  const submitBtn = document.getElementById("checkoutSubmitBtn");

  const name = form.customerName.value.trim();
  const phone = form.customerPhone.value.trim();
  const address = form.customerAddress.value.trim();
  const paymentMethod = form.paymentMethod.value;
  const comment = form.customerComment.value.trim();

  if (!name || !phone) {
    showToast("Iltimos, ism va telefon raqamingizni kiriting!", "warning");
    return;
  }

  const items = window.currentCheckoutItems || cart;
  if (!items || items.length === 0) {
    showToast("Buyurtma ro'yxati bo'sh!", "warning");
    return;
  }

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const dateStr = now.toLocaleDateString("uz-UZ") + " " + now.toLocaleTimeString("uz-UZ");

  let total = 0;
  let itemsText = "";
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemsText += `${index + 1}. *${item.name}*\n   ├ Soni: ${item.quantity} ta\n   └ Narxi: ${formatPrice(itemTotal)}\n`;
  });

  const messageText = `🛍 *YANGI BUYURTMA QABUL QILINDI!*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *Buyurtma ID:* \`#${orderId}\`\n` +
    `👤 *Mijoz:* ${name}\n` +
    `📞 *Telefon:* ${phone}\n` +
    `📍 *Manzil:* ${address || "Belgilanmagan"}\n` +
    `💳 *To'lov usuli:* ${paymentMethod}\n` +
    `💬 *Izoh:* ${comment || "Yo'q"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *BUYURTMA TARKIBI:*\n${itemsText}` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *JAMI SUMMA:* *${formatPrice(total)}*\n` +
    `🕒 *Vaqt:* ${dateStr}\n` +
    `🌐 *Manba:* OZODBEK-ART rasmiy do'koni`;

  // Tugmani yuklanmoqda holatiga o'tkazish
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Telegramga yuborilmoqda...";
  }

  const config = getTelegramConfig();
  let isSuccess = false;

  try {
    const apiUrl = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: messageText,
        parse_mode: "Markdown"
      })
    });

    const data = await response.json();
    if (data.ok) {
      isSuccess = true;
    } else {
      console.warn("Telegram API javobi:", data);
    }
  } catch (error) {
    console.error("Telegram API xatosi:", error);
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "✅ Buyurtmani tasdiqlash";
  }

  // Har qanday holatda ham foydalanuvchiga muvaffaqiyat bildirishnomasi
  closeCheckoutModal();
  clearCart();
  form.reset();

  showOrderSuccessModal(orderId, name, phone, total, messageText, config, isSuccess);
}

// Muvaffaqiyatli buyurtma oynasi (va Telegram fallback)
function showOrderSuccessModal(orderId, name, phone, total, messageText, config, isDirectSuccess) {
  const existing = document.getElementById("successOrderModal");
  if (existing) existing.remove();

  const encodedMsg = encodeURIComponent(messageText.replace(/\*/g, '').replace(/`/g, ''));
  const tgDirectLink = config.telegramUsername ? 
    `https://t.me/${config.telegramUsername}?text=${encodedMsg}` : 
    `https://t.me/share/url?url=&text=${encodedMsg}`;

  const modalHtml = `
    <div id="successOrderModal" class="modal-box open" style="display: flex;">
      <div class="modal-content success-content">
        <div class="success-icon">🎉</div>
        <h2>Buyurtmangiz qabul qilindi!</h2>
        <p class="order-number">Buyurtma raqami: <strong>#${orderId}</strong></p>
        <p class="success-desc">
          Rahmat, <strong>${name}</strong>! Sizning buyurtmangiz muvaffaqiyatli qayd etildi. 
          Tez orada operatorimiz <strong>${phone}</strong> raqamiga aloqaga chiqadi.
        </p>
        <div class="success-total-box">
          Jami summa: <span>${formatPrice(total)}</span>
        </div>
        ${isDirectSuccess ? 
          `<div class="tg-status-badge success">✅ Telegram botimizga buyurtma to'g'ridan-to'g'ri yuborildi!</div>` : 
          `<div class="tg-status-badge warning">ℹ️ Buyurtmani qo'shimcha ravishda Telegramda ham tasdiqlashingiz mumkin:</div>`
        }
        <div class="success-actions">
          <a href="${tgDirectLink}" target="_blank" class="btn btn-telegram">
            ✈️ Telegram orqali ham yuborish
          </a>
          <button class="btn btn-secondary" onclick="closeSuccessOrderModal()">
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) backdrop.classList.add("show");
}

function closeSuccessOrderModal() {
  const modal = document.getElementById("successOrderModal");
  if (modal) modal.remove();
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) backdrop.classList.remove("show");
}

// --- JONLI QIDIRUV (SEARCH) ---
function handleSearchInput(query) {
  const resultsContainer = document.getElementById("searchResultsModal");
  if (!resultsContainer) return;

  const q = (query || "").trim().toLowerCase();
  if (q.length === 0) {
    resultsContainer.innerHTML = `<div class="search-hint">Mahsulot nomini yoki turini kiriting (masalan: Samsung, iPhone, Redmi, Art...)</div>`;
    return;
  }

  const matched = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) || 
    p.categoryName.toLowerCase().includes(q)
  );

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<div class="search-empty">🔍 "${query}" bo'yicha hech qanday mahsulot topilmadi.</div>`;
    return;
  }

  let html = "";
  matched.forEach(item => {
    html += `
      <div class="search-result-row" onclick="window.location.href='${item.url}'">
        <img src="${item.image}" alt="${item.name}">
        <div class="search-result-details">
          <h4>${item.name}</h4>
          <span class="search-result-category">${item.categoryName}</span>
          <span class="search-result-price">${formatPrice(item.price)}</span>
        </div>
        <button class="btn btn-sm" onclick="event.stopPropagation(); addToCart(${item.id});">Savatga</button>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}

// --- TOAST BILDIRISHNOMALARI ---
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- BIRIKTIRILGAN MAHSULOTLARNI RENDER QILISH (BEST SELLERS) ---
function renderBestSellers(targetId = "bestSellersGrid") {
  const grid = document.getElementById(targetId);
  if (!grid) return;

  let html = "";
  PRODUCTS.forEach(p => {
    html += `
      <div class="product-card" data-category="${p.category}">
        <div class="card-media">
          ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase().includes('sale') ? 'sale' : 'hot'}">${p.badge}</span>` : ''}
          <a href="${p.url}" class="card-img-link">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
          </a>
          <div class="card-overlay-actions">
            <button onclick="addToCart(${p.id})" title="Savatga qo'shish" class="overlay-btn btn-cart">🛒</button>
            <button onclick="openCheckoutModal({id: ${p.id}, name: '${p.name.replace(/'/g, "\\'")}', price: ${p.price}, image: '${p.image}'})" title="Tezkor sotib olish" class="overlay-btn btn-buy">⚡</button>
            <a href="${p.url}" title="Batafsil ko'rish" class="overlay-btn btn-view">👁</a>
          </div>
        </div>
        <div class="card-body">
          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${p.rating} (${p.reviews})</span>
          </div>
          <h3 class="product-title"><a href="${p.url}">${p.name}</a></h3>
          <p class="product-desc-short">${p.description}</p>
          <div class="card-price-row">
            <div class="price-box">
              <span class="current-price">${formatPrice(p.price)}</span>
              ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
            <button class="btn-add-cart" onclick="addToCart(${p.id})">Savatga</button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderBestSellers();

  // Modal Backdrop bosilganda yopish
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeAllModals);
  }

  // Checkout form hodisasi
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  // Search input hodisasi
  const searchInput = document.getElementById("searchInputModal");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearchInput(e.target.value));
  }

  // Telegram settings form hodisasi
  const settingsForm = document.getElementById("telegramSettingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveTelegramConfig(
        settingsForm.botToken.value,
        settingsForm.chatId.value,
        settingsForm.botUsername.value
      );
      closeSettingsModal();
    });
  }

  // Klaviatura Esc tugmasi
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
});
