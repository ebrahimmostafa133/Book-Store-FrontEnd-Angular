import type {OnInit} from '@angular/core'
import type {Order} from '../../../core/interfaces/order.interface'
import {CommonModule} from '@angular/common'
import {ChangeDetectorRef, Component, inject} from '@angular/core'
import {ToastrService} from 'ngx-toastr'
import {OrdersService} from '../../../core/services/orders.service'

@Component({
  selector: 'app-manage-orders',
  imports: [CommonModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  private ordersService = inject(OrdersService)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  orders: Order[] = []
  isLoading = false
  statusOptions = ['processing', 'out for delivery', 'delivered', 'cancelled']

  ngOnInit() {
    this.loadOrders()
  }

  loadOrders() {
    this.isLoading = true
    this.ordersService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || res
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading orders')
        this.isLoading = false
        this.cdr.detectChanges()
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
          this.loadOrders()
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error deleting order')
          this.cdr.detectChanges()
        },
      })
    }
  }
}
