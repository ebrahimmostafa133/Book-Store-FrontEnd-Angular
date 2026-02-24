import type {OnInit} from '@angular/core'
import type {Book} from '../../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
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
  isLoading = signal(true)

  authorId = signal<string>('')

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.authorId.set(id)
        this.loadBooks()
      }
    })
  }

  loadBooks(): void {
    this.isLoading.set(true)
    // Fetch up to 100 items to ensure all are shown
    this.booksService.filterBooksByAuthor(this.authorId(), 1, 100).subscribe({
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
