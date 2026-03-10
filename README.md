# Happy Herbivore Kiosk

A touch-screen self-ordering kiosk system designed for Happy Herbivore, a 100% plant-based restaurant. Customers can independently browse the menu, select products, customize quantities, and complete their orders without staff assistance. The system supports multiple languages and provides a seamless digital ordering experience.

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

