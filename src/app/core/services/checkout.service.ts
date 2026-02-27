import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = `${environment.baseUrl}/booking`
  private readonly httpClient = inject(HttpClient)

  createPaymentIntent(shippingAddress: any) {
    return this.httpClient.post<{success: boolean, paymentIntent: any, order: any}>(`${this.apiUrl}/create-payment-intent`, {
      shippingAddress,
    })
  }

  getPaymentMethods() {
    return this.httpClient.get<any>(`${this.apiUrl}/payment-methods`)
  }
}
