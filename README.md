 Happy Herbivore Kiosk

This is a kiosk website ( Happy herbivore) 100% plant based restaurant, designed to be used on a self-ordering screen in a restaurant. Customers can easily browse the menu, change the language to their preferred option, and place their food orders directly on the screen.

While ordering, users can add products to their cart, remove items they no longer want, or increase the quantity of specific products. The interface is designed to be simple and intuitive so that customers can quickly customize their order.

When the customer proceeds to the payment stage, the system may display a suggestion asking if they would like to add something extra to their order. For example, it might recommend a popular item or a complementary product that could enhance their meal. The customer can either add the suggested product or dismiss the suggestion.

After closing the suggestion screen—either by selecting an additional item or by skipping it—the system will prompt the customer to complete the payment. Once the payment is processed, a receipt will automatically be printed for the customer, confirming the order.

## Features

- Multi-language: Dutch, German, English
- Order types: Eat Here / Takeaway
- Categories: Breakfast, Lunch, Handhelds, Sides, Dinks, Drinks
- Shopping cart with quantity adjustment
- Digital receipt with order confirmation
- Auto-reset after order completion

## Project Structure

```
7.1-kiosk-duo/
├── api/                    # PHP API endpoints
├── public/                 # Frontend (HTML, CSS, JS)
│   ├── api.php            # Main API
│   ├── index.html         # Main page
│   ├── assets/images/     # Images & logos
│   ├── css/styles.css    # Styles
│   └── js/app.js         # Application logic
├── sql/                   # Database files
├── db_connect.php        # Database connection
└── README.md
```

## Installation

1. **Database**: Create `kiosk_db` database, import `sql/kiosk_db`
2. **Config**: Update `db_connect.php` with your credentials
3. **Run**: Start Apache/MySQL, open `public/index.html` in browser

## Tech Stack

- PHP, MySQL
- HTML, CSS, Vanilla JavaScript
- Noto Sans font

## Usage Flow

Splash → Welcome (language + order type) → Menu → Cart → Confirmation → Auto-reset

Trello Board: https://trello.com/invite/b/6985bb0321d778e83d425a1c/ATTI92214114407a52dad93fc57ff601ca3660E93B1D/kiosk-71-hack-n-hap

