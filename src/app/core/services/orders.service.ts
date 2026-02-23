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

  getAllOrders() {
    return this.httpClient.get<{data: Order[]}>(this.apiUrl)
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
