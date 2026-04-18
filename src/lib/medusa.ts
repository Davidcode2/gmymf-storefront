import Medusa from "@medusajs/js-sdk"

/**
 * Medusa SDK Configuration
 * 
 * This SDK instance is used for all backend communication.
 * The SDK automatically handles:
 * - Authentication headers (publishable API key)
 * - Request/response serialization
 * - Error handling
 * 
 * NEVER use regular fetch() for Medusa API calls - always use this SDK.
 */

// Production configuration - hardcoded for simplicity
// Publishable keys are safe to expose publicly (like Stripe's publishable keys)
const MEDUSA_API_URL = process.env.MEDUSA_API_URL || "https://gmymf-medusa.jakob-lingel.dev"
const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY || "pk_3f8c3188d7507238c98b1867f0aba926b3301731ccbcb1ab9bb2a2655d6256af"

// Initialize SDK
export const sdk = new Medusa({
  baseUrl: MEDUSA_API_URL,
  debug: import.meta.env?.DEV || process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
})

// Export common types for convenience
export type { 
  StoreProduct,
  StoreProductCategory,
  StoreCart,
  StoreOrder,
  StoreRegion,
  StoreCollection,
} from "@medusajs/types"

/**
 * Price formatting helper
 * 
 * Medusa prices are stored as-is (e.g., $49.99 = 49.99)
 * NEVER divide by 100 (unlike Stripe which uses cents)
 */
export function formatPrice(amount: number, currencyCode: string = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Cart helpers
 */
export async function createCart(regionId?: string) {
  const { cart } = await sdk.store.cart.create({
    region_id: regionId,
  })
  return cart
}

export async function getCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId)
  return cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
) {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })
  return cart
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  })
  return cart
}

export async function removeCartItem(cartId: string, lineItemId: string) {
  await sdk.store.cart.deleteLineItem(cartId, lineItemId)
  const { cart } = await sdk.store.cart.retrieve(cartId)
  return cart
}
