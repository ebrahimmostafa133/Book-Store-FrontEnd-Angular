import type {OnInit} from '@angular/core'
import type {OwlOptions} from 'ngx-owl-carousel-o'
import type {Book} from '../../core/interfaces/book.interface'
import {CurrencyPipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {CarouselModule} from 'ngx-owl-carousel-o'
import {BooksService} from '../../core/services/books.service'

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink, CarouselModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  mainOption: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
  }

  private readonly booksService = inject(BooksService)
  books = signal<Book[]>([])
  isLoading = signal(true)

  ngOnInit(): void {
    // Get all books, sort them by rating (highest first), and keep only the top 8 for the "Trending" section
    this.booksService.getAllBooks().subscribe({
      next: (res) => {
        this.books.set(
          res.data
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 8),
        )
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching trending books', err)
        this.isLoading.set(false)
      },
    })
  }
}
