import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Author} from '../../../core/interfaces/author.interface'
import type {Book} from '../../../core/interfaces/book.interface'
import type {Category} from '../../../core/interfaces/category.interface'
import {ChangeDetectorRef, Component, inject} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ToastrService} from 'ngx-toastr'
import {AuthorsService} from '../../../core/services/authors.service'
import {BooksService} from '../../../core/services/books.service'
import {CategoriesService} from '../../../core/services/categories.service'

@Component({
  selector: 'app-manage-books',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-books.html',
  styleUrl: './manage-books.css',
})
export class ManageBooks implements OnInit {
  private booksService = inject(BooksService)
  private authorsService = inject(AuthorsService)
  private categoriesService = inject(CategoriesService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  books: Book[] = []
  authors: Author[] = []
  categories: Category[] = []

  bookForm: FormGroup
  isModalOpen = false
  editingBookId: string | null = null
  isLoading = false
  previewImage: string | null = null

  constructor() {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      description: [''],
      bookCover: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.isLoading = true

    this.booksService.getAllBooks().subscribe({
      next: (res: any) => {
        this.books = res.data || res
        this.isLoading = false
      },
      error: (_err) => {
        this.toastr.error('Error loading books')
        this.isLoading = false
      },
    })

    this.authorsService.getAllAuthors().subscribe({
      next: (res) => { this.authors = res.data },
      error: (_err) => { this.toastr.error('Error loading authors') },
    })

    this.categoriesService.getAllCategories().subscribe({
      next: (res) => { this.categories = res.data },
      error: (_err) => { this.toastr.error('Error loading categories') },
    })
  }

  getAuthorName(authorId: any): string {
    if (typeof authorId === 'object' && authorId?.name) { return authorId.name }
    const author = this.authors.find(a => a.id === authorId)
    return author ? author.name : 'Unknown Author'
  }

  getCategoryName(categoryId: any): string {
    if (typeof categoryId === 'object' && categoryId?.name) { return categoryId.name }
    const cat = this.categories.find(c => c.id === categoryId)
    return cat ? cat.name : 'Unknown Category'
  }

  openModal(book?: Book) {
    this.isModalOpen = true
    if (book) {
      this.editingBookId = book.id
      const authorId = typeof book.author === 'object' ? (book.author as any).id : book.author
      const categoryId = typeof book.category === 'object' ? (book.category as any).id : book.category

      this.bookForm.patchValue({
        name: book.name || (book as any).title,
        author: authorId,
        category: categoryId,
        price: book.price,
        stock: book.stock,
        description: book.description,
        bookCover: book.bookCover || (book as any).imageUrl,
      })
      this.previewImage = book.bookCover || (book as any).imageUrl
    } else {
      this.editingBookId = null
      this.bookForm.reset({stock: 1, price: 0})
      this.previewImage = null
    }
  }

  closeModal() {
    this.isModalOpen = false
    this.editingBookId = null
    this.bookForm.reset()
    this.previewImage = null
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // In a standard web browser, `file.path` is blocked for security.
      // However, Electron and some environments expose `file.path`.
      // If `file.path` doesn't exist, we fall back to the raw file name.
      const filePath = file.path || `/home/benzema/Desktop/${file.name}`

      this.previewImage = URL.createObjectURL(file)
      this.bookForm.patchValue({bookCover: filePath})
      this.bookForm.get('bookCover')?.markAsTouched()
      this.bookForm.get('bookCover')?.markAsDirty()
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) { return }

    this.isLoading = true
    const bookData = this.bookForm.value
    console.log('Book submission request data:', bookData)

    if (this.editingBookId) {
      this.booksService.updateBook(this.editingBookId, bookData).subscribe({
        next: () => {
          this.toastr.success('Book updated successfully')
          this.closeModal()
          this.loadData()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error updating book')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    } else {
      this.booksService.addBook(bookData).subscribe({
        next: () => {
          this.toastr.success('Book added successfully')
          this.closeModal()
          this.loadData()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error adding book')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    }
  }

  deleteBook(id: string) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this book?')) {
      this.booksService.deleteBook(id).subscribe({
        next: () => {
          this.toastr.success('Book deleted successfully')
          this.loadData()
        },
        error: (_err) => {
          this.toastr.error('Error deleting book')
        },
      })
    }
  }
}
