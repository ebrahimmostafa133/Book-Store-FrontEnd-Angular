import type {Order} from '../interfaces/order.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = `${environment.baseUrl}/order`
  private readonly httpClient = inject(HttpClient)

  placeOrder(shippingAddress: any, paymentMethod: string) {
    return this.httpClient.post<{data: Order}>(this.apiUrl, {
      shippingAddress,
      paymentMethod,
    })
  }

  getMyOrders(page: number = 1, limit: number = 12) {
    return this.httpClient.get<{data: Order[], totalItems: number}>(`${this.apiUrl}/my-orders?page=${page}&limit=${limit}`)
  }

  getAllOrders(page: number = 1, limit: number = 12) {
    return this.httpClient.get<{data: Order[]}>(`${this.apiUrl}?page=${page}&limit=${limit}`)
  }

  getCount() {
    return this.httpClient.get<{data: number}>(`${this.apiUrl}/count`)
  }

  // TODO: remove. unused, and doesn't match new API
  getOrderById(id: string) {
    return this.httpClient.get<{data: Order}>(`${this.apiUrl}/${id}`)
  }

  updateOrderStatus(id: string, status: string) {
    return this.httpClient.patch<{data: Order}>(`${this.apiUrl}/${id}`, {status})
  }

  deleteOrder(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
