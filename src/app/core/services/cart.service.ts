import type {Cart} from '../interfaces/cart.interface' // You'll need to create this
import {HttpClient} from '@angular/common/http'
// cart.service.ts
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.baseUrl}/cart`
  private readonly httpClient = inject(HttpClient)

  getCart() {
    return this.httpClient.get<{data: Cart}>(this.apiUrl)
  }

  upsertToCart(bookId: string, quantity: number) {
    return this.httpClient.post<{data: Cart}>(this.apiUrl, {
      book: bookId,
      quantity,
    })
  }

  removeFromCart(bookId: string) {
    return this.httpClient.delete<{data: Cart}>(`${this.apiUrl}/${bookId}`)
  }
}
