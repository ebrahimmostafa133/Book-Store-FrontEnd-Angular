import type {OnInit} from '@angular/core'
import {CommonModule, isPlatformBrowser} from '@angular/common'
import {Component, computed, inject, PLATFORM_ID} from '@angular/core'
import {Router, RouterModule} from '@angular/router'
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import {ToastrService} from 'ngx-toastr'
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
  private router = inject(Router)
  private toastr = inject(ToastrService)

  cart = this.cartService.cart

  cartItems = computed(() => this.cart()?.items || [])
  totalAmount = computed(() => this.cart()?.totalAmount || 0)
  isEmpty = computed(() => this.cartItems().length === 0)
  hasOutOfStockItems = computed(() => this.cartItems().some(item => item.book.stock === 0))

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart()
    }
  }

  loadCart() {
    this.spinner.show()
    this.cartService.getCart().subscribe({
      next: (_res) => {
        this.spinner.hide()
      },
      error: () => this.spinner.hide(),
    })
  }

  updateQuantity(bookId: string, currentQty: number, delta: number) {
    const newQty = currentQty + delta
    if (newQty < 1) { return }
    this.cartService.upsertToCart(bookId, newQty)
  }

  removeItem(bookId: string) {
    this.spinner.show()
    this.cartService.removeFromCart(bookId).subscribe({
      next: (_res) => {
        this.spinner.hide()
      },
      error: () => this.spinner.hide(),
    })
  }

  proceedToCheckout() {
    if (this.hasOutOfStockItems()) {
      this.toastr.error('Please remove out-of-stock items before checkout.')
      return
    }
    this.router.navigate(['/checkout'])
  }
}
