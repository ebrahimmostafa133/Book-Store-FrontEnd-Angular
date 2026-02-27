import type {Book} from './book.interface'

export interface Order {
  id: string
  user: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: {
    street: string
    city: string
    zipCode: string
  }
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
