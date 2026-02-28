import type {Book} from './book.interface'

export interface Order {
  id: string
  user: {
    email: string
    id: string
  }
  shippingAddress: string
  phone: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id?: string
  book: Book
  quantity: number
  priceAtPurchase: number
}
