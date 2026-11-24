// ==========================================
// OZODBEK-ART STORE JAVASCRIPT
// Modern, Modular & High-Performance Script
// ==========================================

// --- TELEGRAM BOT CONFIG ---
const DEFAULT_TELEGRAM_CONFIG = {
  botToken: "8263605074:AAG3cIDxY-CnZpXWtUE5MfmPwPDmG541Ms8",
  chatId: "5337490769",
  telegramUsername: "ozodbek_art_bot"
};

function getTelegramConfig() {
  const saved = localStorage.getItem("ozodbek_telegram_config");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
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
  showToast("✅ Telegram sozlamalari saqlandi!", "success");
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
    image: "images/products/android-art.png",
    gallery: ["images/products/android-art.png", "images/products/galaxy-s26.png"],
    url: "product.html?id=1",
    description: "Sifatli va ishonchli san'at namunasi — qo'lda ishlangan eksklyuziv Android dizayni. Mustahkam qog'oz va kartondan ishlangan, stollar va javonlar uchun ajoyib suvenir.",
    specs: {
      "Kategoriya": "Smartfonlar / Art Edition",
      "Model": "Android Green Art",
      "Material": "Eko gofrokarton va qalin akvarel qog'oz",
      "O'lchami": "Haqiqiy 6.1 dyuymli smartfon proporsiyasi",
      "Kafolat": "Mualliflik qo'l mehnati kafolati"
    }
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
    image: "images/products/samsung-s21.png",
    gallery: ["images/products/samsung-s21.png", "images/products/samsung-classic.png"],
    url: "product.html?id=2",
    description: "Flagman kamera va Dynamic AMOLED uslubidagi noyob karton san'at asari. Kontur chiziqlari va kamera bloki aniq detallashtirilgan.",
    specs: {
      "Kategoriya": "Smartfonlar / Flagman",
      "Model": "Galaxy S21 Custom Art",
      "Material": "Qalin qora va kumush karton",
      "Ranglar": "Phantom Violet & Matte Black",
      "Yetkazish": "O'zbekiston bo'ylab pochta va kuryer"
    }
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
    image: "images/products/redmi-workstation.png",
    gallery: ["images/products/redmi-workstation.png", "images/products/goodwell-art.jpg"],
    url: "product.html?id=3",
    description: "Katta monitor, klaviatura va sichqonchadan iborat to'liq ish stoli art to'plami. Ofis va ish joylari uchun mukammal sovg'a.",
    specs: {
      "Kategoriya": "Kompyuterlar & Monobloklar",
      "Model": "Redmi Workstation Pro",
      "Tarkibi": "Monitor + Stend + Klaviatura + Sichqoncha",
      "Material": "Qalin 5 qavatli gofrokarton",
      "Turi": "Qo'lda chizilgan va yig'ilgan"
    }
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
    image: "images/products/iphone-17.png",
    gallery: ["images/products/iphone-17.png", "images/products/android-art.png"],
    url: "product.html?id=4",
    description: "Olma logotipi va uch kamerali kelajak avlod iPhone 17 Pro Max qo'l mehnati. Titan ramka chiziqlari noziklik bilan chizilgan.",
    specs: {
      "Kategoriya": "Smartfonlar / Pro Max",
      "Model": "iPhone 17 Pro Max Custom",
      "Kamera": "3 ta linzali sun'iy kamera bloki",
      "Material": "Titan tusidagi maxsus karton",
      "Kafolat": "100% original ijodiy ish"
    }
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
    image: "images/products/lg-velvet.png",
    gallery: ["images/products/lg-velvet.png", "images/products/galaxy-s26.png"],
    url: "product.html?id=5",
    description: "Klassik LG Velvet uslubidagi o'ziga xos tomchi shaklidagi kamerali qog'oz san'ati.",
    specs: {
      "Kategoriya": "Smartfonlar / Retro Art",
      "Model": "LG Velvet Raindrop",
      "Material": "Yaltiroq plyonkali qalin qog'oz",
      "Joylashuvi": "Javon yoki kolleksiya uchun"
    }
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
    image: "images/products/goodwell-art.jpg",
    gallery: ["images/products/goodwell-art.jpg", "images/products/redmi-workstation.png"],
    url: "product.html?id=6",
    description: "Noyob Goodwell eko quti san'ati — interyer, ofis yoki ustaxona uchun original dekoratsiya.",
    specs: {
      "Kategoriya": "Aksessuarlar / Art Dekor",
      "Model": "Goodwell Custom 2026",
      "Material": "Qalin gofrokarton, tarvuz illyustratsiyasi, stikerlar",
      "Joylashuvi": "Devorga yoki javonga o'rnatish uchun qulay"
    }
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
    image: "images/products/galaxy-s26.png",
    gallery: ["images/products/galaxy-s26.png", "images/products/samsung-s21.png"],
    url: "product.html?id=7",
    description: "S-Pen qalamchasi va to'rt kamerali kuchli Galaxy S26 Ultra dizayni. Eng so'nggi 2026 flagman modeli.",
    specs: {
      "Kategoriya": "Smartfonlar / Flagman Pro",
      "Model": "Galaxy S26 Ultra Titanium",
      "Komplekt": "Smartfon + S-Pen stilus nusxasi",
      "Ekran": "Dynamic AMOLED uslubidagi chizilgan ekran",
      "Kafolat": "Sifat va mustahkamlik kafolati"
    }
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
    image: "images/products/samsung-classic.png",
    gallery: ["images/products/samsung-classic.png", "images/products/galaxy-s26.png"],
    url: "product.html?id=8",
    description: "Qora fonda stikerli va yorqin uslubdagi Samsung qo'l mehnati.",
    specs: {
      "Kategoriya": "Smartfonlar / Dark Classic",
      "Model": "Samsung Black Art",
      "Material": "Mat qora karton va neon stikerlar"
    }
  }
];

// --- TUNGI / KUNDUZGI REJIM (DARK MODE) ---
function initTheme() {
  const savedTheme = localStorage.getItem("ozodbek_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggleBtn(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("ozodbek_theme", nextTheme);
  updateThemeToggleBtn(nextTheme);
  showToast(nextTheme === "dark" ? "🌙 Tungi rejim yoqildi" : "☀️ Kunduzgi rejim yoqildi", "info");
}

function updateThemeToggleBtn(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = theme === "dark" ? "☀️" : "🌙";
    btn.title = theme === "dark" ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish";
  }
}

// --- SEVIMLILAR (WISHLIST) BOSHQARUVI ---
let wishlist = [];

function loadWishlist() {
  const saved = localStorage.getItem("ozodbek_wishlist");
  if (saved) {
    try {
      wishlist = JSON.parse(saved);
    } catch (e) {
      wishlist = [];
    }
  }
  updateWishlistBadge();
}

function saveWishlist() {
  localStorage.setItem("ozodbek_wishlist", JSON.stringify(wishlist));
  updateWishlistBadge();
  renderWishlistModal();
}

function isInWishlist(productId) {
  return wishlist.some(id => id === productId);
}

function toggleWishlist(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (isInWishlist(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast(`💔 "${product.name}" sevimlilardan olib tashlandi`, "info");
  } else {
    wishlist.push(productId);
    showToast(`❤️ "${product.name}" sevimlilarga qo'shildi!`, "success");
  }

  saveWishlist();

  // Barcha sahifadagi tegishli yurakcha tugmalarini yangilash
  document.querySelectorAll(`.btn-wishlist-${productId}`).forEach(btn => {
    btn.classList.toggle("active", isInWishlist(productId));
  });
}

function updateWishlistBadge() {
  const badges = document.querySelectorAll(".wishlist-count-badge");
  badges.forEach(b => {
    b.textContent = wishlist.length;
    b.style.display = wishlist.length > 0 ? "inline-flex" : "none";
  });
}

function openWishlistModal() {
  renderWishlistModal();
  const modal = document.getElementById("wishlistModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeWishlistModal() {
  const modal = document.getElementById("wishlistModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

function renderWishlistModal() {
  const container = document.getElementById("wishlistItemsList");
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 10px; color:#888;">
        <span style="font-size:36px; display:block; margin-bottom:10px;">❤️</span>
        <p>Hozircha sevimli mahsulotlaringiz yo'q.</p>
        <a href="shop.html" class="btn-pill-red" style="margin-top:14px; display:inline-block; font-size:13px;" onclick="closeWishlistModal()">Katalogni ko'rish</a>
      </div>
    `;
    return;
  }

  let html = "";
  wishlist.forEach(id => {
    const item = PRODUCTS.find(p => p.id === id);
    if (!item) return;

    html += `
      <div class="wishlist-row">
        <img src="${item.image}" alt="${item.name}">
        <div class="wishlist-row-info">
          <h4><a href="${item.url}">${item.name}</a></h4>
          <span class="price">${formatPrice(item.price)}</span>
        </div>
        <div class="wishlist-row-actions">
          <button class="btn btn-sm" onclick="addToCart(${item.id}); toggleWishlist(${item.id});" style="background:var(--primary-red); color:#fff; border-radius:var(--radius-pill); font-size:12px; padding:6px 12px; border:none; cursor:pointer;">Savatga</button>
          <button onclick="toggleWishlist(${item.id})" style="background:none; border:none; cursor:pointer; font-size:16px; color:#888;" title="O'chirish">✕</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// --- TEZKOR XARID (1-CLICK QUICK BUY) ---
let currentQuickBuyProduct = null;

function openQuickBuyModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentQuickBuyProduct = product;
  const modal = document.getElementById("quickBuyModal");
  const backdrop = document.getElementById("modalBackdrop");

  const preview = document.getElementById("quickBuyPreview");
  if (preview) {
    preview.innerHTML = `
      <div class="quick-product-preview">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <div class="quick-title">${product.name}</div>
          <div class="quick-price">${formatPrice(product.price)}</div>
          <small style="color:#888;">Kategoriya: ${product.categoryName}</small>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add("open");
  if (backdrop) backdrop.classList.add("show");
}

function closeQuickBuyModal() {
  const modal = document.getElementById("quickBuyModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
}

async function handleQuickBuySubmit(e) {
  e.preventDefault();
  if (!currentQuickBuyProduct) return;

  const form = document.getElementById("quickBuyForm");
  const name = form.quickCustomerName.value.trim();
  const phone = form.quickCustomerPhone.value.trim();

  if (!name || !phone) {
    showToast("Ism va telefon raqamingizni kiriting!", "warning");
    return;
  }

  const orderId = "QUICK-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const dateStr = now.toLocaleDateString("uz-UZ") + " " + now.toLocaleTimeString("uz-UZ");

  const itemsText = `1. *${currentQuickBuyProduct.name}*\n   ├ Soni: 1 ta\n   └ Narxi: ${formatPrice(currentQuickBuyProduct.price)}\n`;

  const orderPayload = {
    orderId,
    name,
    phone,
    address: "Tezkor buyurtma (Telefon orqali aniqlanadi)",
    paymentMethod: "Qabul qilganda / Click",
    comment: "⚡ 1-bosishda tezkor xarid",
    itemsText,
    totalText: formatPrice(currentQuickBuyProduct.price),
    dateStr
  };

  const submitBtn = document.getElementById("quickBuySubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Yuborilmoqda...";
  }

  let isSuccess = false;
  const config = getTelegramConfig();

  // Avvalo /api/order orqali yuborishga harakat qilish
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (data.ok) isSuccess = true;
  } catch (err) {
    // Agar server bo'lmasa, to'g'ridan-to'g'ri Telegram API ga yuborish
    try {
      const fullText = `⚡ *TEZKOR 1-BOSISHDA BUYURTMA!*\n` +
        `🆔 ID: \`#${orderId}\`\n👤 Mijoz: ${name}\n📞 Tel: ${phone}\n📦 Mahsulot: ${currentQuickBuyProduct.name}\n💰 Narxi: ${formatPrice(currentQuickBuyProduct.price)}`;
      
      const tgRes = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: config.chatId, text: fullText, parse_mode: "Markdown" })
      });
      const tgData = await tgRes.json();
      if (tgData.ok) isSuccess = true;
    } catch (e2) {
      console.warn("Direct TG error:", e2);
    }
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "⚡ Tasdiqlash va Telegramga yuborish";
  }

  closeQuickBuyModal();
  form.reset();

  const msgText = `Mijoz: ${name}, Tel: ${phone}, Mahsulot: ${currentQuickBuyProduct.name}`;
  showOrderSuccessModal(orderId, name, phone, currentQuickBuyProduct.price, msgText, config, isSuccess);
}

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

// --- MODALLAR BOSHQARUVI ---
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
  closeWishlistModal();
  closeQuickBuyModal();
}

// --- TELEGRAMGA ZAKAZ YUBORISH ---
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
    showToast("Ism va telefon raqamingizni kiriting!", "warning");
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

  const orderPayload = {
    orderId,
    name,
    phone,
    address,
    paymentMethod,
    comment,
    itemsText,
    totalText: formatPrice(total),
    dateStr
  };

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

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Telegramga yuborilmoqda...";
  }

  const config = getTelegramConfig();
  let isSuccess = false;

  // 1-urinish: serverdagi /api/order orqali
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (data.ok) isSuccess = true;
  } catch (err) {
    // 2-urinish: bevosita telegram bot api ga mijozdan
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
      if (data.ok) isSuccess = true;
    } catch (e2) {
      console.error(e2);
    }
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "✅ Buyurtmani tasdiqlash";
  }

  closeCheckoutModal();
  clearCart();
  form.reset();

  showOrderSuccessModal(orderId, name, phone, total, messageText, config, isSuccess);
}

function showOrderSuccessModal(orderId, name, phone, total, messageText, config, isDirectSuccess) {
  const existing = document.getElementById("successOrderModal");
  if (existing) existing.remove();

  const encodedMsg = encodeURIComponent(messageText.replace(/\*/g, '').replace(/`/g, ''));
  const tgDirectLink = config.telegramUsername ? 
    `https://t.me/${config.telegramUsername}?text=${encodedMsg}` : 
    `https://t.me/share/url?url=&text=${encodedMsg}`;

  const modalHtml = `
    <div id="successOrderModal" class="modal-box open" style="display: flex;">
      <div class="modal-content success-content" style="padding: 24px; text-align: center;">
        <div class="success-icon" style="font-size: 48px; margin-bottom: 12px;">🎉</div>
        <h2>Buyurtmangiz qabul qilindi!</h2>
        <p class="order-number" style="margin: 8px 0;">Buyurtma raqami: <strong>#${orderId}</strong></p>
        <p class="success-desc" style="color: #666; font-size: 14px; margin-bottom: 16px;">
          Rahmat, <strong>${name}</strong>! Buyurtmangiz qayd etildi. 
          Tez orada operatorimiz <strong>${phone}</strong> raqamiga aloqaga chiqadi.
        </p>
        <div class="success-total-box" style="font-size: 18px; font-weight: 800; color: var(--primary-red); margin-bottom: 18px;">
          Jami summa: <span>${formatPrice(total)}</span>
        </div>
        ${isDirectSuccess ? 
          `<div style="background:#e6f9ed; color:#1b7a43; padding:8px 14px; border-radius:8px; font-size:13px; margin-bottom:16px;">✅ Telegram botimizga buyurtma yuborildi!</div>` : 
          `<div style="background:#fff8e6; color:#a36a00; padding:8px 14px; border-radius:8px; font-size:13px; margin-bottom:16px;">ℹ️ Buyurtmani qo'shimcha ravishda Telegramda ham tasdiqlashingiz mumkin:</div>`
        }
        <div style="display:flex; flex-direction:column; gap:10px;">
          <a href="${tgDirectLink}" target="_blank" class="btn-pill-red" style="padding:12px 20px;">
            ✈️ Telegram orqali ham yuborish
          </a>
          <button class="btn btn-secondary" onclick="closeSuccessOrderModal()" style="background:#eee; border:none; padding:10px; border-radius:var(--radius-pill); cursor:pointer;">
            Yopish
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
    resultsContainer.innerHTML = `<div class="search-hint" style="color:#888; text-align:center; padding:20px;">Mahsulot nomini yoki toifasini yozing...</div>`;
    return;
  }

  const matched = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) || 
    p.categoryName.toLowerCase().includes(q)
  );

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<div class="search-empty" style="color:#888; text-align:center; padding:20px;">🔍 "${query}" bo'yicha hech narsa topilmadi.</div>`;
    return;
  }

  let html = "";
  matched.forEach(item => {
    html += `
      <div class="search-result-row" onclick="window.location.href='${item.url}'" style="display:flex; align-items:center; gap:12px; padding:10px; cursor:pointer; border-bottom:1px solid var(--border-light);">
        <img src="${item.image}" alt="${item.name}" style="width:45px; height:45px; object-fit:contain; border-radius:6px;">
        <div style="flex:1;">
          <h4 style="font-size:14px; margin:0;">${item.name}</h4>
          <span style="font-size:12px; color:#888;">${item.categoryName}</span> • <span style="font-size:13px; font-weight:800; color:var(--primary-red);">${formatPrice(item.price)}</span>
        </div>
        <button class="btn btn-sm" onclick="event.stopPropagation(); addToCart(${item.id});" style="background:var(--primary-red); color:#fff; border:none; border-radius:var(--radius-pill); padding:5px 12px; font-size:12px; cursor:pointer;">Savatga</button>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}

// --- SHARHLAR TIZIMI (REVIEWS SYSTEM) ---
function getProductReviews(productId) {
  const key = `ozodbek_reviews_${productId}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return [
    { author: "Jasurbek K.", date: "12 Noyabr, 2026", rating: 5, text: "Juda ajoyib san'at asari! Qo'l mehnati juda puxta qilingan, xonamga juda yarashdi." },
    { author: "Malika O.", date: "5 Noyabr, 2026", rating: 5, text: "Sovg'a uchun olgan edim, do'stim juda xursand bo'ldi. Sifati a'lo darajada!" }
  ];
}

function addProductReview(productId, author, rating, text) {
  const reviews = getProductReviews(productId);
  const now = new Date();
  const dateStr = now.toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long', year: 'numeric' });
  
  reviews.unshift({ author, date: dateStr, rating, text });
  localStorage.setItem(`ozodbek_reviews_${productId}`, JSON.stringify(reviews));
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

  setTimeout(() => { toast.classList.add("show"); }, 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- MAHSULOTLARNI RENDER QILISH (BEST SELLERS & SHOP) ---
function renderBestSellers(targetId = "bestSellersGrid") {
  const grid = document.getElementById(targetId);
  if (!grid) return;

  let html = "";
  PRODUCTS.forEach(p => {
    const isFav = isInWishlist(p.id);
    html += `
      <div class="product-card" data-category="${p.category}">
        <div class="card-media">
          ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase().includes('sale') ? 'sale' : 'hot'}">${p.badge}</span>` : ''}
          <a href="${p.url}" class="card-img-link">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
          </a>
          <div class="card-overlay-actions">
            <button onclick="toggleWishlist(${p.id})" title="Sevimlilarga qo'shish" class="overlay-btn btn-wishlist btn-wishlist-${p.id} ${isFav ? 'active' : ''}">${isFav ? '❤️' : '🤍'}</button>
            <button onclick="openQuickBuyModal(${p.id})" title="1 bosishda tezkor xarid" class="overlay-btn btn-quick">⚡</button>
            <button onclick="addToCart(${p.id})" title="Savatga qo'shish" class="overlay-btn btn-cart">🛒</button>
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
  initTheme();
  loadCart();
  loadWishlist();
  renderBestSellers();

  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeAllModals);
  }

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  const quickBuyForm = document.getElementById("quickBuyForm");
  if (quickBuyForm) {
    quickBuyForm.addEventListener("submit", handleQuickBuySubmit);
  }

  const searchInput = document.getElementById("searchInputModal");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearchInput(e.target.value));
  }

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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
});
