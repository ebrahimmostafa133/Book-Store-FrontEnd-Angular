import {isPlatformBrowser} from '@angular/common'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core'
import {Router} from '@angular/router'
import {jwtDecode} from 'jwt-decode'
import {CookieService} from 'ngx-cookie-service'
import {tap} from 'rxjs'
import {environment} from '../../../environments/environment'

interface DecodedToken {
  id: string
  role: 'admin' | 'user'
  [key: string]: any
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private cookieService = inject(CookieService)
  private platformId = inject(PLATFORM_ID)
  private apiUrl = `${environment.baseUrl}/user`

  isLoggedIn = signal<boolean>(this.decodedToken !== null)

  get decodedToken(): DecodedToken | null {
    if (!isPlatformBrowser(this.platformId)) { return null }

    const token = this.cookieService.get('token')
    if (!token) { return null }

    try {
      return jwtDecode<DecodedToken>(token)
    } catch {
      return null
    }
  }

  get userRole(): 'admin' | 'user' | null {
    return this.decodedToken?.role ?? null
  }

  get userId(): string | null {
    return this.decodedToken?.id ?? null
  }

  handleAuthSuccess(token: string) {
    this.cookieService.set('token', token, 1, '/')
    this.isLoggedIn.set(true)

    if (this.userRole === 'admin') {
      this.router.navigate(['/admin/dashboard'])
    } else {
      this.router.navigate(['/home'])
    }
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
    this.isLoggedIn.set(false)
    this.router.navigate(['/login'])
  }
}
