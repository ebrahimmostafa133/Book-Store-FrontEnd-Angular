import type {OnInit} from '@angular/core'
import {isPlatformBrowser} from '@angular/common'
import {ChangeDetectorRef, Component, inject, PLATFORM_ID} from '@angular/core'
import {forkJoin, of} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {AuthorsService} from '../../../core/services/authors.service'
import {BooksService} from '../../../core/services/books.service'
import {CategoriesService} from '../../../core/services/categories.service'
import {OrdersService} from '../../../core/services/orders.service'

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private booksService = inject(BooksService)
  private authorsService = inject(AuthorsService)
  private categoriesService = inject(CategoriesService)
  private ordersService = inject(OrdersService)
  private platformId = inject(PLATFORM_ID)
  private cdr = inject(ChangeDetectorRef)

  stats = {
    books: 0,
    authors: 0,
    categories: 0,
    orders: 0,
  }

  isLoading = false

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoading = true
      forkJoin({
        books: this.booksService.getAllBooks().pipe(catchError(() => of({data: []}))),
        authors: this.authorsService.getAllAuthors().pipe(catchError(() => of({data: []}))),
        categories: this.categoriesService.getAllCategories().pipe(catchError(() => of({data: []}))),
        orders: this.ordersService.getAllOrders().pipe(catchError(() => of({data: []}))),
      }).subscribe({
        next: (res: any) => {
          console.log('Dashboard stats loaded:', res)
          this.stats.books = res.books?.data?.length || res.books?.length || 0
          this.stats.authors = res.authors?.data?.length || res.authors?.length || 0
          this.stats.categories = res.categories?.data?.length || res.categories?.length || 0
          this.stats.orders = res.orders?.data?.length || res.orders?.length || 0
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Dashboard forkJoin error:', err)
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    }
  }
}
