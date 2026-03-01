import type {Author} from './author.interface'
import type {Category} from './category.interface'
import type {Review} from './review.interface'

export interface Book {
  id: string
  name: string
  author: Author
  category: Category
  price: number
  stock: number
  bookCover: string
  description?: string
  averageRating?: number
  numReviews?: number
  reviews?: Review[]
  createdAt?: any
}
