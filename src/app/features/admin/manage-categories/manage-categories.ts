import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {Category} from '../../../core/interfaces/category.interface'
import {ChangeDetectorRef, Component, inject} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ToastrService} from 'ngx-toastr'
import {CategoriesService} from '../../../core/services/categories.service'

@Component({
  selector: 'app-manage-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css',
})
export class ManageCategories implements OnInit {
  private categoriesService = inject(CategoriesService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private cdr = inject(ChangeDetectorRef)

  categories: Category[] = []
  categoryForm: FormGroup
  isModalOpen = false
  editingCategoryId: string | null = null
  isLoading = false

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
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: (_err) => {
        this.toastr.error('Error loading categories')
        this.isLoading = false
        this.cdr.detectChanges()
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
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this category?')) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          this.toastr.success('Category deleted successfully')
          this.loadCategories()
          this.cdr.detectChanges()
        },
        error: (_err) => {
          this.toastr.error('Error deleting category')
          this.cdr.detectChanges()
        },
      })
    }
  }
}
