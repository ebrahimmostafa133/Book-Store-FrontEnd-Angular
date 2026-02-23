import type {OnInit} from '@angular/core'
import type {Book} from '../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {BooksService} from '../../core/services/books.service'

@Component({
  selector: 'app-books',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  private readonly booksService = inject(BooksService)

  books = signal<Book[]>([])
  currentPage = signal(1)
  itemsPerPage = 16
  isLoading = signal(true)

  totalPages = signal(1)

  ngOnInit(): void {
    this.loadBooks()
  }

  loadBooks(): void {
    this.isLoading.set(true)
    this.booksService.getAllBooks(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.books.set(res.data)

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
        console.error(err)
        this.isLoading.set(false)
      },
    })
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page)
      this.loadBooks()
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
