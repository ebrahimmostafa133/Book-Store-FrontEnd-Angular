import {HttpClient} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {Router} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
import {tap} from 'rxjs'
import {environment} from '../../../environments/environment'

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private cookieService = inject(CookieService)
  private apiUrl = `${environment.baseUrl}/user`

  currentUser = signal<any | null>(null)

  handleAuthSuccess(token: string) {
    // currently set to expire in one day
    this.cookieService.set('token', token, 1, '/')
    this.currentUser.set({token})
    this.router.navigate(['/home'])
  }

  login(credentials: any) {
    return this.http.post<{data: {token: string}}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res.data.token)),
    )
  }

  register(userData: any) {
    return this.http.post<{data: {token: string}}>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.handleAuthSuccess(res.data.token)),
    )
  }

  logout() {
    this.cookieService.delete('token', '/')
    this.currentUser.set(null)
    this.router.navigate(['/login'])
  }
}
