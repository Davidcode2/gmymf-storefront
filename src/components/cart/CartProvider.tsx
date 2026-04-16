import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { sdk, formatPrice } from "../../lib/medusa"

const CART_ID_KEY = "gmymf_cart_id"

interface CartItem {
  id: string
  productTitle: string
  variantTitle: string
  variantOptions: { name: string; value: string }[]
  quantity: number
  unitPrice: number
  totalPrice: number
  thumbnail?: string
  variantId: string
}

interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
  currencyCode: string
  itemCount: number
}

interface CartContextValue {
  cart: Cart | null
  isLoading: boolean
  error: Error | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearCart: () => void
  formatPrice: (amount: number) => string
}

const CartContext = createContext<CartContextValue | null>(null)

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })
}

function transformCart(apiCart: any): Cart {
  const items: CartItem[] = (apiCart.items || []).map((item: any) => ({
    id: item.id,
    productTitle: item.product_title || item.title,
    variantTitle: item.variant_title || "",
    variantOptions: item.variant?.options?.map((opt: any) => ({
      name: opt.option?.title || opt.option_id,
      value: opt.value,
    })) || [],
    quantity: item.quantity,
    unitPrice: item.unit_price,
    totalPrice: item.unit_price * item.quantity,
    thumbnail: item.thumbnail || item.product?.thumbnail,
    variantId: item.variant_id,
  }))

  return {
    id: apiCart.id,
    items,
    subtotal: apiCart.subtotal || 0,
    total: apiCart.total || 0,
    currencyCode: apiCart.currency_code || "EUR",
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

function CartProviderInner({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(CART_ID_KEY)
  })
  const [error, setError] = useState<Error | null>(null)

  const {
    data: cart,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) return null
      try {
        const { cart: apiCart } = await sdk.store.cart.retrieve(cartId)
        return transformCart(apiCart)
      } catch (err) {
        localStorage.removeItem(CART_ID_KEY)
        setCartId(null)
        return null
      }
    },
    enabled: !!cartId,
  })

  const createCartMutation = useMutation({
    mutationFn: async () => {
      const { cart: newCart } = await sdk.store.cart.create({})
      return newCart
    },
    onSuccess: (newCart) => {
      localStorage.setItem(CART_ID_KEY, newCart.id)
      setCartId(newCart.id)
      queryClient.setQueryData(["cart", newCart.id], transformCart(newCart))
    },
  })

  const addItemMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: string
      quantity: number
    }) => {
      let currentCartId = cartId
      if (!currentCartId) {
        const newCart = await createCartMutation.mutateAsync()
        currentCartId = newCart.id
      }
      if (!currentCartId) {
        throw new Error("Failed to create cart")
      }
      const { cart: updatedCart } = await sdk.store.cart.createLineItem(
        currentCartId,
        {
          variant_id: variantId,
          quantity,
        }
      )
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", updatedCart.id], transformCart(updatedCart))
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error("Failed to add item"))
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string
      quantity: number
    }) => {
      if (!cartId) throw new Error("No cart")
      const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
        cartId,
        lineItemId,
        { quantity }
      )
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", cartId], transformCart(updatedCart))
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error("Failed to update item"))
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      if (!cartId) throw new Error("No cart")
      await sdk.store.cart.deleteLineItem(cartId, lineItemId)
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId)
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", cartId], transformCart(updatedCart))
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error("Failed to remove item"))
    },
  })

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      setError(null)
      await addItemMutation.mutateAsync({ variantId, quantity })
    },
    [addItemMutation]
  )

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      setError(null)
      await updateItemMutation.mutateAsync({ lineItemId, quantity })
    },
    [updateItemMutation]
  )

  const removeItem = useCallback(
    async (lineItemId: string) => {
      setError(null)
      await removeItemMutation.mutateAsync(lineItemId)
    },
    [removeItemMutation]
  )

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    if (cartId) {
      queryClient.setQueryData(["cart", cartId], null)
    }
    setCartId(null)
  }, [cartId, queryClient])

  const formatPriceLocal = useCallback(
    (amount: number) => formatPrice(amount, cart?.currencyCode || "EUR"),
    [cart?.currencyCode]
  )

  return (
    <CartContext.Provider
      value={{
        cart: cart || null,
        isLoading: isLoading || createCartMutation.isPending,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        formatPrice: formatPriceLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

let sharedQueryClient: QueryClient | null = null

export function CartProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    if (!sharedQueryClient) {
      sharedQueryClient = createQueryClient()
    }
    return sharedQueryClient
  })

  return (
    <QueryClientProvider client={queryClient}>
      <CartProviderInner>{children}</CartProviderInner>
    </QueryClientProvider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
