import type {OnInit} from '@angular/core'
import type {Category} from '../../core/interfaces/category.interface'
import {Component, computed, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {CategoriesService} from '../../core/services/categories.service'

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService)

  categories = signal<Category[]>([])
  currentPage = signal(1)
  itemsPerPage = 12
  totalPages = signal(1)
  isLoading = signal(true)

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
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching categories', err)
        this.isLoading.set(false)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page)
      this.loadCategories()
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  pagesArray = computed(() =>
    Array.from({length: this.totalPages()}, (_, i) => i + 1),
  )

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1)
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1)
    }
  }
}
