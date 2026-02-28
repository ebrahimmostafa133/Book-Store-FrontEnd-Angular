import type {OnInit} from '@angular/core'
import type {Book} from '../../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {BooksService} from '../../../core/services/books.service'

@Component({
  selector: 'app-categories-books',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './categories-books.html',
  styleUrl: './categories-books.css',
})
export class CategoriesBooks implements OnInit {
  private readonly booksService = inject(BooksService)
  private readonly route = inject(ActivatedRoute)

  books = signal<Book[]>([])
  isLoading = signal(true)

  categoryId = signal<string>('')

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.categoryId.set(id)
        this.loadBooks()
      }
    })
  }

  loadBooks(): void {
    this.isLoading.set(true)
    // Fetch up to 100 items to ensure all are shown
    this.booksService.filterBooksByCategory(this.categoryId(), 1, 100).subscribe({
      next: (res: any) => {
        this.books.set(res.data || res)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error(err)
        this.isLoading.set(false)
      },
    })
  }
}
