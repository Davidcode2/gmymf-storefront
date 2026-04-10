/**
 * GMYMF Storefront Types
 * 
 * These types extend Medusa's built-in types for storefront-specific needs.
 * For Medusa entity types, import from '@medusajs/types'.
 */

import type { 
  StoreProduct,
  StoreProductCategory,
  StoreCart,
  StoreRegion,
  StoreCollection,
} from "@medusajs/types"

// Re-export Medusa types for convenience
export type {
  StoreProduct,
  StoreProductCategory,
  StoreCart,
  StoreCartLineItem,
  StoreOrder,
  StoreRegion,
  StoreCollection,
  StoreProductVariant,
  StoreProductOption,
  StoreProductOptionValue,
} from "@medusajs/types"

/**
 * Cart context state
 */
export interface CartState {
  cart: StoreCart | null
  isLoading: boolean
  error: Error | null
  itemCount: number
}

/**
 * Cart context actions
 */
export interface CartActions {
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

/**
 * Product with computed display data
 */
export interface DisplayProduct extends StoreProduct {
  displayPrice: string
  hasMultipleVariants: boolean
  isLowStock: boolean
}

/**
 * Category with hierarchy
 */
export interface CategoryWithChildren extends StoreProductCategory {
  children: StoreProductCategory[]
  parent: StoreProductCategory | null
}

/**
 * Search result item
 */
export interface SearchResult {
  products: StoreProduct[]
  categories: StoreProductCategory[]
  totalCount: number
}

/**
 * Filter options for product listing
 */
export interface ProductFilters {
  category?: string[]
  priceRange?: [number, number]
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "created_at"
}

/**
 * Navigation item for megamenu
 */
export interface NavItem {
  id: string
  name: string
  handle: string
  href: string
  children?: NavItem[]
  featured?: StoreProduct[]
}

/**
 * Cart item display
 */
export interface CartItemDisplay {
  id: string
  productTitle: string
  variantTitle: string
  quantity: number
  unitPrice: number
  totalPrice: number
  thumbnail?: string
}

/**
 * Checkout step
 */
export type CheckoutStep = 
  | "shipping"
  | "delivery"
  | "payment"
  | "review"

/**
 * Shipping address form
 */
export interface ShippingAddressForm {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  company?: string
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string
}

/**
 * Toast notification
 */
export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}
