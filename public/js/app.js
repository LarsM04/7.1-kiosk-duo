// Eenvoudige kiosk-app voor Happy Herbivore

let categories = [];
let productsByCategory = {};

const AppState = {
  currentScreen: "splash",
  selectedLanguage: "nl",
  orderType: null, // "here" | "takeaway"
  cart: [], // { productId, quantity }
  lastOrderNumber: 0,
  resetTimerId: null,
  recommendedPopupShown: false, // Track if recommended popup has been shown
};

// Afbeeldingen voor het splash-screen (pas paden aan naar jouw bestanden)
const splashImages = [
  "assets/images/Gemini_Generated_Image_p1ej7kp1ej7kp1ej.webp",
  "assets/images/Gemini_Generated_Image_5aqrk45aqrk45aqr.webp",
  "assets/images/Gemini_Generated_Image_gvlyv5gvlyv5gvly.webp",
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
    howToOrder: "Hoe wil je bestellen?",
    eatHere: "Hier eten",
    eatHereSub: "Aan tafel",
    takeAway: "Meenemen",
    takeAwaySub: "Om mee te nemen",
    categoryTitle: "Kies je favoriet",
    cartButtonLabel: "Winkelwagen",
    cartTitle: "{count} items in uw winkelwagen",
    cartTitle_zero: "Geen items in uw winkelwagen",
    cartTitle_one: "1 item in uw winkelwagen",
    cartTitle_other: "{count} items in uw winkelwagen",
    continueShopping: "Verder winkelen",
    completeOrder: "Bestelling afronden",
    thankYou: "Bedankt voor uw bestelling!",
    yourOrderNumber: "Bestelnummer:",
    receiptDate: "Datum:",
    receiptTime: "Tijd:",
    receiptOrderType: "Type:",
    receiptOrderTypeHere: "Hier eten",
    receiptOrderTypeTakeaway: "Meenemen",
    receiptItem: "Artikel",
    receiptQty: "Aantal",
    receiptPrice: "Prijs",
    receiptSubtotal: "Subtotaal",
    receiptVat: "BTW (9%)",
    receiptTotal: "TOTAAL",
    receiptSub: "Uw bestelling wordt zo snel mogelijk bereid.",
    receiptCountdown: "Scherm sluit automatisch",
    modalAddToCart: "Toevoegen",
    modalKcal: "kcal",
    // Beschrijvingen
    descAcaiBowl: "Een gekoelde mix van açaí en banaan met krokante granola, chiazaden en kokos.",
    descGardenWrap: "Volkorenwrap met luchtige roereieren, babyspinazie en een lichte yoghurt-kruidensaus.",
    descPBCacaoToast: "Zuurdesemtoast met 100% natuurlijke pindakaas, banaan en een snufje cacaonibs.",
    descOvernightOats: "Havermout geweekt in amandelmelk met geraspte appel, kaneel en gehakte walnoten.",
    descTofuTahiniBowl: "Driekleurige quinoa, esdoorngeglazuurde tofu, geroosterde zoete aardappelen en boerenkool met tahindressing.",
    descSupergreenHarvest: "Gemasseerde boerenkool, edamame, avocado, komkommer en geroosterde pompoenpitten met citroen-olijfolie.",
    descFalafelBowl: "Gebakken falafel, hummus, ingelegde rode ui, kerstomaatjes en komkommer op een bedje van groenten.",
    descTeriyakiTempeh: "Gestoomde bruine rijst, aangebakken tempeh, broccoli en geraspte wortels met gember-sojasaus.",
    descChickpeaWrap: "Gekruide kikkererwten, geraspte wortels, knapperige sla en huishummus in een volkorenwrap.",
    descHalloumiToastie: "Gegrilde halloumi, fijngestampte avocado en chilivlokken op dik meergranenbrood.",
    descJackfruitSlider: "Pulled jackfruit in BBQ-saus met knapperige paarse koolsalade op een veganistisch briochebroodje.",
    descSweetPotatoWedges: "Gekruid met gerookte paprika. (Best met Avocado Limoen Dip).",
    descZucchiniFries: "Knapperige gepaneerde courgettesticks. (Best met Griekse Yoghurt Ranch).",
    descFalafelBites: "Heerlijk gekruide en ovengebakken kikkererwtenballetjes.",
    descVeggiePlatter: "Vers en knapperig: selderij, wortels en komkommer.",
    descClassicHummus: "Romige traditionele kikkererwtenhummus.",
    descAvocadoLime: "Pittige en gladde avocadodip.",
    descGreekRanch: "Een lichte en pittige yoghurtdip met kruiden.",
    descSrirachaMayo: "Een veganaise met een pittige kick.",
    descPeanutSatay: "Rijke en nootachtige saus met een vleugje kruiden.",
    descGreenGlow: "Spinazie, ananas, komkommer en kokoswater.",
    descIcedMatcha: "Licht gezoete matcha groene thee met amandelmelk.",
    descInfusedWater: "Vers geïnfuseerd water naar keuze: citroen-munt, aardbei-basilicum of komkommer-limoen.",
    descBerryBlast: "Een romige mix van aardbeien, bosbessen en frambozen met amandelmelk.",
    descCitrusCooler: "Een verfrissende mix van sinaasappelsap, bruisend water en een vleugje limoen.",
    // Categorieën
    catBreakfast: "ontbijt",
    catLunch: "lunch",
    catHandheld: "hand held",
    catSides: "sides",
    catDips: "dips",
    catDrinks: "drankjes",
    // Producten
    prodAcaiBowl: "Morning Boost Açaí Bowl",
    prodGardenWrap: "Tuin-ontbijtwrap",
    prodPBCacaoToast: "Pindakaas & Cacao Toast",
    prodOvernightOats: "Overnight Oats: Appeltaart Stijl",
    prodTofuTahiniBowl: "Tofu Power Tahini Bowl",
    prodSupergreenHarvest: "Supergreen Oogst",
    prodFalafelBowl: "Mediterrane Falafel Bowl",
    prodTeriyakiTempeh: "Warme Teriyaki Tempeh Bowl",
    prodChickpeaWrap: "Pittige Kikkererwten Hummus Wrap",
    prodHalloumiToastie: "Avocado & Halloumi Toastie",
    prodJackfruitSlider: "Rokerige BBQ Jackfruit Slider",
    prodSweetPotatoWedges: "Ovengebakken Zoete Aardappel Partjes",
    prodZucchiniFries: "Courgette Frietjes",
    prodFalafelBites: "Gebakken Falafel Hapjes - 5 stuks",
    prodVeggiePlatter: "Mini Groenteschotel & Hummus",
    prodClassicHummus: "Klassieke Hummus",
    prodAvocadoLime: "Avocado Limoen Crema",
    prodGreekRanch: "Griekse Yoghurt Ranch",
    prodSrirachaMayo: "Pittige Sriracha Mayo",
    prodPeanutSatay: "Pindakaas Satésaus",
    prodGreenGlow: "Green Glow Smoothie",
    prodIcedMatcha: "Ijskoude Matcha Latte",
    prodInfusedWater: "Fruitwater",
    prodBerryBlast: "Berry Blast Smoothie",
    prodCitrusCooler: "Citrus Koeling",
    // Recommended product popup
    recommendedTitle: "Wil je er nog iets bij bestellen?",
    recommendedSubtitle: "Voeg dit heerlijke product toe aan je bestelling!",
    recommendedAdd: "Toevoegen",
    recommendedSkip: "Nee, bedankt",
  },
  de: {
    tapToOrder: "Zum Bestellen tippen",
    welcome: "willkommen",
    orderHere: "hier bestellen",
    chooseLanguage: "Sprache wählen",
    howToOrder: "Wie möchtest du bestellen?",
    eatHere: "Hier essen",
    eatHereSub: "Am Tisch",
    takeAway: "Mitnehmen",
    takeAwaySub: "Zum Mitnehmen",
    categoryTitle: "Wähle dein Lieblingsgericht",
    cartButtonLabel: "Warenkorb",
    cartTitle: "{count} Artikel im Warenkorb",
    cartTitle_zero: "Keine Artikel im Warenkorb",
    cartTitle_one: "1 Artikel im Warenkorb",
    cartTitle_other: "{count} Artikel im Warenkorb",
    continueShopping: "Weiter einkaufen",
    completeOrder: "Bestellung abschließen",
    thankYou: "Danke für Ihre Bestellung!",
    yourOrderNumber: "Bestellnummer:",
    receiptDate: "Datum:",
    receiptTime: "Uhrzeit:",
    receiptOrderType: "Typ:",
    receiptOrderTypeHere: "Hier essen",
    receiptOrderTypeTakeaway: "Mitnehmen",
    receiptItem: "Artikel",
    receiptQty: "Menge",
    receiptPrice: "Preis",
    receiptSubtotal: "Zwischensumme",
    receiptVat: "MwSt. (9%)",
    receiptTotal: "GESAMT",
    receiptSub: "Ihre Bestellung wird so schnell wie möglich zubereitet.",
    receiptCountdown: "Bildschirm schließt automatisch",
    modalAddToCart: "Hinzufügen",
    modalKcal: "kcal",
    // Beschreibungen
    descAcaiBowl: "Eine gekühlte Mischung aus Açaí und Banane mit knusprigem Granola, Chiasamen und Kokosnuss.",
    descGardenWrap: "Vollkornwrap mit fluffigem Rührei, Babyspinat und einer leichten Joghurt-Kräuter-Sauce.",
    descPBCacaoToast: "Sauerteigtoast mit 100% natürlicher Erdnussbutter, Banane und einem Hauch Kakaonibs.",
    descOvernightOats: "Haferflocken in Mandelmilch mit geriebenem Apfel, Zimt und gehackten Walnüssen.",
    descTofuTahiniBowl: "Dreifarbige Quinoa, Ahornsirup-glasierter Tofu, geröstete Süßkartoffeln und Grünkohl mit Tahini-Dressing.",
    descSupergreenHarvest: "Massierter Grünkohl, Edamame, Avocado, Gurke und geröstete Kürbiskerne mit Zitronen-Olivenöl.",
    descFalafelBowl: "Gebackene Falafel, Hummus, eingelegte rote Zwiebeln, Kirschtomaten und Gurke auf einem Bett aus Grünem.",
    descTeriyakiTempeh: "Gedämpfter brauner Reis, angebratener Tempeh, Brokkoli und geraspelte Möhren mit Ingwer-Soja-Glasur.",
    descChickpeaWrap: "Gewürzte Kichererbsen, geraspelte Möhren, knackiger Salat und Haushummus in einem Vollkornwrap.",
    descHalloumiToastie: "Gegrillter Halloumi-Käse, gestampfte Avocado und Chiliflocken auf dickem Mehrkornbrot.",
    descJackfruitSlider: "Gezupfter Jackfruit in BBQ-Sauce mit knackigem lila Krautsalat auf einem veganen Briochebrötchen.",
    descSweetPotatoWedges: "Gewürzt mit geräuchertem Paprika. (Am besten mit Avocado-Limetten-Dip).",
    descZucchiniFries: "Knusprige panierte Zucchini-Sticks. (Am besten mit Griechischem Joghurt Ranch).",
    descFalafelBites: "Köstlich gewürzte und ofengebackene Kichererbsen-Häppchen.",
    descVeggiePlatter: "Frische Knackigkeit: Sellerie, Möhren und Gurke.",
    descClassicHummus: "Cremiger traditioneller Kichererbsendip.",
    descAvocadoLime: "Pikanter und cremiger Avocado-Dip.",
    descGreekRanch: "Ein leichter und würziger Kräuter-Joghurt-Dip.",
    descSrirachaMayo: "Eine vegane Mayo mit einem scharfen Kick.",
    descPeanutSatay: "Reichhaltige und nussige Sauce mit einem Hauch Gewürze.",
    descGreenGlow: "Spinat, Ananas, Gurke und Kokoswasser.",
    descIcedMatcha: "Leicht gesüßter Matcha-Grüntee mit Mandelmilch.",
    descInfusedWater: "Frisch infusiertes Wasser nach Wahl: Zitronen-Minze, Erdbeere-Basilikum oder Gurke-Limette.",
    descBerryBlast: "Eine cremige Mischung aus Erdbeeren, Heidelbeeren und Himbeeren mit Mandelmilch.",
    descCitrusCooler: "Eine erfrischende Mischung aus Orangensaft, Sprudel und einem Hauch Limette.",
    // Kategorien
    catBreakfast: "Frühstück",
    catLunch: "Mittagessen",
    catHandheld: "Handhelds",
    catSides: "Beilagen",
    catDips: "Dips",
    catDrinks: "Getränke",
    // Produkte
    prodAcaiBowl: "Morning Boost Açaí Bowl",
    prodGardenWrap: "Garten-Frühstückswrap",
    prodPBCacaoToast: "Erdnussbutter & Kakao Toast",
    prodOvernightOats: "Overnight Oats: Apfelkuchen Art",
    prodTofuTahiniBowl: "Tofu-Power-Tahini-Bowl",
    prodSupergreenHarvest: "Supergrüne Ernte",
    prodFalafelBowl: "Mediterraner Falafel-Bowl",
    prodTeriyakiTempeh: "Warme Teriyaki-Tempeh-Bowl",
    prodChickpeaWrap: "Würziger Kichererbsen-Hummus-Wrap",
    prodHalloumiToastie: "Avocado & Halloumi Toastie",
    prodJackfruitSlider: "Rauchiger BBQ-Jackfruit-Slider",
    prodSweetPotatoWedges: "Ofengebratene Süßkartoffel-Spalten",
    prodZucchiniFries: "Zucchini-Pommes",
    prodFalafelBites: "Gebackene Falafel-Häppchen - 5 Stück",
    prodVeggiePlatter: "Mini-Gemüseplatte & Hummus",
    prodClassicHummus: "Klassischer Hummus",
    prodAvocadoLime: "Avocado-Limetten-Crema",
    prodGreekRanch: "Griechischer Joghurt Ranch",
    prodSrirachaMayo: "Scharfe Sriracha-Mayo",
    prodPeanutSatay: "Erdnuss-Satay-Soße",
    prodGreenGlow: "Green Glow Smoothie",
    prodIcedMatcha: "Eisgekühlter Matcha Latte",
    prodInfusedWater: "Fruchtinfusiertes Wasser",
    prodBerryBlast: "Berry Blast Smoothie",
    prodCitrusCooler: "Zitrus-Kühler",
    // Recommended product popup
    recommendedTitle: "Möchtest du noch etwas bestellen?",
    recommendedSubtitle: "Fügen Sie dieses köstliche Produkt zu Ihrer Bestellung hinzu!",
    recommendedAdd: "Hinzufügen",
    recommendedSkip: "Nein, danke",
  },
  en: {
    tapToOrder: "Tap to order",
    welcome: "welcome",
    orderHere: "order here",
    chooseLanguage: "Choose a language",
    howToOrder: "How would you like to order?",
    eatHere: "Eat here",
    eatHereSub: "At the table",
    takeAway: "Take away",
    takeAwaySub: "To take away",
    categoryTitle: "Choose your favourite",
    cartButtonLabel: "Cart",
    cartTitle: "{count} items in your cart",
    cartTitle_zero: "No items in your cart",
    cartTitle_one: "1 item in your cart",
    cartTitle_other: "{count} items in your cart",
    continueShopping: "Continue shopping",
    completeOrder: "Complete order",
    thankYou: "Thank you for your order!",
    yourOrderNumber: "Order number:",
    receiptDate: "Date:",
    receiptTime: "Time:",
    receiptOrderType: "Type:",
    receiptOrderTypeHere: "Eat here",
    receiptOrderTypeTakeaway: "Take away",
    receiptItem: "Item",
    receiptQty: "Qty",
    receiptPrice: "Price",
    receiptSubtotal: "Subtotal",
    receiptVat: "VAT (9%)",
    receiptTotal: "TOTAL",
    receiptSub: "Your order will be prepared as soon as possible.",
    receiptCountdown: "Screen closes automatically",
    modalAddToCart: "Add to cart",
    modalKcal: "kcal",
    // Descriptions
    descAcaiBowl: "A chilled blend of açaí and banana topped with crunchy granola, chia seeds, and coconut.",
    descGardenWrap: "Whole-grain wrap with fluffy scrambled eggs, baby spinach, and a light yogurt-herb sauce.",
    descPBCacaoToast: "Sourdough toast with 100% natural peanut butter, banana, and a sprinkle of cacao nibs.",
    descOvernightOats: "Oats soaked in almond milk with grated apple, cinnamon, and crushed walnuts.",
    descTofuTahiniBowl: "Tri-color quinoa, maple-glazed tofu, roasted sweet potatoes, and kale with tahini dressing.",
    descSupergreenHarvest: "Massaged kale, edamame, avocado, cucumber, and toasted pumpkin seeds with lemon-olive oil.",
    descFalafelBowl: "Baked falafel, hummus, pickled red onions, cherry tomatoes, and cucumber on a bed of greens.",
    descTeriyakiTempeh: "Steamed brown rice, seared tempeh, broccoli, and shredded carrots with a ginger-soy glaze.",
    descChickpeaWrap: "Spiced chickpeas, shredded carrots, crisp lettuce, and signature hummus in a whole-wheat wrap.",
    descHalloumiToastie: "Grilled halloumi cheese, smashed avocado, and chili flakes on thick-cut multi-grain bread.",
    descJackfruitSlider: "Pulled jackfruit in BBQ sauce with a crunchy purple slaw on a vegan brioche bun.",
    descSweetPotatoWedges: "Seasoned with smoked paprika. (Best with Avocado Lime Dip).",
    descZucchiniFries: "Crispy breaded zucchini sticks. (Best with Greek Yogurt Ranch).",
    descFalafelBites: "Deliciously spiced and oven-baked chickpea bites.",
    descVeggiePlatter: "Fresh crunch: Celery, carrots, and cucumber.",
    descClassicHummus: "Creamy traditional chickpea dip.",
    descAvocadoLime: "Zesty and smooth avocado-based dip.",
    descGreekRanch: "A light and tangy herb-infused yogurt dip.",
    descSrirachaMayo: "A vegan mayo with a spicy kick.",
    descPeanutSatay: "Rich and nutty sauce with a hint of spice.",
    descGreenGlow: "Spinach, pineapple, cucumber, and coconut water.",
    descIcedMatcha: "Lightly sweetened matcha green tea with almond milk.",
    descInfusedWater: "Freshly infused water with a choice of lemon-mint, strawberry-basil, or cucumber-lime.",
    descBerryBlast: "A creamy blend of strawberries, blueberries, and raspberries with almond milk.",
    descCitrusCooler: "A refreshing mix of orange juice, sparkling water, and a hint of lime.",
    // Categories
    catBreakfast: "breakfast",
    catLunch: "lunch",
    catHandheld: "handhelds",
    catSides: "sides",
    catDips: "dips",
    catDrinks: "drinks",
    // Products
    prodAcaiBowl: "Morning Boost Açaí Bowl",
    prodGardenWrap: "The Garden Breakfast Wrap",
    prodPBCacaoToast: "Peanut Butter & Cacao Toast",
    prodOvernightOats: "Overnight Oats: Apple Pie Style",
    prodTofuTahiniBowl: "Tofu Power Tahini Bowl",
    prodSupergreenHarvest: "The Supergreen Harvest",
    prodFalafelBowl: "Mediterranean Falafel Bowl",
    prodTeriyakiTempeh: "Warm Teriyaki Tempeh Bowl",
    prodChickpeaWrap: "Zesty Chickpea Hummus Wrap",
    prodHalloumiToastie: "Avocado & Halloumi Toastie",
    prodJackfruitSlider: "Smoky BBQ Jackfruit Slider",
    prodSweetPotatoWedges: "Oven-Baked Sweet Potato Wedges",
    prodZucchiniFries: "Zucchini Fries",
    prodFalafelBites: "Baked Falafel Bites - 5pcs",
    prodVeggiePlatter: "Mini Veggie Platter & Hummus",
    prodClassicHummus: "Classic Hummus",
    prodAvocadoLime: "Avocado Lime Crema",
    prodGreekRanch: "Greek Yogurt Ranch",
    prodSrirachaMayo: "Spicy Sriracha Mayo",
    prodPeanutSatay: "Peanut Satay Sauce",
    prodGreenGlow: "Green Glow Smoothie",
    prodIcedMatcha: "Iced Matcha Latte",
    prodInfusedWater: "Fruit-Infused Water",
    prodBerryBlast: "Berry Blast Smoothie",
    prodCitrusCooler: "Citrus Cooler",
    // Recommended product popup
    recommendedTitle: "Would you like to add something else?",
    recommendedSubtitle: "Add this delicious product to your order!",
    recommendedAdd: "Add",
    recommendedSkip: "No, thanks",
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

  const splashEl = document.querySelector('[data-screen="splash"]');
  const nextId = "welcome";
  const nextEl = document.querySelector(`[data-screen="${nextId}"]`);

  if (!splashEl || !nextEl) {
    showScreen(nextId);
    applyTranslations();
    return;
  }

  const DURATION = 550; // must match CSS animation duration in ms

  // Prepare next screen: visible but behind, no pointer events yet
  nextEl.style.display = "flex";
  nextEl.style.opacity = "0";
  nextEl.hidden = false;
  nextEl.classList.add("screen--entering");

  // Animate splash out
  splashEl.classList.add("screen--leaving");

  setTimeout(() => {
    // Clean up splash
    splashEl.classList.remove("screen--active", "screen--leaving");
    splashEl.style.display = "";
    splashEl.hidden = true;

    // Clean up next screen
    nextEl.classList.remove("screen--entering");
    nextEl.style.opacity = "";
    nextEl.classList.add("screen--active");

    AppState.currentScreen = nextId;
    stopSplashSlideshow();
    applyTranslations();
  }, DURATION);
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

    if (cat.image) {
      const img = document.createElement("img");
      img.src = cat.image;
      img.alt = "";
      img.className = "category-tile__image";
      button.appendChild(img);
    }

    const label = document.createElement("div");
    label.className = "category-tile__label";
    label.textContent = getTranslation(cat.labelKey) || cat.name || cat.id;

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

    if (product.image) {
      const imgEl = document.createElement("img");
      imgEl.src = product.image;
      imgEl.alt = product.name || "";
      imgEl.className = "product-tile__image";
      imgEl.loading = "lazy";
      button.appendChild(imgEl);
    }

    const nameEl = document.createElement("div");
    nameEl.className = "product-tile__name";
    nameEl.textContent =
      getTranslation(product.nameKey) || product.name || product.id.replace(/-/g, " ");

    const priceEl = document.createElement("div");
    priceEl.className = "product-tile__price";
    priceEl.textContent = formatPrice(product.price);

    button.appendChild(nameEl);
    button.appendChild(priceEl);

    button.addEventListener("click", () => {
      openProductModal(product);
    });

    grid.appendChild(button);
  });
}

function openProductModal(product) {
  // Remove any existing modal
  closeProductModal();

  let modalQty = 1;

  const modal = document.createElement("div");
  modal.className = "product-modal";
  modal.id = "product-modal";

  const backdrop = document.createElement("div");
  backdrop.className = "product-modal-backdrop";
  backdrop.addEventListener("click", closeProductModal);
  modal.appendChild(backdrop);

  const dialog = document.createElement("div");
  dialog.className = "product-modal-dialog";

  // Image
  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name || "";
    img.className = "product-modal-image";
    dialog.appendChild(img);
  }

  // Content wrapper
  const content = document.createElement("div");
  content.className = "product-modal-content";

  // Header (name + close)
  const header = document.createElement("div");
  header.className = "product-modal-header";

  const nameEl = document.createElement("div");
  nameEl.className = "product-modal-name";
  nameEl.textContent =
    getTranslation(product.nameKey) || product.name || product.id.replace(/-/g, " ");
  header.appendChild(nameEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = "product-modal-close";
  closeBtn.type = "button";
  closeBtn.textContent = "\u00d7";
  closeBtn.addEventListener("click", closeProductModal);
  header.appendChild(closeBtn);

  content.appendChild(header);

  // Body (description + kcal)
  const body = document.createElement("div");
  body.className = "product-modal-body";

  const translatedDesc = (product.descKey && getTranslation(product.descKey)) || product.description;
  if (translatedDesc) {
    const descEl = document.createElement("div");
    descEl.className = "product-modal-description";
    descEl.textContent = translatedDesc;
    body.appendChild(descEl);
  }

  if (product.kcal != null) {
    const kcalEl = document.createElement("span");
    kcalEl.className = "product-modal-kcal";
    kcalEl.textContent = product.kcal + " " + getTranslation("modalKcal");
    body.appendChild(kcalEl);
  }

  content.appendChild(body);

  // Footer (qty selector + price + add button)
  const footer = document.createElement("div");
  footer.className = "product-modal-footer";

  // Quantity selector
  const qtyWrap = document.createElement("div");
  qtyWrap.className = "product-modal-qty";

  const minusBtn = document.createElement("button");
  minusBtn.className = "qty-btn";
  minusBtn.type = "button";
  minusBtn.textContent = "\u2212";

  const qtyVal = document.createElement("span");
  qtyVal.className = "product-modal-qty-value";
  qtyVal.textContent = String(modalQty);

  const plusBtn = document.createElement("button");
  plusBtn.className = "qty-btn";
  plusBtn.type = "button";
  plusBtn.textContent = "+";

  const priceEl = document.createElement("span");
  priceEl.className = "product-modal-price";
  priceEl.textContent = formatPrice(product.price * modalQty);

  function updateQtyUI() {
    qtyVal.textContent = String(modalQty);
    priceEl.textContent = formatPrice(product.price * modalQty);
  }

  minusBtn.addEventListener("click", () => {
    if (modalQty > 1) {
      modalQty--;
      updateQtyUI();
    }
  });

  plusBtn.addEventListener("click", () => {
    modalQty++;
    updateQtyUI();
  });

  qtyWrap.appendChild(minusBtn);
  qtyWrap.appendChild(qtyVal);
  qtyWrap.appendChild(plusBtn);
  footer.appendChild(qtyWrap);

  // Actions (price + add btn)
  const actions = document.createElement("div");
  actions.className = "product-modal-actions";

  actions.appendChild(priceEl);

  const addBtn = document.createElement("button");
  addBtn.className = "btn-add-to-cart";
  addBtn.type = "button";
  addBtn.textContent = getTranslation("modalAddToCart");
  addBtn.addEventListener("click", () => {
    // Start fly-to-cart animation
    const modalImg = modal.querySelector(".product-modal-image");
    const cartBtn = document.querySelector(".btn-cart");
    const badge = document.getElementById("cart-count-badge");

    if (modalImg && cartBtn) {
      const imgRect = modalImg.getBoundingClientRect();
      const cartRect = cartBtn.getBoundingClientRect();

      // Create flying clone
      const clone = document.createElement("img");
      clone.src = modalImg.src;
      clone.className = "fly-to-cart";
      clone.style.top = imgRect.top + "px";
      clone.style.left = imgRect.left + "px";
      clone.style.width = imgRect.width + "px";
      clone.style.height = imgRect.height + "px";
      clone.style.opacity = "1";
      document.body.appendChild(clone);

      // Close modal immediately so product "flies out"
      closeProductModal();

      // Trigger the flight on next frame
      requestAnimationFrame(() => {
        clone.classList.add("is-flying");
        clone.style.top = (cartRect.top + cartRect.height / 2 - 20) + "px";
        clone.style.left = (cartRect.left + cartRect.width / 2 - 20) + "px";
        clone.style.width = "40px";
        clone.style.height = "40px";
        clone.style.opacity = "0.3";
        clone.style.borderRadius = "50%";
      });

      // When animation ends: add to cart, bounce badge, remove clone
      clone.addEventListener("transitionend", function onEnd(e) {
        if (e.propertyName !== "top") return;
        clone.removeEventListener("transitionend", onEnd);
        clone.remove();

        for (let i = 0; i < modalQty; i++) {
          addToCart(product.id);
        }

        // Bounce the cart badge
        if (badge) {
          badge.classList.remove("is-bouncing");
          void badge.offsetWidth; // force reflow
          badge.classList.add("is-bouncing");
          badge.addEventListener("animationend", () => {
            badge.classList.remove("is-bouncing");
          }, { once: true });
        }
        // Pulse the cart button
        if (cartBtn) {
          cartBtn.classList.remove("is-pulsing");
          void cartBtn.offsetWidth;
          cartBtn.classList.add("is-pulsing");
          cartBtn.addEventListener("animationend", () => {
            cartBtn.classList.remove("is-pulsing");
          }, { once: true });
        }
      }, { once: false });
    } else {
      // Fallback: no image or no cart button visible
      for (let i = 0; i < modalQty; i++) {
        addToCart(product.id);
      }
      closeProductModal();
    }
  });
  actions.appendChild(addBtn);

  footer.appendChild(actions);
  content.appendChild(footer);

  dialog.appendChild(content);
  modal.appendChild(dialog);
  document.body.appendChild(modal);
}

function closeProductModal() {
  const existing = document.getElementById("product-modal");
  if (existing) {
    existing.remove();
  }
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  // Remove any existing total row
  const existingTotal = document.getElementById("cart-total-row");
  if (existingTotal) existingTotal.remove();

  if (AppState.cart.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color:rgba(255,255,255,0.55);text-align:center;padding:60px 0;font-size:1.15rem;";
    empty.textContent = getTranslation("cartTitle_zero");
    container.appendChild(empty);
    return;
  }

  let grandTotal = 0;

  AppState.cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    // Product image
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name || "";
      img.className = "cart-item__image";
      row.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "cart-item__image--placeholder";
      placeholder.textContent = "🥗";
      row.appendChild(placeholder);
    }

    // Info block
    const info = document.createElement("div");
    info.className = "cart-item__info";

    const nameEl = document.createElement("div");
    nameEl.className = "cart-item__name";
    nameEl.textContent =
      getTranslation(product.nameKey) || product.name || product.id.replace(/-/g, " ");
    info.appendChild(nameEl);

    const unitPrice = document.createElement("div");
    unitPrice.className = "cart-item__unit-price";
    unitPrice.textContent = formatPrice(product.price) + " / stuk";
    info.appendChild(unitPrice);

    row.appendChild(info);

    // Right block: price + controls
    const right = document.createElement("div");
    right.className = "cart-item__right";

    const lineTotal = product.price * item.quantity;
    grandTotal += lineTotal;

    const priceEl = document.createElement("div");
    priceEl.className = "cart-item__price";
    priceEl.textContent = formatPrice(lineTotal);
    right.appendChild(priceEl);

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

    right.appendChild(controls);
    row.appendChild(right);

    container.appendChild(row);
  });

  // Insert total row between cart-main and cart-footer
  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    const totalRow = document.createElement("div");
    totalRow.className = "cart-total-row";
    totalRow.id = "cart-total-row";

    const totalLabel = document.createElement("span");
    totalLabel.className = "cart-total-label";
    totalLabel.textContent = "Totaal";
    totalRow.appendChild(totalLabel);

    const totalAmount = document.createElement("span");
    totalAmount.className = "cart-total-amount";
    totalAmount.textContent = formatPrice(grandTotal);
    totalRow.appendChild(totalAmount);

    cartFooter.parentNode.insertBefore(totalRow, cartFooter);
  }
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

// Recommended products for popup - 3 products
const recommendedProductIds = [
  "prod-21", // Green Glow Smoothie
  "prod-24", // Berry Blast Smoothie
  "prod-22", // Iced Matcha
];

function showRecommendedProductPopup(onConfirm, onSkip) {
  // Close any existing modal
  closeProductModal();

  // Get the recommended products
  const products = recommendedProductIds
    .map(id => getProductById(id))
    .filter(p => p !== null);

  if (products.length === 0) {
    // If no products found, just proceed with checkout
    onSkip();
    return;
  }

  const modal = document.createElement("div");
  modal.id = "recommended-modal";
  modal.className = "product-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const backdrop = document.createElement("div");
  backdrop.className = "product-modal-backdrop";
  modal.appendChild(backdrop);

  const dialog = document.createElement("div");
  dialog.className = "product-modal-dialog recommended-modal-dialog";

  const content = document.createElement("div");
  content.className = "product-modal-content recommended-modal-content";

  // Header
  const header = document.createElement("div");
  header.className = "recommended-modal-header-center";

  // Title
  const titleEl = document.createElement("div");
  titleEl.className = "recommended-modal-title";
  titleEl.textContent = getTranslation("recommendedTitle");
  header.appendChild(titleEl);

  // Subtitle
  const subtitleEl = document.createElement("div");
  subtitleEl.className = "recommended-modal-subtitle";
  subtitleEl.textContent = getTranslation("recommendedSubtitle");
  header.appendChild(subtitleEl);

  content.appendChild(header);

  // Products grid
  const productsGrid = document.createElement("div");
  productsGrid.className = "recommended-products-grid";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "recommended-product-card";

    // Make whole card clickable to show product details
    productCard.style.cursor = "pointer";
    productCard.addEventListener("click", (e) => {
      // Don't open modal if clicking on the add button
      if (e.target.classList.contains("btn-add-recommended-product")) {
        return;
      }
      // Just open product modal, don't remove recommended modal
      openProductModal(product);
    });

    // Product image
    const imgContainer = document.createElement("div");
    imgContainer.className = "recommended-product-image-container";

    const img = document.createElement("img");
    img.className = "recommended-product-image";
    img.src = product.image || "assets/images/menu/green_glow_smoothie.png";
    img.alt = getTranslation(product.nameKey) || product.name;
    imgContainer.appendChild(img);
    productCard.appendChild(imgContainer);

    // Product name
    const nameEl = document.createElement("div");
    nameEl.className = "recommended-product-name";
    nameEl.textContent = getTranslation(product.nameKey) || product.name;
    productCard.appendChild(nameEl);

    // Product price
    const priceEl = document.createElement("div");
    priceEl.className = "recommended-product-price";
    priceEl.textContent = formatPrice(product.price);
    productCard.appendChild(priceEl);

    // Add button
    const addBtn = document.createElement("button");
    addBtn.className = "btn-add-recommended-product";
    addBtn.type = "button";
    addBtn.textContent = getTranslation("recommendedAdd");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent opening product modal
      addToCart(product.id);
      modal.remove();
      onConfirm();
    });
    productCard.appendChild(addBtn);

    productsGrid.appendChild(productCard);
  });

  content.appendChild(productsGrid);

  // Footer with skip button
  const footer = document.createElement("div");
  footer.className = "recommended-modal-footer";

  const skipBtn = document.createElement("button");
  skipBtn.className = "btn-skip-recommended";
  skipBtn.type = "button";
  skipBtn.textContent = getTranslation("recommendedSkip");
  skipBtn.addEventListener("click", () => {
    modal.remove();
    onSkip();
  });
  footer.appendChild(skipBtn);

  content.appendChild(footer);

  dialog.appendChild(content);
  modal.appendChild(dialog);
  document.body.appendChild(modal);
}

function checkout() {
  if (AppState.cart.length === 0) {
    showScreen("menu");
    return;
  }

  // Show recommended product popup if not yet shown
  if (!AppState.recommendedPopupShown) {
    AppState.recommendedPopupShown = true;
    showRecommendedProductPopup(
      () => {
        // User added recommended product - stay on cart screen
        updateCartUI();
      },
      () => {
        // User skipped - stay on cart screen
        updateCartUI();
      }
    );
    return;
  }

  // Second click - proceed to checkout
  AppState.recommendedPopupShown = false; // Reset for next order
  proceedToCheckout();
}

function proceedToCheckout() {
  const number = generateOrderNumber();
  const cartSnapshot = [...AppState.cart];
  AppState.cart = [];
  AppState.orderNumber = number;

  // Order number
  const orderNumberEl = document.getElementById("order-number");
  if (orderNumberEl) {
    orderNumberEl.textContent = String(number).padStart(3, "0");
  }

  // Date & time (locale based on selected language)
  const localeMap = { nl: "nl-NL", de: "de-DE", en: "en-GB" };
  const locale = localeMap[AppState.selectedLanguage] || "nl-NL";
  const now = new Date();
  const dateEl = document.getElementById("receipt-date");
  const timeEl = document.getElementById("receipt-time");
  if (dateEl) dateEl.textContent = now.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  if (timeEl) timeEl.textContent = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  // Order type
  const orderTypeEl = document.getElementById("receipt-order-type");
  const orderTypeKey = AppState.orderType === "takeaway" ? "receiptOrderTypeTakeaway" : "receiptOrderTypeHere";

  // Items list
  const itemsEl = document.getElementById("receipt-items");
  if (itemsEl) {
    itemsEl.innerHTML = "";
    let subtotal = 0;
    cartSnapshot.forEach((item) => {
      const product = getProductById(item.productId);
      if (!product) return;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      const li = document.createElement("li");
      li.className = "receipt__item";
      const nameSpan = document.createElement("span");
      nameSpan.className = "receipt__item-name";
      nameSpan.textContent = getTranslation(product.nameKey) || product.nameKey;
      const qtySpan = document.createElement("span");
      qtySpan.className = "receipt__item-qty";
      qtySpan.textContent = `× ${item.quantity}`;
      const priceSpan = document.createElement("span");
      priceSpan.className = "receipt__item-price";
      priceSpan.textContent = formatPrice(lineTotal);
      li.appendChild(nameSpan);
      li.appendChild(qtySpan);
      li.appendChild(priceSpan);
      itemsEl.appendChild(li);
    });

    const vatRate = 0.09;
    const excl = subtotal / (1 + vatRate);
    const vat = subtotal - excl;

    const subtotalEl = document.getElementById("receipt-subtotal");
    const vatEl = document.getElementById("receipt-vat");
    const totalEl = document.getElementById("receipt-total");
    if (subtotalEl) subtotalEl.textContent = formatPrice(excl);
    if (vatEl) vatEl.textContent = formatPrice(vat);
    if (totalEl) totalEl.textContent = formatPrice(subtotal);
  }

  // Animate countdown bar
  const fill = document.getElementById("receipt-countdown-fill");
  if (fill) {
    fill.style.transition = "none";
    fill.style.width = "100%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.transition = "width 8s linear";
        fill.style.width = "0%";
      });
    });
  }

  updateCartUI();
  showScreen("confirmation");
  applyTranslations();
  // Re-apply order type text after translations
  if (orderTypeEl) orderTypeEl.textContent = getTranslation(orderTypeKey);
  scheduleResetToSplash();

  // Bon printen via USB of netwerk
  if (typeof Printer !== "undefined") {
    // First check if we have a printer, if not, prompt user to connect
    const checkPrinter = async () => {
      const localeMap2 = { nl: "nl-NL", de: "de-DE", en: "en-GB" };
      const locale2 = localeMap2[AppState.selectedLanguage] || "nl-NL";
      const now2 = new Date();
      const printVatRate = 0.09;
      let printSubtotal = 0;
      const printItems = cartSnapshot.map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        const lineTotal = product.price * item.quantity;
        printSubtotal += lineTotal;
        return {
          name: getTranslation(product.nameKey) || product.nameKey,
          quantity: item.quantity,
          total: lineTotal,
        };
      }).filter(Boolean);
      const printVat = printSubtotal - printSubtotal / (1 + printVatRate);

      // Build order data
      const orderData = {
        orderNumber: number,
        orderType: getTranslation(orderTypeKey),
        items: printItems,
        subtotal: printSubtotal / (1 + printVatRate),
        vat: printVat,
        total: printSubtotal,
        date: now2.toLocaleDateString(locale2, { day: "2-digit", month: "2-digit", year: "numeric" }),
        time: now2.toLocaleTimeString(locale2, { hour: "2-digit", minute: "2-digit" }),
      };

      // If no printer selected, prompt user
      if (!Printer.selectedDevice && navigator.usb) {
        // Show message to user
        const statusEl = document.getElementById('printer-status');
        if (statusEl) {
          const textEl = statusEl.querySelector('.printer-status__text');
          textEl.textContent = 'Selecteer printer...';
          statusEl.classList.add('printer-status--ready');
        }
        
        // Ask user to connect printer
        const connected = await Printer.selectDevice();
        if (!connected) {
          // User cancelled - try network anyway
          console.log('[Printer] Geen USB printer geselecteerd, probeer netwerk...');
        }
      }

      // Now print
      Printer.print(orderData);
    };

    // Execute printer check
    checkPrinter();
  }
}

function resetToSplash() {
  AppState.orderType = null;
  AppState.cart = [];
  AppState.orderNumber = null;
  AppState.activeCategoryId = categories[0] ? categories[0].id : null;
  AppState.recommendedPopupShown = false; // Reset for next order
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

async function initApp() {
  try {
    const response = await fetch("api.php");
    const data = await response.json();
    categories = data.categories || [];
    productsByCategory = data.productsByCategory || {};
  } catch (e) {
    console.error("Failed to load menu data", e);
  }

  AppState.selectedLanguage = "nl";
  AppState.activeCategoryId = categories[0] ? categories[0].id : null;
  attachGlobalHandlers();
  applyTranslations();
  renderCategories();
  renderProductsForCategory(AppState.activeCategoryId);
  updateCartUI();
  showScreen("splash");
  BarcodeScanner.init();
}

document.addEventListener("DOMContentLoaded", initApp);

// ─── USB Barcode / QR-scanner (HID keyboard-emulatie) ───────────────────────
// De scanner stuurt tekens als toetsaanslagen en sluit af met Enter.
// We vangen de invoer op en zoeken het product in het menu.

const BarcodeScanner = {
  _buffer: "",
  _lastKeyTime: 0,
  TIMEOUT_MS: 100, // ms stilte tussen losse toetsaanslagen vs. scanner-burst

  init() {
    document.addEventListener("keydown", (e) => BarcodeScanner._onKey(e));
    console.log("[BarcodeScanner] Klaar voor USB barcode/QR-scanner invoer.");
  },

  _onKey(event) {
    const now = Date.now();

    // Reset buffer als er te veel tijd verstreken is (handmatige invoer?)
    if (now - BarcodeScanner._lastKeyTime > 500) {
      BarcodeScanner._buffer = "";
    }
    BarcodeScanner._lastKeyTime = now;

    if (event.key === "Enter") {
      const code = BarcodeScanner._buffer.trim();
      BarcodeScanner._buffer = "";
      if (code) BarcodeScanner._handleScan(code);
      return;
    }

    // Alleen afdrukbare tekens bewaren
    if (event.key.length === 1) {
      BarcodeScanner._buffer += event.key;
    }
  },

  _handleScan(code) {
    console.log("[BarcodeScanner] Gescand:", code);

    // Zoek product op barcode (product.barcode of product.id als string)
    let found = null;
    for (const catId of Object.keys(productsByCategory)) {
      const product = productsByCategory[catId].find(
        (p) => p.barcode === code || String(p.id) === code
      );
      if (product) { found = product; break; }
    }

    if (found) {
      addToCart(found.id);
      console.log("[BarcodeScanner] Product toegevoegd aan wagen:", found.nameKey);
    } else {
      console.warn("[BarcodeScanner] Geen product gevonden voor code:", code);
    }
  },
};

// ─── Printer Status UI Integration ───────────────────────
// Toont printer status in de hoek van het scherm
(function() {
  const statusEl = document.getElementById('printer-status');
  if (!statusEl) return;

  // Status is verborgen - alleen tonen bij problemen
  // statusEl stays hidden by default

  function updatePrinterUI(status) {
    // Only show status on errors or when printing
    if (status.status === 'error' || status.status === 'usb-disconnected' || 
        status.status === 'usb-printed' || status.status === 'network-printed') {
      statusEl.style.display = 'flex';
    } else {
      statusEl.style.display = 'none';
      return;
    }
    const textEl = statusEl.querySelector('.printer-status__text');
    
    // Verwijder oude status klassen
    statusEl.classList.remove('printer-status--ready', 'printer-status--usb', 'printer-status--network', 'printer-status--error', 'printer-status--printing');

    switch (status.status) {
      case 'ready':
        statusEl.classList.add('printer-status--ready');
        textEl.textContent = 'Printer gereed';
        break;
      case 'usb-connected':
      case 'usb-selected':
        statusEl.classList.add('printer-status--usb');
        textEl.textContent = 'USB Printer';
        break;
      case 'usb-printed':
        statusEl.classList.add('printer-status--usb', 'printer-status--printing');
        textEl.textContent = 'Bonnetje geprint!';
        setTimeout(() => statusEl.classList.remove('printer-status--printing'), 2000);
        break;
      case 'network-printed':
        statusEl.classList.add('printer-status--network', 'printer-status--printing');
        textEl.textContent = 'Bonnetje geprint!';
        setTimeout(() => statusEl.classList.remove('printer-status--printing'), 2000);
        break;
      case 'network-connected':
        statusEl.classList.add('printer-status--network');
        textEl.textContent = 'Netwerk printer';
        break;
      case 'usb-disconnected':
        statusEl.classList.add('printer-status--error');
        textEl.textContent = 'USB offline';
        break;
      case 'error':
        statusEl.classList.add('printer-status--error');
        textEl.textContent = status.message || 'Printer fout';
        break;
      default:
        textEl.textContent = status.message || 'Printer';
    }
  }

  // Initialiseer printer met status callback
  if (typeof Printer !== 'undefined') {
    Printer.init(updatePrinterUI);
  }
})();

