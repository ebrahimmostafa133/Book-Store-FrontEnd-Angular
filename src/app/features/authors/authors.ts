import type {OnInit} from '@angular/core'
import type {Author} from '../../core/interfaces/author.interface'
import {Component, computed, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {AuthorsService} from '../../core/services/authors.service'

@Component({
  selector: 'app-authors',
  imports: [RouterLink],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
})
export class Authors implements OnInit {
  private readonly authorsService = inject(AuthorsService)
  authors = signal<Author[]>([])
  currentPage = signal(1)
  itemsPerPage = 12
  totalPages = signal(1)
  isLoading = signal(true)

  ngOnInit(): void {
    this.loadAuthors()
  }

  loadAuthors(): void {
    this.isLoading.set(true)
    this.authorsService.getAllAuthors(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.authors.set(res.data)
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
        console.error('Error fetching authors', err)
        this.isLoading.set(false)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page)
      this.loadAuthors()
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
