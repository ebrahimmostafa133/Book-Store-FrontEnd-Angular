import type {OnInit} from '@angular/core'
import type {Book} from '../../core/interfaces/book.interface'

import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {ToastrService} from 'ngx-toastr'

import {BooksService} from '../../core/services/books.service'
import {CartService} from '../../core/services/cart.service'

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly booksService = inject(BooksService)
  private readonly cartService = inject(CartService)
  private readonly toastr = inject(ToastrService)

  book = signal<Book | null>(null)
  isLoading = signal(true)

  // Mock Reviews configuration
  reviews = signal<{id: number, user: string, rating: number, comment: string, date: Date}[]>([])

  private readonly fb = inject(FormBuilder)
  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  })

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.booksService.getBookById(id).subscribe({
        next: (res) => {
          this.book.set(res.data)
          this.isLoading.set(false)

          if (res.data) {
            // Load some dummy reviews for demonstration
            this.reviews.set([
              {id: 1, user: 'Alice Smith', rating: 5, comment: 'Absolutely loved this book! Highly recommended.', date: new Date('2026-01-15T10:30:00')},
              {id: 2, user: 'John Doe', rating: 4, comment: 'Great read, though the ending felt a bit rushed.', date: new Date('2026-02-05T14:45:00')},
            ])
          }
        },
        error: (err) => {
          console.error('Error fetching book details', err)
          this.isLoading.set(false)
        },
      })
    } else {
      this.isLoading.set(false)
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.book()) {
      const newReview = {
        id: this.reviews().length + 1,
        user: 'Current User', // In a real app, this would come from an auth service
        rating: this.reviewForm.value.rating ?? 5,
        comment: this.reviewForm.value.comment ?? '',
        date: new Date(),
      }
      this.reviews.update(reviews => [newReview, ...reviews])
      this.reviewForm.reset({rating: 5, comment: ''})
    }
  }

  addToCart(bookId: string): void {
    this.cartService.upsertToCart(bookId, 1).subscribe({
      next: () => {
        this.toastr.success('Book added to cart successfully!')
      },
      error: (err) => {
        console.error('Error adding book to cart', err)
        this.toastr.error('Failed to add book to cart.')
      },
    })
  }
}
