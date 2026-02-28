import type {Author} from '../interfaces/author.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private apiUrl = `${environment.baseUrl}/author`
  private readonly httpClient = inject(HttpClient)

  getAllAuthors(page: number = 1, limit: number = 12) {
    return this.httpClient.get<{data: Author[]}>(`${this.apiUrl}?page=${page}&limit=${limit}`)
  }

  getCount() {
    return this.httpClient.get<{data: number}>(`${this.apiUrl}/count`)
  }

  getAuthorById(id: string) {
    return this.httpClient.get<{data: Author}>(`${this.apiUrl}/${id}`)
  }

  addAuthor(author: Partial<Author>) {
    return this.httpClient.post<{data: Author}>(this.apiUrl, author)
  }

  updateAuthor(id: string, author: Partial<Author>) {
    return this.httpClient.patch<{data: Author}>(`${this.apiUrl}/${id}`, author)
  }

  deleteAuthor(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
