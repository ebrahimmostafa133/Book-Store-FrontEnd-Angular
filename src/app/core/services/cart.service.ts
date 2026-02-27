import type {Cart} from '../interfaces/cart.interface'
import {HttpClient} from '@angular/common/http'
import {computed, inject, Injectable, signal} from '@angular/core'
import {concatMap, Subject, tap} from 'rxjs'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.baseUrl}/cart`
  private readonly httpClient = inject(HttpClient)

  cart = signal<Cart | null>(null)
  cartCount = computed(() => this.cart()?.itemCount || 0)

  private updateQueue = new Subject<{bookId: string, quantity: number}>()
  private inFlightCount = 0

  constructor() {
    this.updateQueue.pipe(
      tap(() => this.inFlightCount++),
      concatMap(({bookId, quantity}) =>
        this.httpClient.post<{data: Cart}>(this.apiUrl, {book: bookId, quantity}),
      ),
      tap(() => this.inFlightCount--),
    ).subscribe({
      next: (res) => {
        // ONLY sync with server if no more requests are waiting in the queue
        if (this.inFlightCount === 0) {
          this.cart.set(res.data)
        }
      },
      error: () => {
        this.inFlightCount = 0
        this.getCart().subscribe()
      },
    })
  }

  upsertToCart(bookId: string, quantity: number) {
    this.applyOptimisticUpdate(bookId, quantity)
    this.updateQueue.next({bookId, quantity})
  }

  private applyOptimisticUpdate(bookId: string, quantity: number) {
    this.cart.update((prev) => {
      if (!prev) { return null }
      const existingItem = prev.items.find(i => i.book.id === bookId)

      if (existingItem) {
        const qtyDiff = quantity - existingItem.quantity
        return {
          ...prev,
          items: prev.items.map(i => i.book.id === bookId ? {...i, quantity, itemTotal: quantity * i.book.price} : i),
          itemCount: prev.itemCount + qtyDiff,
          totalAmount: prev.totalAmount + (qtyDiff * existingItem.book.price),
        }
      }
      return prev
    })
  }

  getCart() {
    return this.httpClient.get<{data: Cart}>(this.apiUrl).pipe(
      tap(res => this.cart.set(res.data)),
    )
  }

  addToCart(bookId: string, delta: number) {
    const currentCart = this.cart()
    let quantity = delta
    if (currentCart) {
      const existingItem = currentCart.items.find(i => i.book.id === bookId)
      if (existingItem) {
        quantity = existingItem.quantity + delta
      }
    }

    return this.upsertToCart(bookId, quantity)
  }

  removeFromCart(bookId: string) {
    const currentCart = this.cart()
    if (currentCart) {
      const itemToRemove = currentCart.items.find(i => i.book.id === bookId)
      if (itemToRemove) {
        this.cart.update((prev) => {
          if (!prev) { return null }
          return {
            ...prev,
            items: prev.items.filter(i => i.book.id !== bookId),
            itemCount: prev.itemCount - itemToRemove.quantity,
            totalAmount: prev.totalAmount - itemToRemove.itemTotal,
          }
        })
      }
    }

    return this.httpClient.delete<{data: Cart}>(`${this.apiUrl}/${bookId}`).pipe(
      tap({
        next: res => this.cart.set(res.data),
        error: () => this.getCart().subscribe(),
      }),
    )
  }
}
