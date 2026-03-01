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

  bookOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 10,
    navText: ['<span class="material-symbols-outlined">chevron_left</span>', '<span class="material-symbols-outlined">chevron_right</span>'],
    responsive: {
      0: {items: 1},
      400: {items: 2},
      740: {items: 3},
      1000: {items: 4},
      1280: {items: 6},
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
  }

  private readonly booksService = inject(BooksService)
  books = signal<Book[]>([])
  books_by_newest = signal<Book[]>([])
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
        this.books_by_newest.set(
          res.data
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            .slice(0, 10),
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
