import type {Observable} from 'rxjs'
import type {UserProfile} from '../interfaces/user.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.baseUrl}/user/me`
  private readonly httpClient = inject(HttpClient)

  getUserProfile(): Observable<{data: UserProfile}> {
    return this.httpClient.get<{data: UserProfile}>(this.apiUrl)
  }

  updateUserProfile(userData: Partial<UserProfile>): Observable<{data: UserProfile}> {
    return this.httpClient.patch<{data: UserProfile}>(this.apiUrl, userData)
  }
}
