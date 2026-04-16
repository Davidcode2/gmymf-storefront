import { useState, useCallback } from "react"
import { QuantitySelector } from "../ui/QuantitySelector"
import { useCart } from "./CartProvider"

interface Variant {
  id: string
  title?: string
  options?: { option: { title: string }; value: string }[]
  inventory_quantity?: number
  manage_inventory?: boolean
  calculated_price?: { calculated_amount: number }
  price?: number
}

interface ProductOption {
  id: string
  title: string
  values: { id: string; value: string }[]
}

interface AddToCartProps {
  productId: string
  variants: Variant[]
  options?: ProductOption[]
  onAdded?: () => void
}

export function AddToCart({
  productId,
  variants,
  options,
  onAdded,
}: AddToCartProps) {
  const { addItem, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasVariants = variants.length > 1
  const hasOptions = options && options.length > 0

  const getSelectedVariant = useCallback(() => {
    if (!hasOptions) {
      return variants[0]
    }

    return variants.find((variant) => {
      if (!variant.options) return false
      return variant.options.every((opt) => {
        const optionTitle = opt.option?.title
        return optionTitle && selectedOptions[optionTitle] === opt.value
      })
    })
  }, [variants, hasOptions, selectedOptions])

  const selectedVariant = getSelectedVariant()
  const isAvailable = selectedVariant && 
    (!selectedVariant.manage_inventory || (selectedVariant.inventory_quantity ?? 0) > 0)
  const allOptionsSelected = !hasOptions || 
    (options && options.every((opt) => selectedOptions[opt.title]))

  const handleOptionSelect = (optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: value,
    }))
    setError(null)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError("Please select all options")
      return
    }

    if (!isAvailable) {
      setError("This variant is out of stock")
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      await addItem(selectedVariant.id, quantity)
      setQuantity(1)
      onAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {hasOptions && options && (
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id}>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">
                {option.title}
                {selectedOptions[option.title] && (
                  <span className="text-white ml-2">
                    {selectedOptions[option.title]}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.title] === value.value
                  const variantForValue = variants.find((v) =>
                    v.options?.some(
                      (opt) =>
                        opt.option?.title === option.title && opt.value === value.value
                    )
                  )
                  const isVariantAvailable = variantForValue &&
                    (!variantForValue.manage_inventory || 
                      (variantForValue.inventory_quantity ?? 0) > 0)

                  return (
                    <button
                      key={value.id}
                      type="button"
                      onClick={() => handleOptionSelect(option.title, value.value)}
                      className={`px-4 py-3 text-sm border transition-colors ${
                        isSelected
                          ? "border-white bg-white text-black"
                          : "border-gray-800 hover:border-white"
                      } ${!isVariantAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!isVariantAvailable}
                    >
                      {value.value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-stretch gap-px bg-black">
          <QuantitySelector
            value={quantity}
            min={1}
            max={99}
            onChange={setQuantity}
            disabled={isAdding || isLoading}
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!allOptionsSelected || !isAvailable || isAdding || isLoading}
          className="btn btn-solid w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding || isLoading
            ? "Adding..."
            : !allOptionsSelected
            ? "Select Options"
            : !isAvailable
            ? "Sold Out"
            : "Take My Money"}
        </button>

        {error && (
          <p className="text-red-500 text-xs uppercase tracking-wider text-center">
            {error}
          </p>
        )}

        <p className="text-xs uppercase tracking-wider text-gray-500 text-center">
          {isAvailable
            ? "In Stock - Ships before buyer's remorse sets in"
            : allOptionsSelected
            ? "Gone. Should've been faster."
            : "Select your size above"}
        </p>
      </div>
    </div>
  )
}
