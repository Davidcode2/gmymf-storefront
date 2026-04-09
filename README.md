# GMYMF Storefront

Astro.js storefront for GMYMF ("Give me your money, fool") - an exclusive clothing brand with limited pieces.

## Brand Identity

**Name:** GMYMF (Give me your money, fool)  
**Theme:** Black & white minimalist with "joker-like" accent typography  
**Mood:** Dark, exclusive, limited edition (max 100 products), luxury streetwear

## Technical Stack

- **Framework:** Astro 5.x
- **UI Library:** React 18+ (for interactive components)
- **Styling:** TailwindCSS v4
- **Backend:** Medusa 2.13.6 (separate repo)
- **Hosting:** Kubernetes (K3s) via ArgoCD
- **Domain:** gmymf.jakob-lingel.dev

## Ecommerce Requirements

### Scope
- Clothing brand, exclusive limited pieces
- Max ~100 products (low inventory, drops model)
- Germany only (no multi-region needed yet)
- Guest checkout supported

### Features
**Must Have:**
- [ ] Homepage with hero and featured products
- [ ] Product listing with filters/pagination
- [ ] Product detail page with variant selection
- [ ] Search functionality
- [ ] Megamenu navigation
- [ ] Cart functionality
- [ ] Checkout flow (shipping, payment, review)
- [ ] Order confirmation

**Nice to Have (Phase 2):**
- [ ] Account dashboard
- [ ] Order history

**Not Included:**
- Product reviews
- Wishlist
- Promotional banners
- Multi-region/currency

## Design System

### Colors
- Background: `#000000` (pure black)
- Surface: `#111111` / `#1a1a1a`
- Primary Text: `#ffffff` (white)
- Secondary Text: `#a0a0a0` (muted gray)
- Accent: Brand-specific accent for CTAs (to be defined)
- Border: `#333333`

### Typography
- **Display/Headings:** Joker-inspired, distinctive display font
- **Body:** Clean, readable sans-serif
- **Accent:** Playful but sophisticated "joker-like" elements

### Layout
- Full-bleed dark theme
- Generous whitespace
- Asymmetric compositions
- Editorial/magazine-like product showcases

## Architecture

Astro's hybrid rendering strategy:

```
Static Generation (SSG):
├── Homepage
├── Static pages (About, FAQ, Shipping)
└── Product listing (with ISR/revalidation)

Server-Side Rendering (SSR):
├── Product detail pages
├── Cart
├── Checkout
└── Account pages

Client Islands (React):
├── Add to cart button
├── Cart drawer/sidebar
├── Search autocomplete
├── Filters
└── Variant selectors
```

## Medusa Integration

- **SDK:** `@medusajs/js-sdk`
- **API Base:** Configured via `MEDUSA_API_URL` env var
- **Publishable Key:** Required for store operations
- **CORS:** Backend configured for storefront domain

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deployed via ArgoCD to K3s cluster:
- Docker image built via GitHub Actions
- Secrets managed via External Secrets Operator (AWS SSM)
- Domain: gmymf.jakob-lingel.dev

## Project Structure

```
src/
├── components/          # React/Astro components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── cart/           # Cart-related components
├── layouts/            # Astro page layouts
├── pages/              # Astro routes
│   ├── products/
│   │   ├── index.astro     # Product listing
│   │   └── [handle].astro  # Product detail
│   ├── categories/
│   ├── cart.astro
│   ├── checkout.astro
│   └── ...
├── lib/                # Utilities and SDK config
│   └── medusa.ts       # Medusa SDK setup
├── styles/             # Global styles
└── types/              # TypeScript types
```

## Environment Variables

Required secrets (via ESO/AWS SSM):
- `MEDUSA_API_URL` - Backend API endpoint
- `MEDUSA_PUBLISHABLE_KEY` - Store API key

## License

MIT
