import type {Review} from '../interfaces/review.interface'

import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'

import {environment} from '../../../environments/environment.development'

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.baseUrl}/review`
  private readonly httpClient = inject(HttpClient)

  createReview(review: {book: string, rating: number, comment: string}) {
    return this.httpClient.post<{data: Review}>(this.apiUrl, review)
  }

  getReviewsByBook(bookId: string) {
    return this.httpClient.get<{data: Review[]}>(`${this.apiUrl}/book/${bookId}`)
  }

  updateReview(id: string, review: {rating: number, comment: string}) {
    return this.httpClient.patch<{data: Review}>(`${this.apiUrl}/${id}`, review)
  }

  deleteReview(id: string) {
    return this.httpClient.delete<{message: string}>(`${this.apiUrl}/${id}`)
  }
}
