import { useEffect } from "react"
import { useCart } from "./CartProvider"
import { CartItem } from "./CartItem"

export function CartPage() {
  const { cart, isLoading, formatPrice } = useCart()

  const isEmpty = !cart || cart.items.length === 0

  if (isLoading) {
    return (
      <section className="section flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-lg uppercase tracking-wider">Loading...</p>
        </div>
      </section>
    )
  }

  if (isEmpty) {
    return (
      <section className="section">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <svg
              className="w-24 h-24 text-gray-800 mx-auto mb-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="heading-md mb-4">Your cart is empty</h1>
            <p className="text-muted text-sm uppercase tracking-wider mb-8">
              Nothing to see here. Go buy something.
            </p>
            <a href="/products" className="btn">
              Browse Products
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="border-b border-gray-900">
        <div className="container py-8">
          <nav className="flex items-center gap-4 text-sm">
            <a href="/" className="text-muted hover:text-white">
              Home
            </a>
            <span className="text-muted">/</span>
            <span className="text-white uppercase tracking-wider">Money Pit</span>
          </nav>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="heading-md">Money Pit</h1>
                <span className="text-muted text-sm uppercase tracking-wider">
                  {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="divide-y divide-gray-900" aria-live="polite">
                {cart.items.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </div>

              <div className="mt-8">
                <a
                  href="/products"
                  className="text-sm text-muted hover:text-white uppercase tracking-wider"
                >
                  Continue Shopping
                </a>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-gray-900 p-6">
                <h2 className="text-sm uppercase tracking-wider mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-900 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider">Total</span>
                    <span className="text-lg">{formatPrice(cart.total)}</span>
                  </div>
                </div>

                <a href="/checkout" className="btn btn-solid w-full block text-center">
                  Checkout
                </a>

                <p className="text-xs text-gray-500 text-center mt-4 uppercase tracking-wider">
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
