import type {OnInit} from '@angular/core'
import type {Book} from '../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {RouterLink} from '@angular/router'
import {BooksService} from '../../core/services/books.service'

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly booksService = inject(BooksService)
  books: Book[] = []

  ngOnInit(): void {
    // Get all books, sort them by rating (highest first), and keep only the top 8 for the "Trending" section
    this.books = this.booksService.getBooks()
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 8)
  }
}
