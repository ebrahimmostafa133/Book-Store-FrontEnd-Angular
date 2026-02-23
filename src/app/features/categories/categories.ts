import type {OnInit} from '@angular/core'
import type {Category} from '../../core/interfaces/category.interface'
import {Component, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {CategoriesService} from '../../core/services/categories.service'

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService)
  
  categories = signal<Category[]>([])
  isLoading = signal(true)

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching categories', err)
        this.isLoading.set(false)
      },
    })
  }
}
