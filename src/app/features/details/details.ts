import type {OnInit} from '@angular/core'
import type {Book} from '../../core/interfaces/book.interface'
import type {Review} from '../../core/interfaces/review.interface'

import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {ToastrService} from 'ngx-toastr'

import {AuthService} from '../../core/services/auth.service'
import {BooksService} from '../../core/services/books.service'
import {CartService} from '../../core/services/cart.service'

import {ReviewService} from '../../core/services/review.service'
import {ConfirmationModal} from '../../shared/components/confirmation-modal/confirmation-modal.component'

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, ConfirmationModal],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly booksService = inject(BooksService)
  private readonly cartService = inject(CartService)
  private readonly reviewService = inject(ReviewService)
  private readonly authService = inject(AuthService)
  private readonly toastr = inject(ToastrService)

  book = signal<Book | null>(null)
  isLoading = signal(true)

  isInCart = computed(() => {
    const bookId = this.book()?.id
    const items = this.cartService.cart()?.items || []
    return items.some(item => item.book.id === bookId)
  })

  reviews = signal<Review[]>([])
  isAdmin = computed(() => this.authService.userRole === 'admin')
  isEditing = signal(false)
  editingReviewId = signal<string | null>(null)

  // Modal State
  isDeleteModalOpen = signal(false)
  reviewToDeleteId = signal<string | null>(null)

  private readonly fb = inject(FormBuilder)
  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  })

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.booksService.getBookById(id).subscribe({
        next: (res: {data: Book}) => {
          this.book.set(res.data)
          this.isLoading.set(false)

          if (res.data?.reviews) {
            this.reviews.set(res.data.reviews)
          }
        },
        error: (err: any) => {
          console.error('Error fetching book details', err)
          this.isLoading.set(false)
        },
      })
    } else {
      this.isLoading.set(false)
    }

    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe()
    }
  }

  canEdit(review: Review): boolean {
    return this.authService.userId === review.user.id
  }

  canDelete(review: Review): boolean {
    return this.authService.userId === review.user.id
  }

  startEdit(review: Review): void {
    this.isEditing.set(true)
    this.editingReviewId.set(review.id)
    this.reviewForm.patchValue({
      rating: review.rating,
      comment: review.comment || '',
    })
    // Scroll to form
    const formElement = document.getElementById('review-form')
    formElement?.scrollIntoView({behavior: 'smooth'})
  }

  cancelEdit(): void {
    this.isEditing.set(false)
    this.editingReviewId.set(null)
    this.reviewForm.reset({rating: 5, comment: ''})
  }

  submitReview(): void {
    const currentBook = this.book()
    if (this.reviewForm.valid && currentBook) {
      const reviewData = {
        rating: this.reviewForm.value.rating ?? 5,
        comment: this.reviewForm.value.comment ?? '',
      }

      const bookId = currentBook.id

      if (this.isEditing() && this.editingReviewId()) {
        this.reviewService.updateReview(this.editingReviewId()!, reviewData).subscribe({
          next: (res: {data: Review}) => {
            this.toastr.success('Review updated successfully!')
            this.reviews.update(prev => prev.map(r => r.id === res.data.id ? res.data : r))
            this.cancelEdit()
            this.refreshBookStats(bookId)
          },
          error: (err: any) => {
            this.toastr.error(err.error?.message || 'Failed to update review.')
          },
        })
      } else {
        this.reviewService.createReview({...reviewData, book: bookId}).subscribe({
          next: (res: {data: Review}) => {
            this.toastr.success('Review submitted successfully!')
            this.reviews.update(prev => [res.data, ...prev])
            this.reviewForm.reset({rating: 5, comment: ''})
            this.refreshBookStats(bookId)
          },
          error: (err: any) => {
            this.toastr.error(err.error?.message || 'Failed to submit review.')
          },
        })
      }
    }
  }

  private refreshBookStats(bookId: string): void {
    this.booksService.getBookById(bookId).subscribe((refreshRes: {data: Book}) => {
      this.book.set(refreshRes.data)
    })
  }

  deleteReview(reviewId: string): void {
    this.reviewToDeleteId.set(reviewId)
    this.isDeleteModalOpen.set(true)
  }

  confirmDelete(): void {
    const reviewId = this.reviewToDeleteId()
    if (!reviewId) { return }

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.toastr.success('Review deleted successfully!')
        this.reviews.update(prev => prev.filter(r => r.id !== reviewId))
        const currentBook = this.book()
        if (currentBook) {
          this.refreshBookStats(currentBook.id)
        }
        this.closeDeleteModal()
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to delete review.')
        this.closeDeleteModal()
      },
    })
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false)
    this.reviewToDeleteId.set(null)
  }

  addToCart(bookId: string): void {
    const currentBook = this.book()
    if (currentBook && currentBook.stock === 0) {
      this.toastr.error('This book is currently out of stock.')
      return
    }
    this.cartService.addToCart(bookId, 1)
    this.toastr.success('Book added to cart successfully!')
  }
}
