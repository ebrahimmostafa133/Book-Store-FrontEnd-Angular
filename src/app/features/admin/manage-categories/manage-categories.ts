import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Category} from '../../../core/interfaces/category.interface'
import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {NgxPaginationModule} from 'ngx-pagination'
import {ToastrService} from 'ngx-toastr'
import {CategoriesService} from '../../../core/services/categories.service'
import {ConfirmationModal} from '../../../shared/components/confirmation-modal/confirmation-modal.component'

@Component({
  selector: 'app-manage-categories',
  imports: [ReactiveFormsModule, NgxPaginationModule, ConfirmationModal],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css',
})
export class ManageCategories implements OnInit {
  private categoriesService = inject(CategoriesService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  categories = signal<Category[]>([])
  categoryForm: FormGroup
  isModalOpen = false
  editingCategoryId: string | null = null
  isLoading = false
  currentPage = signal(1)
  totalItems = signal(0)
  itemsPerPage = 10

  isConfirmModalOpen = signal(false)
  categoryToDeleteId: string | null = null

  displayCategories = computed(() => {
    const total = this.totalItems()
    const current = this.categories()
    const page = this.currentPage()
    const size = this.itemsPerPage

    const arr = Array.from<Category | null>({length: total}).fill(null)
    const start = (page - 1) * size

    for (let i = 0; i < current.length; i++) {
      if (start + i < total) {
        arr[start + i] = current[i]
      }
    }
    return arr
  })

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    })
  }

  ngOnInit() {
    this.loadCategories()
  }

  loadCategories() {
    this.isLoading = true
    this.categoriesService.getAllCategories(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.categories.set(res.data)
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading categories')
        this.isLoading = false
        this.cdr.detectChanges()
      },
    })

    this.categoriesService.getCount().subscribe({
      next: (res: any) => {
        this.totalItems.set(res.data)
        this.cdr.detectChanges()
      },
      error: (_err) => {
        console.error('Error loading categories count')
      },
    })
  }

  openModal(category?: Category) {
    this.isModalOpen = true
    if (category) {
      this.editingCategoryId = category.id
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description,
      })
    } else {
      this.editingCategoryId = null
      this.categoryForm.reset()
    }
  }

  closeModal() {
    this.isModalOpen = false
    this.editingCategoryId = null
    this.categoryForm.reset()
  }

  onSubmit() {
    if (this.categoryForm.invalid) { return }

    this.isLoading = true
    const categoryData: Partial<Category> = this.categoryForm.value

    if (this.editingCategoryId) {
      this.categoriesService.updateCategory(this.editingCategoryId, categoryData).subscribe({
        next: () => {
          this.toastr.success('Category updated successfully')
          this.loadCategories()
          this.closeModal()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error updating category')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    } else {
      this.categoriesService.addCategory(categoryData).subscribe({
        next: () => {
          this.toastr.success('Category added successfully')
          this.loadCategories()
          this.closeModal()
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error adding category')
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    }
  }

  deleteCategory(id: string) {
    this.categoryToDeleteId = id
    this.isConfirmModalOpen.set(true)
  }

  confirmDelete() {
    if (!this.categoryToDeleteId) {
      return
    }

    this.categoriesService.deleteCategory(this.categoryToDeleteId).subscribe({
      next: () => {
        this.toastr.success('Category deleted successfully')
        this.categories.update(cats => cats.filter(c => c.id !== this.categoryToDeleteId))
        this.totalItems.update(count => count - 1)
        this.cancelDelete()
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error deleting category')
        this.cdr.detectChanges()
      },
    })
  }

  cancelDelete() {
    this.isConfirmModalOpen.set(false)
    this.categoryToDeleteId = null
  }

  onPageChange(page: number) {
    this.currentPage.set(page)
    this.loadCategories()
  }
}
