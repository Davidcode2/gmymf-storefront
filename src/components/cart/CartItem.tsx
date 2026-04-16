import { QuantitySelector } from "../ui/QuantitySelector"
import { useCart } from "./CartProvider"

interface CartItemProps {
  id: string
  productTitle: string
  variantTitle: string
  variantOptions: { name: string; value: string }[]
  quantity: number
  unitPrice: number
  totalPrice: number
  thumbnail?: string
}

export function CartItem({
  id,
  productTitle,
  variantTitle,
  variantOptions,
  quantity,
  unitPrice,
  totalPrice,
  thumbnail,
}: CartItemProps) {
  const { updateItem, removeItem, formatPrice, isLoading } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateItem(id, newQuantity)
    }
  }

  const handleRemove = () => {
    removeItem(id)
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-900">
      <div className="w-20 h-24 flex-shrink-0 bg-black border border-gray-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={productTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-700 uppercase">
            GMYMF
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm uppercase tracking-wider truncate">
              {productTitle}
            </h3>
            {(variantTitle || variantOptions.length > 0) && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {variantOptions.length > 0
                  ? variantOptions.map((opt) => opt.value).join(" / ")
                  : variantTitle}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-500 hover:text-white transition-colors p-1"
            aria-label={`Remove ${productTitle} from cart`}
          >
            <svg
              className="w-4 h-4"
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

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={quantity}
            min={1}
            max={99}
            onChange={handleQuantityChange}
            disabled={isLoading}
          />
          <div className="text-right">
            <p className="text-sm">{formatPrice(totalPrice)}</p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500">
                {formatPrice(unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
