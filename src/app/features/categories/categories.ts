import type {OnInit} from '@angular/core'
import type {Category} from '../../core/interfaces/category.interface'
import {isPlatformBrowser} from '@angular/common'
import {Component, computed, inject, PLATFORM_ID, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {NgxPaginationModule} from 'ngx-pagination'
import {CategoriesService} from '../../core/services/categories.service'

@Component({
  selector: 'app-categories',
  imports: [RouterLink, NgxPaginationModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService)
  private readonly platformId = inject(PLATFORM_ID)

  categories = signal<Category[]>([])
  currentPage = signal(1)
  itemsPerPage = 12
  totalPages = signal(1)
  totalItems = signal(0)
  isLoading = signal(true)
  searchTerm = signal('')

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase()
    if (!term) { return this.categories() }
    return this.categories().filter(cat => cat.name.toLowerCase().includes(term))
  })

  ngOnInit(): void {
    this.loadCategories()
  }

  loadCategories(): void {
    this.isLoading.set(true)
    this.categoriesService.getAllCategories(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.categories.set(res.data)
        if (res.metadata?.numberOfPages) {
          this.totalPages.set(res.metadata.numberOfPages)
        } else if (res.paginationResult?.numberOfPages) {
          this.totalPages.set(res.paginationResult.numberOfPages)
        } else {
          const isFullPage = res.data.length === this.itemsPerPage
          this.totalPages.set(isFullPage ? this.currentPage() + 1 : this.currentPage())
        }

        const totalItemsCalc = res.metadata?.totalItems ?? res.paginationResult?.totalItems ?? res.totalItems
        const total = totalItemsCalc || (this.totalPages() * this.itemsPerPage)
        this.totalItems.set(total)

        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching categories', err)
        this.isLoading.set(false)
      },
    })
  }

  goToPage(page: number): void {
    this.currentPage.set(page)
    this.loadCategories()
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }
}
