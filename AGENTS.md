# GMYMF Storefront - Agent Guidelines

## Project Context

**Repository:** `gmymf-storefront`  
**Purpose:** Ecommerce storefront for GMYMF clothing brand  
**Framework:** Astro 5.x + React + TailwindCSS v4  
**Backend:** Medusa 2.13.6 (separate repository)

## Critical Decisions

### Design Direction
- **Theme:** Dark mode only, black & white minimalist
- **Accent:** "Joker-like" typography - distinctive, playful but sophisticated
- **Brand:** GMYMF (Give me your money, fool) - exclusive, limited pieces
- **Max Products:** ~100 (drops model, low inventory)

#### Tone and Philosophy

- rife with sarcasm
- celebrating capitalism in ironic way
- use 'I' perspective instead of 'we'
- extremely overpriced goods
- overcharging and being straight about it

### Tech Stack
- Astro for static/server rendering
- React for client islands (cart, search, filters)
- TailwindCSS v4 for styling
- Medusa JS SDK for backend communication

### Ecommerce Scope
- Germany only (no multi-region yet)
- Guest checkout (no account required)
- No reviews, no wishlist
- Search: YES
- Megamenu: YES
- Promotional banners: NO

### Architecture Notes
- **Static (SSG):** Homepage, static pages, product listing (with revalidation)
- **Server (SSR):** Product details, cart, checkout, account
- **Client Islands:** Add to cart, search, filters, cart drawer

### Backend Integration Rules

**ALWAYS use Medusa JS SDK - NEVER use regular fetch:**
```typescript
// ✅ CORRECT
import { sdk } from '../lib/medusa'
const { products } = await sdk.store.product.list()

// ❌ WRONG - Don't use fetch
const res = await fetch('/store/products')
```

**Price Display:**
- Medusa prices are stored as-is ($49.99 = 49.99)
- NEVER divide by 100 (unlike Stripe)

**Required Headers:**
- SDK automatically adds `x-publishable-api-key`
- SDK automatically handles `Authorization` for admin
- Never manually set these headers

### SDK Configuration

```typescript
// lib/medusa.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.MEDUSA_API_URL,
  debug: import.meta.env.DEV,
})
```

### File Structure

```
src/
├── components/
│   ├── ui/           # Base components (Button, Input, etc.)
│   ├── layout/       # Navbar, Footer, Megamenu
│   ├── product/      # ProductCard, ProductGrid, VariantSelector
│   ├── cart/         # CartDrawer, CartItem, AddToCart
│   └── search/       # SearchBar, SearchResults
├── layouts/
│   └── MainLayout.astro
├── pages/
│   ├── index.astro           # Homepage
│   ├── products/
│   │   ├── index.astro       # Listing (SSG)
│   │   └── [handle].astro    # Detail (SSR)
│   ├── categories/
│   │   └── [...slug].astro   # Category pages
│   ├── cart.astro            # Cart page
│   ├── checkout.astro        # Checkout flow
│   ├── search.astro          # Search results
│   └── about.astro           # Static page
├── lib/
│   ├── medusa.ts             # SDK setup
│   ├── utils.ts              # Utilities
│   └── cart.ts               # Cart helpers
├── styles/
│   └── global.css            # Tailwind + custom styles
└── types/
    └── index.ts              # TypeScript types
```

### Design Tokens

**Colors:**
```css
--color-bg-primary: #000000;        /* Pure black */
--color-bg-secondary: #111111;      /* Slightly lighter */
--color-surface: #1a1a1a;           /* Card surfaces */
--color-text-primary: #ffffff;      /* White */
--color-text-secondary: #a0a0a0;    /* Muted gray */
--color-border: #333333;            /* Subtle borders */
--color-accent: /* TBD - distinctive accent */;
```

**Typography:**
- Display font: Distinctive, joker-inspired
- Body font: Clean sans-serif (highly legible)
- Accent font: For special elements

### Common Mistakes to Avoid

- ❌ Using emojis in UI
- ❌ Creating static routes for products (use `[handle]` dynamic routes)
- ❌ Dividing prices by 100
- ❌ Using regular fetch instead of SDK
- ❌ Missing `aria-live="polite"` on cart count updates
- ❌ Hardcoding categories/products (always fetch from Medusa)
- ❌ Not handling loading/error states
- ❌ Touch targets smaller than 44px
- ❌ Light theme (dark only!)

### Git Workflow

- Commit frequently with descriptive messages
- Push after each meaningful commit
- Feature branches for major changes

### Testing Checklist

Before considering a feature complete:
- [ ] Works on mobile (responsive)
- [ ] Touch targets are 44px+
- [ ] Dark theme consistent
- [ ] Cart updates announced (aria-live)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] No hardcoded content
- [ ] Uses SDK correctly (no fetch)
