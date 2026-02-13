// Eenvoudige dummy-data voor categorieën en producten.
// Je kunt dit later vervangen of uitbreiden.

const categories = [
  {
    id: "ontbijt",
    labelKey: "catBreakfast",
    image: "assets/images/cat-ontbijt.jpg",
  },
  {
    id: "lunch",
    labelKey: "catLunch",
    image: "assets/images/cat-lunch.jpg",
  },
  {
    id: "handheld",
    labelKey: "catHandheld",
    image: "assets/images/cat-handheld.jpg",
  },
  {
    id: "sides",
    labelKey: "catSides",
    image: "assets/images/cat-sides.jpg",
  },
  {
    id: "dips",
    labelKey: "catDips",
    image: "assets/images/cat-dips.jpg",
  },
  {
    id: "drankjes",
    labelKey: "catDrinks",
    image: "assets/images/cat-drankjes.jpg",
  },
];

const productsByCategory = {
  ontbijt: [
    {
      id: "smoothie-groen",
      nameKey: "prodGreenSmoothie",
      price: 4.5,
    },
    {
      id: "overnight-oats",
      nameKey: "prodOvernightOats",
      price: 3.95,
    },
    {
      id: "chia-parfait",
      nameKey: "prodChiaParfait",
      price: 4.25,
    },
  ],
  lunch: [
    {
      id: "bowl-buddha",
      nameKey: "prodBuddhaBowl",
      price: 8.9,
    },
    {
      id: "wrap-falafel",
      nameKey: "prodFalafelWrap",
      price: 7.5,
    },
    {
      id: "salade-quinoa",
      nameKey: "prodQuinoaSalad",
      price: 7.9,
    },
  ],
  handheld: [
    {
      id: "burger-bean",
      nameKey: "prodBeanBurger",
      price: 8.5,
    },
    {
      id: "taco-jackfruit",
      nameKey: "prodJackfruitTaco",
      price: 7.9,
    },
  ],
  sides: [
    {
      id: "sweet-fries",
      nameKey: "prodSweetFries",
      price: 3.75,
    },
    {
      id: "side-slaw",
      nameKey: "prodHerbSlaw",
      price: 3.1,
    },
  ],
  dips: [
    {
      id: "dip-guacamole",
      nameKey: "prodGuacamoleDip",
      price: 1.5,
    },
    {
      id: "dip-hummus",
      nameKey: "prodHummusDip",
      price: 1.5,
    },
  ],
  drankjes: [
    {
      id: "smoothie-berry",
      nameKey: "prodBerrySmoothie",
      price: 4.5,
    },
    {
      id: "iced-tea",
      nameKey: "prodIcedTea",
      price: 2.9,
    },
    {
      id: "infused-water",
      nameKey: "prodInfusedWater",
      price: 2.4,
    },
  ],
};

