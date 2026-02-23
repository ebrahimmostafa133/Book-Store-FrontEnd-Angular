export interface CartItem {
  book: {
    id: string
    title: string
    price: number
    coverImage?: string
    stock: number
  }
  quantity: number
  itemTotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  totalAmount: number
  itemCount: number
}
