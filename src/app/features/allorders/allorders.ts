import type {OnInit} from '@angular/core'
import type {Order} from '../../core/interfaces/order.interface'
import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {NgxPaginationModule} from 'ngx-pagination'
import {OrdersService} from '../../core/services/orders.service'

@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe, DatePipe, NgxPaginationModule],
  templateUrl: './allorders.html',
  styleUrl: './allorders.css',
})
export class Allorders implements OnInit {
  private readonly ordersService = inject(OrdersService)

  orders = signal<Order[]>([])
  selectedOrder = signal<Order | null>(null)
  isLoading = signal(true)
  currentPage = signal(1)
  totalItems = signal(0)
  itemsPerPage = 10

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.isLoading.set(true)
    this.ordersService.getMyOrders(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res) => {
        this.orders.set(res.data)
        this.totalItems.set(res.totalItems)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching orders', err)
        this.isLoading.set(false)
      },
    })
  }

  onPageChange(page: number): void {
    this.currentPage.set(page)
    this.loadOrders()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  getStatusClass(status: string): string {
    const base = 'px-2.5 py-0.5 rounded text-xs font-medium '
    switch (status.toLowerCase()) {
      case 'pending': return `${base}bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`
      case 'completed':
      case 'delivered': return `${base}bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`
      case 'cancelled': return `${base}bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
      default: return `${base}bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`
    }
  }

  openReceipt(order: Order) {
    this.selectedOrder.set(order)
  }

  closeReceipt() {
    this.selectedOrder.set(null)
  }
}
