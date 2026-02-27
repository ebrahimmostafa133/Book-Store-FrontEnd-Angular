import type {OnInit} from '@angular/core'
import type {Order} from '../../../core/interfaces/order.interface'
import {CommonModule} from '@angular/common'
import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {NgxPaginationModule} from 'ngx-pagination'
import {ToastrService} from 'ngx-toastr'
import {OrdersService} from '../../../core/services/orders.service'

@Component({
  selector: 'app-manage-orders',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  private ordersService = inject(OrdersService)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  orders = signal<Order[]>([])
  isLoading = false
  statusOptions = ['processing', 'out for delivery', 'delivered', 'cancelled']
  currentPage = signal(1)
  totalItems = signal(0)
  itemsPerPage = 10

  displayOrders = computed(() => {
    const total = this.totalItems()
    const current = this.orders()
    const page = this.currentPage()
    const size = this.itemsPerPage

    const arr = Array.from<Order | null>({length: total}).fill(null)
    const start = (page - 1) * size

    for (let i = 0; i < current.length; i++) {
      if (start + i < total) {
        arr[start + i] = current[i]
      }
    }
    return arr
  })

  ngOnInit() {
    this.loadOrders()
  }

  loadOrders() {
    this.isLoading = true
    this.ordersService.getAllOrders(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.orders.set(res.data || res)
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading orders')
        this.isLoading = false
        this.cdr.detectChanges()
      },
    })

    this.ordersService.getCount().subscribe({
      next: (res: any) => {
        this.totalItems.set(res.data)
        this.cdr.detectChanges()
      },
      error: (_err) => {
        console.error('Error loading orders count')
      },
    })
  }

  updateStatus(orderId: string, event: Event) {
    const select = event.target as HTMLSelectElement
    const status = select.value

    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastr.success(`Order status updated to ${status}`)
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error updating order status')
        this.loadOrders()
        this.cdr.detectChanges()
      },
    })
  }

  deleteOrder(id: string) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this order?')) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => {
          this.toastr.success('Order deleted successfully')
          this.orders.update(orders => orders.filter(o => o.id !== id))
          this.totalItems.update(count => count - 1)
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error deleting order')
          this.cdr.detectChanges()
        },
      })
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page)
    this.loadOrders()
  }
}
