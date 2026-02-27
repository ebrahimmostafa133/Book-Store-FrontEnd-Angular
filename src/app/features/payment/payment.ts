import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router, RouterModule} from '@angular/router'
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import {CartService} from '../../core/services/cart.service'
import {CheckoutService} from '../../core/services/checkout.service'

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxSpinnerModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  private fb = inject(FormBuilder)
  private checkoutService = inject(CheckoutService)
  private cartService = inject(CartService)
  private spinner = inject(NgxSpinnerService)
  private router = inject(Router)

  paymentForm!: FormGroup
  isProcessing = signal(false)
  orderPlaced = signal(false)
  shippingAddress: any = null
  cart = this.cartService.cart

  ngOnInit() {
    this.shippingAddress = window.history.state?.shippingAddress
    if (!this.shippingAddress) {
      this.router.navigate(['/checkout'])
    }
    this.initForm()
  }

  initForm() {
    this.paymentForm = this.fb.group({
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    })
  }

  submitPayment() {
    if (!this.paymentForm.valid || !this.shippingAddress) {
      return
    }

    this.isProcessing.set(true)
    this.spinner.show()

    // Call the checkout service to create a payment intent using the shipped address
    this.checkoutService.createPaymentIntent(this.shippingAddress).subscribe({
      next: (res) => {
        if (res.success) {
          this.orderPlaced.set(true)
          // Refetch the cart to clear the numbers in navbar after ordering
          this.cartService.getCart().subscribe()
        }
        this.isProcessing.set(false)
        this.spinner.hide()
      },
      error: (err) => {
        console.error('Error creating payment intent:', err)
        this.isProcessing.set(false)
        this.spinner.hide()
        // eslint-disable-next-line no-alert
        alert('Failed to process payment. Please try again.')
      },
    })
  }

  continueShopping() {
    this.router.navigate(['/books'])
  }
}
