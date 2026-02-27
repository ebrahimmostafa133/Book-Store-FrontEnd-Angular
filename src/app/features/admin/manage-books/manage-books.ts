import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Author} from '../../../core/interfaces/author.interface'
import type {Book} from '../../../core/interfaces/book.interface'
import type {Category} from '../../../core/interfaces/category.interface'
import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {NgxPaginationModule} from 'ngx-pagination'
import {ToastrService} from 'ngx-toastr'
import {AuthorsService} from '../../../core/services/authors.service'
import {BooksService} from '../../../core/services/books.service'
import {CategoriesService} from '../../../core/services/categories.service'

@Component({
  selector: 'app-manage-books',
  imports: [ReactiveFormsModule, NgxPaginationModule],
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

  books = signal<Book[]>([])
  authors = signal<Author[]>([])
  categories = signal<Category[]>([])
  currentPage = signal(1)
  totalItems = signal(0)
  itemsPerPage = 10

  displayBooks = computed(() => {
    const total = this.totalItems()
    const current = this.books()
    const page = this.currentPage()
    const size = this.itemsPerPage

    const arr = Array.from<Book | null>({length: total}).fill(null)
    const start = (page - 1) * size

    for (let i = 0; i < current.length; i++) {
      if (start + i < total) {
        arr[start + i] = current[i]
      }
    }
    return arr
  })

  bookForm: FormGroup
  isModalOpen = false
  editingBookId: string | null = null
  isLoading = false
  previewImage: string | null = null
  selectedFile: File | null = null

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

    this.booksService.getAllBooks(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.books.set(res.data || res)
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading books')
        this.isLoading = false
        this.cdr.detectChanges()
      },
    })

    this.booksService.getCount().subscribe({
      next: (res: any) => {
        this.totalItems.set(res.data)
        this.cdr.detectChanges()
      },
      error: (_err) => {
        console.error('Error loading books count')
      },
    })

    this.authorsService.getAllAuthors().subscribe({
      next: (res: any) => {
        this.authors.set(res.data || res)
        this.cdr.detectChanges()
      },
      error: (_err) => { this.toastr.error('Error loading authors') },
    })

    this.categoriesService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories.set(res.data || res)
        this.cdr.detectChanges()
      },
      error: (_err) => { this.toastr.error('Error loading categories') },
    })
  }

  openModal(book?: Book) {
    this.isModalOpen = true
    if (book) {
      this.editingBookId = book.id
      const authorId = book.author.id
      const categoryId = book.category.id

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
      this.selectedFile = null
    }
  }

  closeModal() {
    this.isModalOpen = false
    this.editingBookId = null
    this.bookForm.reset()
    this.previewImage = null
    this.selectedFile = null
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      this.previewImage = URL.createObjectURL(file)
      this.bookForm.patchValue({bookCover: file.name})
      this.bookForm.get('bookCover')?.markAsTouched()
      this.bookForm.get('bookCover')?.markAsDirty()
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) { return }

    this.isLoading = true
    const formData = new FormData()
    const formValues = this.bookForm.value

    Object.keys(formValues).forEach((key) => {
      if (key !== 'bookCover') {
        formData.append(key, formValues[key])
      }
    })

    if (this.selectedFile) {
      formData.append('bookCover', this.selectedFile)
    }

    console.log('Book submission request data (FormData):', formData)

    if (this.editingBookId) {
      this.booksService.updateBook(this.editingBookId, formData).subscribe({
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
      this.booksService.addBook(formData).subscribe({
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
          this.books.update(books => books.filter(b => b.id !== id))
          this.totalItems.update(count => count - 1)
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error deleting book')
        },
      })
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page)
    this.loadData()
  }
}
