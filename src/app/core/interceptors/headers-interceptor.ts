import type {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {CookieService} from 'ngx-cookie-service'

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService)
  const token = cookieService.get('token')
  let headers = req.headers

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`)
  }

  const authReq = req.clone({headers})

  return next(authReq)
}
