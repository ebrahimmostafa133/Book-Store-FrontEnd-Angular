import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Author} from '../../../core/interfaces/author.interface'
import {ChangeDetectorRef, Component, inject} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ToastrService} from 'ngx-toastr'
import {AuthorsService} from '../../../core/services/authors.service'

@Component({
  selector: 'app-manage-authors',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-authors.html',
  styleUrl: './manage-authors.css',
})
export class ManageAuthors implements OnInit {
  private authorsService = inject(AuthorsService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  authors: Author[] = []
  authorForm: FormGroup
  isModalOpen = false
  editingAuthorId: string | null = null
  isLoading = false

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
    this.authorsService.getAllAuthors().subscribe({
      next: (res) => {
        this.authors = res.data
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading authors')
        this.isLoading = false
        this.cdr.detectChanges()
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
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this author?')) {
      this.authorsService.deleteAuthor(id).subscribe({
        next: () => {
          this.toastr.success('Author deleted successfully')
          this.loadAuthors()
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error deleting author')
          this.cdr.detectChanges()
        },
      })
    }
  }
}
