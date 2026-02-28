export interface ReviewUser {
  id: string
  firstName: string
  lastName: string
}

export interface Review {
  id: string
  book: string
  user: ReviewUser
  rating: number
  comment?: string
  createdAt: string | Date
  updatedAt?: string | Date
}
