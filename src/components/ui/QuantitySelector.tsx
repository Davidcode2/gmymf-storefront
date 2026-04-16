import { useCallback } from "react"

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
  loading?: boolean
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  loading = false,
}: QuantitySelectorProps) {
  const decrease = useCallback(() => {
    if (value > min) {
      onChange(value - 1)
    }
  }, [value, min, onChange])

  const increase = useCallback(() => {
    if (value < max) {
      onChange(value + 1)
    }
  }, [value, max, onChange])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue)
      }
    },
    [min, max, onChange]
  )

  const isDisabled = disabled || loading

  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={decrease}
        disabled={isDisabled || value <= min}
        className="w-11 h-11 flex items-center justify-center border border-gray-800 hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <span className="text-lg">-</span>
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        min={min}
        max={max}
        className="w-14 h-11 text-center border-y border-gray-800 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={increase}
        disabled={isDisabled || value >= max}
        className="w-11 h-11 flex items-center justify-center border border-gray-800 hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <span className="text-lg">+</span>
      </button>
    </div>
  )
}
