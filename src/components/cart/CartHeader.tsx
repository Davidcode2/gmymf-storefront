import { useState } from "react"
import { CartProvider, useCart } from "./CartProvider"
import { CartDrawer } from "./CartDrawer"
import { CartBadge } from "./CartBadge"

function HeaderCart() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <CartBadge onClick={() => setIsDrawerOpen(true)} />
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}

export function CartHeader() {
  return (
    <CartProvider>
      <HeaderCart />
    </CartProvider>
  )
}
