import type {Category} from '../interfaces/category.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.baseUrl}/category`
  private readonly httpClient = inject(HttpClient)

  getAllCategories(page: number = 1, limit: number = 12) {
    return this.httpClient.get<{data: Category[]}>(`${this.apiUrl}?page=${page}&limit=${limit}`)
  }

  getCount() {
    return this.httpClient.get<{data: number}>(`${this.apiUrl}/count`)
  }

  getCategoryById(id: string) {
    return this.httpClient.get<{data: Category}>(`${this.apiUrl}/${id}`)
  }

  addCategory(category: Partial<Category>) {
    return this.httpClient.post<{data: Category}>(this.apiUrl, category)
  }

  updateCategory(id: string, category: Partial<Category>) {
    return this.httpClient.patch<{data: Category}>(`${this.apiUrl}/${id}`, category)
  }

  deleteCategory(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
