export interface Book {
  _id?: string
  name: string
  author: any // Can be string (ObjectId) or populated Author interface
  category: any // Can be string (ObjectId) or populated Category interface
  price: number
  description?: string
  bookCover: string
  stock?: number
  averageRating?: number
  numReviews?: number
  createdAt?: string
  updatedAt?: string
}
