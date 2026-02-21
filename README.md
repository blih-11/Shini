# SHiNi — Premium Clothing Brand Website

A full-featured, responsive clothing brand website built with React + Vite + Tailwind CSS.

## 🎨 Color Themes
This package comes in 3 color variants:
- **shini-theme1** — Navy & Coral: `#172A39`, `#E9E4E0`, `#FC563C`, `#6E7575`
- **shini-theme2** — Dark & Burnt Orange: `#1B191A`, `#E9E4E0`, `#943A1F`
- **shini-theme3** — Dark & Rose Red: `#222223`, `#FEFEFE`, `#B62A2D`, `#E6A8A8`

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 📁 Pages
- **Home** (`/`) — Hero slider, sales, categories, new arrivals, accessories, brand section, store info
- **Products** (`/products`) — All products with search, filter by category, sort
- **Product Detail** (`/products/:id`) — Full product info, size/color selector, add to cart
- **Cart** (`/cart`) — Cart items, order summary, WhatsApp checkout
- **About** (`/about`) — Brand story, team, values
- **Contact** (`/contact`) — Contact form + info
- **Find Store** (`/find-store`) — Store locations

## 🛒 Cart & Checkout
- Add to cart with confirmation dialog
- Cart drawer accessible from navbar
- Full cart page with quantity controls
- Checkout via WhatsApp with auto-formatted order message

## ⚙️ Configuration
### WhatsApp Number
Edit `src/pages/Cart.jsx` line 5:
```js
const WHATSAPP_NUMBER = '2348012345678'; // Replace with your WhatsApp number
```

### Products
Edit `src/data/products.js` to add, remove, or modify products.

### Store Locations
Edit `storeLocations` in `src/data/products.js`.

## 🔧 Tech Stack
- React 18 + React Router v6
- Tailwind CSS v3
- Vite (build tool)
- Google Fonts: Playfair Display + DM Sans + Space Mono
