import type {OnInit} from '@angular/core'
import type {Cart as CartInterface} from '../../core/interfaces/cart.interface'
import {CommonModule, isPlatformBrowser} from '@angular/common'
import {ChangeDetectorRef, Component, inject, PLATFORM_ID} from '@angular/core'
import {Router, RouterModule} from '@angular/router'
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import {CartService} from '../../core/services/cart.service'

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService)
  private spinner = inject(NgxSpinnerService)
  private platformId = inject(PLATFORM_ID)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)

  cart: CartInterface | null = null

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart()
    }
  }

  loadCart() {
    this.spinner.show()
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.data
        this.spinner.hide()
        this.cdr.detectChanges()
      },
      error: () => {
        this.spinner.hide()
      },
    })
  }

  updateQuantity(bookId: string, currentQty: number, delta: number) {
    const newQty = currentQty + delta
    if (newQty < 1) { return }

    this.spinner.show()
    this.cartService.upsertToCart(bookId, newQty).subscribe({
      next: (res) => {
        this.cart = res.data
        this.spinner.hide()
        this.cdr.detectChanges()
      },
    })
  }

  removeItem(bookId: string) {
    this.spinner.show()
    this.cartService.removeFromCart(bookId).subscribe({
      next: (res) => {
        this.cart = res.data
        this.spinner.hide()
        this.cdr.detectChanges()
      },
    })
  }

  proceedToCheckout() {
    // TODO, figure out checkout
    this.router.navigate(['/checkout'])
  }
}
