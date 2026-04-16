import { useState } from "react"
import { CartProvider, useCart, AddToCart, CartDrawer } from "./index"

interface ProductAddToCartProps {
  productId: string
  variants: Array<{
    id: string
    title?: string
    options?: Array<{ option: { title: string }; value: string }>
    inventory_quantity?: number
    manage_inventory?: boolean
    calculated_price?: { calculated_amount: number }
    price?: number
  }>
  options?: Array<{
    id: string
    title: string
    values: Array<{ id: string; value: string }>
  }>
}

function ProductAddToCartInner({
  productId,
  variants,
  options,
}: ProductAddToCartProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <AddToCart
        productId={productId}
        variants={variants}
        options={options}
        onAdded={() => setIsDrawerOpen(true)}
      />
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}

export function ProductAddToCart(props: ProductAddToCartProps) {
  return (
    <CartProvider>
      <ProductAddToCartInner {...props} />
    </CartProvider>
  )
}
