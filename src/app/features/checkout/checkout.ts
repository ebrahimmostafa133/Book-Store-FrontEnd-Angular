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
import {OrdersService} from '../../core/services/orders.service'
import {UserService} from '../../core/services/user.service'

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
  private ordersService = inject(OrdersService)
  private userService = inject(UserService)
  private spinner = inject(NgxSpinnerService)
  private router = inject(Router)

  cart = signal<Cart | null>(null)
  checkoutForm!: FormGroup
  isProcessing = signal(false)
  orderPlaced = signal(false)

  ngOnInit() {
    this.initForm()
    this.loadCart()
    this.loadUserProfile()
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.checkoutForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
          })
        }
      },
      error: (err) => {
        console.error('Failed to load user profile for checkout auto-fill', err)
      },
    })
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      // Shipping Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],

      // Payment Selection
      paymentMethod: ['COD', [Validators.required]],

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

    // Prepare shipping address
    const shippingAddress = {
      street: this.checkoutForm.get('address')?.value,
      phone: this.checkoutForm.get('phone')?.value,
      city: 'N/A',
      zipCode: '00000',
    }

    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value

    if (paymentMethod === 'visa') {
      this.isProcessing.set(false)
      this.spinner.hide()
      this.router.navigate(['/payment'], {state: {shippingAddress}})
      return
    }

    // Process Cash on Delivery
    this.ordersService.placeOrder(shippingAddress, 'COD').subscribe({
      next: () => {
        this.cartService.getCart().subscribe() // Refetch cart to clear numbers after the order
        this.isProcessing.set(false)
        this.spinner.hide()
        this.router.navigate(['/allorders']) // Redirecting to all orders on successful CoD
      },
      error: (err) => {
        console.error('Error placing order:', err)
        this.isProcessing.set(false)
        this.spinner.hide()
        // eslint-disable-next-line no-alert
        alert('Failed to place order. Please try again.')
      },
    })
  }

  continueShopping() {
    this.router.navigate(['/books'])
  }
}
