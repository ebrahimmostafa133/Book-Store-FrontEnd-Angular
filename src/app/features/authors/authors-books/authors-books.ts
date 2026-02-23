import type {OnInit} from '@angular/core'
import type {Book} from '../../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {BooksService} from '../../../core/services/books.service'

@Component({
  selector: 'app-authors-books',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './authors-books.html',
  styleUrl: './authors-books.css',
})
export class AuthorsBooks implements OnInit {
  private readonly booksService = inject(BooksService)
  private readonly route = inject(ActivatedRoute)

  books = signal<Book[]>([])
  currentPage = signal(1)
  itemsPerPage = 16
  isLoading = signal(true)

  authorId = signal<string>('')
  totalPages = signal(1)

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.authorId.set(id)
        this.currentPage.set(1)
        this.loadBooks()
      }
    })
  }

  loadBooks(): void {
    this.isLoading.set(true)
    this.booksService.filterBooksByAuthor(this.authorId(), this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.books.set(res.data || res)
        if (res.metadata?.numberOfPages) {
          this.totalPages.set(res.metadata.numberOfPages)
        } else if (res.paginationResult?.numberOfPages) {
          this.totalPages.set(res.paginationResult.numberOfPages)
        } else {
          const fetchedData = res.data || res
          const isFullPage = fetchedData.length === this.itemsPerPage
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
