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

  getAllAuthors() {
    return this.httpClient.get<{data: Author[]}>(this.apiUrl)
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
