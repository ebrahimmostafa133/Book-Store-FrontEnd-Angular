import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Author} from '../../../core/interfaces/author.interface'
import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {NgxPaginationModule} from 'ngx-pagination'
import {ToastrService} from 'ngx-toastr'
import {AuthorsService} from '../../../core/services/authors.service'
import {ConfirmationModal} from '../../../shared/components/confirmation-modal/confirmation-modal.component'

@Component({
  selector: 'app-manage-authors',
  imports: [ReactiveFormsModule, NgxPaginationModule, ConfirmationModal],
  templateUrl: './manage-authors.html',
  styleUrl: './manage-authors.css',
})
export class ManageAuthors implements OnInit {
  private authorsService = inject(AuthorsService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  authors = signal<Author[]>([])
  authorForm: FormGroup
  isModalOpen = false
  editingAuthorId: string | null = null
  isLoading = false
  currentPage = signal(1)
  totalItems = signal(0)
  itemsPerPage = 10

  isConfirmModalOpen = signal(false)
  authorToDeleteId: string | null = null

  displayAuthors = computed(() => {
    const total = this.totalItems()
    const current = this.authors()
    const page = this.currentPage()
    const size = this.itemsPerPage

    const arr = Array.from<Author | null>({length: total}).fill(null)
    const start = (page - 1) * size

    for (let i = 0; i < current.length; i++) {
      if (start + i < total) {
        arr[start + i] = current[i]
      }
    }
    return arr
  })

  constructor() {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.loadAuthors()
  }

  loadAuthors() {
    this.isLoading = true
    this.authorsService.getAllAuthors(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.authors.set(res.data)
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading authors')
        this.isLoading = false
        this.cdr.detectChanges()
      },
    })

    this.authorsService.getCount().subscribe({
      next: (res: any) => {
        this.totalItems.set(res.data)
        this.cdr.detectChanges()
      },
      error: (_err) => {
        console.error('Error loading authors count')
      },
    })
  }

  openModal(author?: Author) {
    this.isModalOpen = true
    if (author) {
      this.editingAuthorId = author.id
      this.authorForm.patchValue({
        name: author.name,
        bio: author.bio,
      })
    } else {
      this.editingAuthorId = null
      this.authorForm.reset()
    }
  }

  closeModal() {
    this.isModalOpen = false
    this.editingAuthorId = null
    this.authorForm.reset()
  }

  onSubmit() {
    if (this.authorForm.invalid) { return }

    this.isLoading = true
    const authorData: Partial<Author> = this.authorForm.value

    if (this.editingAuthorId) {
      this.authorsService.updateAuthor(this.editingAuthorId, authorData).subscribe({
        next: () => {
          this.toastr.success('Author updated successfully')
          this.loadAuthors()
          this.closeModal()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error updating author')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    } else {
      this.authorsService.addAuthor(authorData).subscribe({
        next: () => {
          this.toastr.success('Author added successfully')
          this.loadAuthors()
          this.closeModal()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error adding author')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    }
  }

  deleteAuthor(id: string) {
    this.authorToDeleteId = id
    this.isConfirmModalOpen.set(true)
  }

  confirmDelete() {
    if (!this.authorToDeleteId) {
      return
    }

    this.authorsService.deleteAuthor(this.authorToDeleteId).subscribe({
      next: () => {
        this.toastr.success('Author deleted successfully')
        this.authors.update(authors => authors.filter(a => a.id !== this.authorToDeleteId))
        this.totalItems.update(count => count - 1)
        this.cancelDelete()
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error deleting author')
        this.cdr.detectChanges()
      },
    })
  }

  cancelDelete() {
    this.isConfirmModalOpen.set(false)
    this.authorToDeleteId = null
  }

  onPageChange(page: number) {
    this.currentPage.set(page)
    this.loadAuthors()
  }
}
