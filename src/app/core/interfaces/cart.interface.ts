import type {Book} from './book.interface'

export interface CartItem {
  book: Book
  quantity: number
  itemTotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  totalAmount: number
  itemCount: number
}
