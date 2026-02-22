import type {Author} from './author.interface'
import type {Category} from './category.interface'

export interface Book {
  id: string
  name: string
  author: Author | string
  category: Category | string
  price: number
  stock: number
  bookCover: string
  description?: string
  averageRating?: number
  numReviews?: number
}
