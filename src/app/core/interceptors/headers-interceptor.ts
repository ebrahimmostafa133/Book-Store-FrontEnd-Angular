import type {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {CookieService} from 'ngx-cookie-service'

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService)
  if (cookieService.check('token')) {
    req = req.clone({
      setHeaders: {
        token: cookieService.get('token'),
      },
    })
  }

  return next(req)
}
