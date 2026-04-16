import { useEffect, useCallback, type ReactNode } from "react"
import { useCart } from "./CartProvider"
import { CartItem } from "./CartItem"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, isLoading, formatPrice } = useCart()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const isEmpty = !cart || cart.items.length === 0

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-gray-900 z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-900">
          <h2 className="text-lg uppercase tracking-wider">Money Pit</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted uppercase tracking-wider text-sm">
                Loading...
              </div>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-gray-800 mb-6"
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
              <p className="text-muted text-sm uppercase tracking-wider mb-6">
                Your cart is empty
              </p>
              <button
                onClick={onClose}
                className="btn text-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {cart.items.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>

        {!isEmpty && cart && (
          <div className="border-t border-gray-900 p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-900">
                <span className="uppercase tracking-wider">Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <a
              href="/checkout"
              className="btn btn-solid w-full block text-center"
              onClick={onClose}
            >
              Checkout
            </a>

            <button
              onClick={onClose}
              className="w-full text-center text-xs text-gray-500 uppercase tracking-wider hover:text-white transition-colors py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
