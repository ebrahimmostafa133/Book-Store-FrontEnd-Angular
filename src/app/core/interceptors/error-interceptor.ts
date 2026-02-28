import type {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {ToastrService} from 'ngx-toastr'
import {catchError, throwError} from 'rxjs'
import {AuthService} from '../services/auth.service'

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService)
  const authService = inject(AuthService) // Inject AuthServic

  return next(req).pipe(catchError((err) => {
    if (err.status === 401) {
      if (req.url.includes('/login')) {
        toastrService.error(err.error?.message || 'Incorrect email or password')
        return throwError(() => err)
      }

      if (authService.decodedToken) {
        toastrService.error('Session expired. Please login again.')
      } else {
        toastrService.error('Please login access this feature')
      }
      authService.logout()
      return throwError(() => err)
    }
    let errorMessage = 'An error occurred'
    if (err?.error?.message) {
      errorMessage = err.error.message
    } else if (typeof err?.error === 'string') {
      errorMessage = err.error
    } else if (err?.message) {
      errorMessage = err.message
    }
    toastrService.error(errorMessage)
    return throwError(() => err)
  }))
}
