import { useCart } from "./CartProvider"

interface CartBadgeProps {
  onClick: () => void
}

export function CartBadge({ onClick }: CartBadgeProps) {
  const { cart, isLoading } = useCart()
  const count = cart?.itemCount ?? 0

  return (
    <button
      onClick={onClick}
      className="text-sm uppercase tracking-wider text-muted hover:text-white transition-colors flex items-center gap-2"
      aria-label={`Shopping cart with ${count} items`}
    >
      <span>Money Pit</span>
      <span
        className="text-white"
        aria-live="polite"
        aria-atomic="true"
      >
        ({isLoading ? "..." : count})
      </span>
    </button>
  )
}
