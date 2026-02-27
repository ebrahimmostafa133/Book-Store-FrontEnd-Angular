import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Cart} from '../../core/interfaces/cart.interface'
import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router, RouterModule} from '@angular/router'
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import {CartService} from '../../core/services/cart.service'
import {CheckoutService} from '../../core/services/checkout.service'

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxSpinnerModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder)
  private cartService = inject(CartService)
  private checkoutService = inject(CheckoutService)
  private spinner = inject(NgxSpinnerService)
  private router = inject(Router)

  cart = signal<Cart | null>(null)
  checkoutForm!: FormGroup
  isProcessing = signal(false)
  orderPlaced = signal(false)

  ngOnInit() {
    this.initForm()
    this.loadCart()
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      // Shipping Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,}$/)]],
      country: ['', [Validators.required]],

      // Payment Information
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],

      // Additional
      agreeTerms: [false, [Validators.requiredTrue]],
    })
  }

  loadCart() {
    this.spinner.show()
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart.set(res.data)
        this.spinner.hide()
      },
      error: () => {
        this.spinner.hide()
        this.router.navigate(['/cart'])
      },
    })
  }

  submitOrder() {
    if (!this.checkoutForm.valid || !this.cart()) {
      return
    }

    this.isProcessing.set(true)
    this.spinner.show()

    // Prepare shipping address in the format expected by backend
    const shippingAddress = {
      street: this.checkoutForm.get('address')?.value,
      city: this.checkoutForm.get('city')?.value,
      zipCode: this.checkoutForm.get('zipCode')?.value,
    }

    // Call the checkout service to create a payment intent
    this.checkoutService.createPaymentIntent(shippingAddress).subscribe({
      next: (res) => {
        if (res.success) {
          this.orderPlaced.set(true)
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
