// Eenvoudige kiosk-app voor Happy Herbivore

const AppState = {
  currentScreen: "splash",
  selectedLanguage: "nl",
  orderType: null, // "here" | "takeaway"
  cart: [], // { productId, quantity }
  lastOrderNumber: 0,
  resetTimerId: null,
};

// Afbeeldingen voor het splash-screen (pas paden aan naar jouw bestanden)
const splashImages = [
  "assets/images/DALLE_2025-01-22_16.00.35_-_A_photorealistic_depiction_of_a_smoothie_called_Green_Glow_Smoothie._The_drink_is_served_in_a_clear_glass_showcasing_its_vibrant_green_color_made_ (1).webp",
  "assets/images/Gemini_Generated_Image_5aqrk45aqrk45aqr.webp",
  "assets/images/Gemini_Generated_Image_gvlyv5gvlyv5gvly.webp",
  "assets/images/Gemini_Generated_Image_p1ej7kp1ej7kp1ej.webp",
];

const SplashSlideshow = {
  currentIndex: 0,
  activeLayer: 0,
  intervalId: null,
};

const translations = {
  nl: {
    tapToOrder: "Tik om te bestellen",
    welcome: "welkom",
    orderHere: "bestel hier",
    chooseLanguage: "Kies een taal",
    eatHere: "Hier eten",
    takeAway: "Meenemen",
    categoryTitle: "Kies je favoriet",
    cartButtonLabel: "Winkelwagen",
    cartTitle_zero: "Geen items in uw winkelwagen",
    cartTitle_one: "1 item in uw winkelwagen",
    cartTitle_other: "{count} items in uw winkelwagen",
    continueShopping: "Verder winkelen",
    completeOrder: "Bestelling afronden",
    thankYou: "Bedankt voor uw bestelling",
    yourOrderNumber: "Je ordernummer:",
    // Categorieën
    catBreakfast: "ontbijt",
    catLunch: "lunch",
    catHandheld: "hand held",
    catSides: "sides",
    catDips: "dips",
    catDrinks: "drankjes",
    // Producten
    prodGreenSmoothie: "Groene smoothie",
    prodOvernightOats: "Overnight oats",
    prodChiaParfait: "Chia parfait",
    prodBuddhaBowl: "Buddha bowl",
    prodFalafelWrap: "Falafel wrap",
    prodQuinoaSalad: "Quinoa salade",
    prodBeanBurger: "Bonenburger",
    prodJackfruitTaco: "Jackfruit taco",
    prodSweetFries: "Zoete aardappel friet",
    prodHerbSlaw: "Herbivore slaw",
    prodGuacamoleDip: "Guacamole dip",
    prodHummusDip: "Hummus dip",
    prodBerrySmoothie: "Berry smoothie",
    prodIcedTea: "Iced tea",
    prodInfusedWater: "Infused water",
  },
  de: {
    tapToOrder: "Zum Bestellen tippen",
    welcome: "willkommen",
    orderHere: "hier bestellen",
    chooseLanguage: "Sprache wählen",
    eatHere: "Hier essen",
    takeAway: "Mitnehmen",
    categoryTitle: "Wähle dein Lieblingsgericht",
    cartButtonLabel: "Warenkorb",
    cartTitle_zero: "Keine Artikel im Warenkorb",
    cartTitle_one: "1 Artikel im Warenkorb",
    cartTitle_other: "{count} Artikel im Warenkorb",
    continueShopping: "Weiter einkaufen",
    completeOrder: "Bestellung abschließen",
    thankYou: "Danke für deine Bestellung",
    yourOrderNumber: "Deine Bestellnummer:",
    // Categorieën (labels, productnamen kunnen NL blijven indien gewenst)
  },
  en: {
    tapToOrder: "Tap to order",
    welcome: "welcome",
    orderHere: "order here",
    chooseLanguage: "Choose a language",
    eatHere: "Eat here",
    takeAway: "Take away",
    categoryTitle: "Choose your favourite",
    cartButtonLabel: "Cart",
    cartTitle_zero: "No items in your cart",
    cartTitle_one: "1 item in your cart",
    cartTitle_other: "{count} items in your cart",
    continueShopping: "Continue shopping",
    completeOrder: "Complete order",
    thankYou: "Thank you for your order",
    yourOrderNumber: "Your order number:",
  },
};

function getTranslation(key, options = {}) {
  const lang = AppState.selectedLanguage || "nl";
  const dict = translations[lang] || translations.nl;
  let value = dict[key] || translations.nl[key] || "";
  if (!value) return "";

  if (typeof options.count === "number") {
    const count = options.count;
    const pluralKey =
      count === 0
        ? key + "_zero"
        : count === 1
        ? key + "_one"
        : key + "_other";
    const pluralValue = dict[pluralKey] || translations.nl[pluralKey];
    if (pluralValue) {
      value = pluralValue;
    }
    value = value.replace("{count}", String(count));
  }

  return value;
}

function applyTranslations() {
  const root = document;
  const nodes = root.querySelectorAll("[data-i18n-key]");
  nodes.forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    if (!key) return;
    const countAttr = el.getAttribute("data-i18n-count");
    const count = countAttr != null ? Number(countAttr) : undefined;
    const text = getTranslation(key, { count });
    if (text) {
      el.textContent = text;
    }
  });
}

function showScreen(screenId) {
  AppState.currentScreen = screenId;

  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    const isTarget = screen.getAttribute("data-screen") === screenId;
    screen.classList.toggle("screen--active", isTarget);
    screen.hidden = !isTarget;
  });

  if (screenId === "splash") {
    startSplashSlideshow();
  } else {
    stopSplashSlideshow();
  }
}

function setLanguage(lang) {
  if (!translations[lang]) {
    AppState.selectedLanguage = "nl";
  } else {
    AppState.selectedLanguage = lang;
  }
  applyTranslations();
  renderCategories();
  renderProductsForCategory(AppState.activeCategoryId || categories[0].id);
  updateCartUI();
}

function startOrder() {
  if (!AppState.selectedLanguage) {
    AppState.selectedLanguage = "nl";
  }
  clearConfirmationTimer();
  showScreen("welcome");
  applyTranslations();
}

function setOrderType(type) {
  AppState.orderType = type;
  if (!AppState.activeCategoryId && categories.length > 0) {
    AppState.activeCategoryId = categories[0].id;
  }
  showScreen("menu");
  renderCategories();
  renderProductsForCategory(AppState.activeCategoryId);
  updateCartUI();
}

function formatPrice(value) {
  return value.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}

function getProductById(productId) {
  for (const [catId, products] of Object.entries(productsByCategory)) {
    const product = products.find((p) => p.id === productId);
    if (product) return { ...product, categoryId: catId };
  }
  return null;
}

function addToCart(productId) {
  const existing = AppState.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({ productId, quantity: 1 });
  }
  updateCartUI();
}

function changeCartQuantity(productId, delta) {
  const item = AppState.cart.find((i) => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter((i) => i.productId !== productId);
  }
  updateCartUI();
}

function getCartItemCount() {
  return AppState.cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartUI() {
  const count = getCartItemCount();
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    badge.textContent = String(count);
  }

  const cartTitle = document.getElementById("cart-title");
  if (cartTitle) {
    cartTitle.setAttribute("data-i18n-count", String(count));
    // sleutel is cartTitle
    cartTitle.setAttribute("data-i18n-key", "cartTitle");
  }

  applyTranslations();
  renderCartItems();
}

function renderCategories() {
  const container = document.getElementById("category-list");
  if (!container) return;

  container.innerHTML = "";
  const activeId = AppState.activeCategoryId || (categories[0] && categories[0].id);

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.className =
      "category-tile" + (cat.id === activeId ? " category-tile--active" : "");
    button.setAttribute("data-category-id", cat.id);

    const img = document.createElement("img");
    img.src = cat.image;
    img.alt = "";
    img.className = "category-tile__image";

    const label = document.createElement("div");
    label.className = "category-tile__label";
    label.textContent = getTranslation(cat.labelKey) || cat.id;

    button.appendChild(img);
    button.appendChild(label);

    button.addEventListener("click", () => {
      AppState.activeCategoryId = cat.id;
      renderCategories();
      renderProductsForCategory(cat.id);
    });

    container.appendChild(button);
  });
}

function renderProductsForCategory(categoryId) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const products = productsByCategory[categoryId] || [];
  grid.innerHTML = "";

  products.forEach((product) => {
    const button = document.createElement("button");
    button.className = "product-tile";
    button.setAttribute("data-product-id", product.id);

    const nameEl = document.createElement("div");
    nameEl.className = "product-tile__name";
    nameEl.textContent =
      getTranslation(product.nameKey) || product.id.replace(/-/g, " ");

    const priceEl = document.createElement("div");
    priceEl.className = "product-tile__price";
    priceEl.textContent = formatPrice(product.price);

    button.appendChild(nameEl);
    button.appendChild(priceEl);

    button.addEventListener("click", () => {
      addToCart(product.id);
    });

    grid.appendChild(button);
  });
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  if (AppState.cart.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = getTranslation("cartTitle_zero");
    container.appendChild(empty);
    return;
  }

  AppState.cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    const nameEl = document.createElement("div");
    nameEl.className = "cart-item__name";
    nameEl.textContent =
      getTranslation(product.nameKey) || product.id.replace(/-/g, " ");

    const controls = document.createElement("div");
    controls.className = "cart-item__controls";

    const minusBtn = document.createElement("button");
    minusBtn.className = "cart-qty-btn";
    minusBtn.type = "button";
    minusBtn.textContent = "−";
    minusBtn.addEventListener("click", () => {
      changeCartQuantity(item.productId, -1);
    });

    const qtySpan = document.createElement("span");
    qtySpan.textContent = String(item.quantity);

    const plusBtn = document.createElement("button");
    plusBtn.className = "cart-qty-btn";
    plusBtn.type = "button";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
      changeCartQuantity(item.productId, 1);
    });

    controls.appendChild(minusBtn);
    controls.appendChild(qtySpan);
    controls.appendChild(plusBtn);

    const priceEl = document.createElement("div");
    priceEl.className = "cart-item__price";

    const lineTotal = product.price * item.quantity;
    priceEl.textContent = formatPrice(lineTotal);

    row.appendChild(nameEl);
    row.appendChild(controls);
    row.appendChild(priceEl);

    container.appendChild(row);
  });
}

function openCartScreen() {
  showScreen("cart");
  updateCartUI();
}

function generateOrderNumber() {
  AppState.lastOrderNumber += 1;
  if (AppState.lastOrderNumber > 999) {
    AppState.lastOrderNumber = 1;
  }
  return AppState.lastOrderNumber;
}

function checkout() {
  if (AppState.cart.length === 0) {
    // Geen bestelling, ga terug naar menu
    showScreen("menu");
    return;
  }

  const number = generateOrderNumber();
  AppState.cart = [];
  AppState.orderNumber = number;

  const orderNumberEl = document.getElementById("order-number");
  if (orderNumberEl) {
    orderNumberEl.textContent = String(number).padStart(2, "0");
  }

  updateCartUI();
  showScreen("confirmation");
  applyTranslations();
  scheduleResetToSplash();
}

function resetToSplash() {
  AppState.orderType = null;
  AppState.cart = [];
  AppState.orderNumber = null;
  AppState.activeCategoryId = categories[0] ? categories[0].id : null;
  clearConfirmationTimer();
  showScreen("splash");
  applyTranslations();
}

function scheduleResetToSplash() {
  clearConfirmationTimer();
  AppState.resetTimerId = window.setTimeout(() => {
    resetToSplash();
  }, 8000);
}

function clearConfirmationTimer() {
  if (AppState.resetTimerId != null) {
    clearTimeout(AppState.resetTimerId);
    AppState.resetTimerId = null;
  }
}

function startSplashSlideshow() {
  if (!splashImages || splashImages.length === 0) return;

  const layer1 = document.getElementById("splash-bg-1");
  const layer2 = document.getElementById("splash-bg-2");
  if (!layer1 || !layer2) return;

  if (SplashSlideshow.intervalId != null) {
    return;
  }

  SplashSlideshow.currentIndex = 0;
  SplashSlideshow.activeLayer = 0;

  layer1.style.backgroundImage = `url("${splashImages[0]}")`;
  layer1.classList.add("is-visible");

  if (splashImages.length > 1) {
    layer2.style.backgroundImage = `url("${splashImages[1]}")`;
  }

  SplashSlideshow.intervalId = window.setInterval(() => {
    if (!splashImages || splashImages.length === 0) return;

    const nextIndex =
      (SplashSlideshow.currentIndex + 1) % splashImages.length;
    const activeEl = SplashSlideshow.activeLayer === 0 ? layer1 : layer2;
    const inactiveEl = SplashSlideshow.activeLayer === 0 ? layer2 : layer1;

    inactiveEl.style.backgroundImage = `url("${splashImages[nextIndex]}")`;
    inactiveEl.classList.add("is-visible");
    activeEl.classList.remove("is-visible");

    SplashSlideshow.currentIndex = nextIndex;
    SplashSlideshow.activeLayer = SplashSlideshow.activeLayer === 0 ? 1 : 0;
  }, 7000);
}

function stopSplashSlideshow() {
  if (SplashSlideshow.intervalId != null) {
    clearInterval(SplashSlideshow.intervalId);
    SplashSlideshow.intervalId = null;
  }
}

function attachGlobalHandlers() {
  const splashButton = document.querySelector(
    '[data-action="start-order"]'
  );
  if (splashButton) {
    splashButton.addEventListener("click", startOrder);
  }

  document.querySelectorAll("[data-order-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-order-type");
      setOrderType(type);
    });
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  const openCartBtn = document.querySelector('[data-action="open-cart"]');
  if (openCartBtn) {
    openCartBtn.addEventListener("click", openCartScreen);
  }

  const backToMenuBtn = document.querySelector(
    '[data-action="back-to-menu"]'
  );
  if (backToMenuBtn) {
    backToMenuBtn.addEventListener("click", () => {
      showScreen("menu");
    });
  }

  const checkoutBtn = document.querySelector('[data-action="checkout"]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
}

function initApp() {
  AppState.selectedLanguage = "nl";
  AppState.activeCategoryId = categories[0] ? categories[0].id : null;
  attachGlobalHandlers();
  applyTranslations();
  renderCategories();
  renderProductsForCategory(AppState.activeCategoryId);
  updateCartUI();
  showScreen("splash");
}

document.addEventListener("DOMContentLoaded", initApp);

