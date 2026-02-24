import type {Book} from '../interfaces/book.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment.development'

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiUrl = `${environment.baseUrl}/book`
  private readonly httpClient = inject(HttpClient)

  getAllBooks(page: number = 1, limit: number = 16, sort?: string) {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`
    if (sort) {
      url += `&sort=${sort}`
    }
    return this.httpClient.get<{data: Book[]}>(url)
  }

  getBookById(id: string) {
    return this.httpClient.get<{data: Book}>(`${this.apiUrl}/${id}`)
  }

  addBook(book: Book) {
    return this.httpClient.post<{data: Book}>(this.apiUrl, book)
  }

  updateBook(id: string, payload: Partial<Book>) {
    return this.httpClient.patch<{data: Book}>(`${this.apiUrl}/${id}`, payload)
  }

  deleteBook(id: string) {
    return this.httpClient.delete<{data: Book}>(`${this.apiUrl}/${id}`)
  }

  searchBooks(query: string) {
    return this.httpClient.get<{data: Book[]}>(`${this.apiUrl}/search?q=${query}`)
  }

  filterBooksByCategory(categoryId: string, page: number = 1, limit: number = 16) {
    return this.httpClient.get<{data: Book[]}>(`${this.apiUrl}/category/${categoryId}?page=${page}&limit=${limit}`)
  }

  filterBooksByAuthor(authorId: string, page: number = 1, limit: number = 16) {
    return this.httpClient.get<{data: Book[]}>(`${this.apiUrl}/author/${authorId}?page=${page}&limit=${limit}`)
  }

  filterBooksByPrice(minPrice: number, maxPrice: number) {
    return this.httpClient.get<{data: Book[]}>(`${this.apiUrl}/price?min=${minPrice}&max=${maxPrice}`)
  }
}
