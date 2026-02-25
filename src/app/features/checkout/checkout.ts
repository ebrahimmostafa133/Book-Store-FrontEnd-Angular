import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Cart} from '../../core/interfaces/cart.interface'
import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router, RouterModule} from '@angular/router'
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import {CartService} from '../../core/services/cart.service'

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

    const orderPayload = {
      shippingInfo: {
        firstName: this.checkoutForm.get('firstName')?.value,
        lastName: this.checkoutForm.get('lastName')?.value,
        email: this.checkoutForm.get('email')?.value,
        phone: this.checkoutForm.get('phone')?.value,
        address: this.checkoutForm.get('address')?.value,
        city: this.checkoutForm.get('city')?.value,
        state: this.checkoutForm.get('state')?.value,
        zipCode: this.checkoutForm.get('zipCode')?.value,
        country: this.checkoutForm.get('country')?.value,
      },
      paymentInfo: {
        cardholderName: this.checkoutForm.get('cardholderName')?.value,
        cardNumber: this.checkoutForm.get('cardNumber')?.value,
        expiryDate: this.checkoutForm.get('expiryDate')?.value,
        cvv: this.checkoutForm.get('cvv')?.value,
      },
      cartId: this.cart()?.id,
      totalAmount: this.cart()?.totalAmount,
    }

    // TODO: Replace with actual API call
    // this.checkoutService.placeOrder(orderPayload).subscribe({
    //   next: (res) => {
    //     this.orderPlaced.set(true)
    //     this.isProcessing.set(false)
    //     this.spinner.hide()
    //   },
    //   error: () => {
    //     this.isProcessing.set(false)
    //     this.spinner.hide()
    //   },
    // })

    // Mock success for demo
    setTimeout(() => {
      this.orderPlaced.set(true)
      this.isProcessing.set(false)
      this.spinner.hide()
    }, 2000)
  }

  continueShopping() {
    this.router.navigate(['/books'])
  }
}
