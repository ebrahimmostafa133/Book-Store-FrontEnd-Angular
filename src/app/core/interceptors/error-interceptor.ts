import type {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {ToastrService} from 'ngx-toastr'
import {catchError, throwError} from 'rxjs'

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService)

  return next(req).pipe(catchError((err) => {
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
