import type {CanActivateFn} from '@angular/router'
import {inject} from '@angular/core'
import {Router} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'

export const authGuard: CanActivateFn = (_route, _state) => {
  const cookieService = inject(CookieService)
  const router = inject(Router)

  if (cookieService.get('token')) {
    return true
  } else {
    return router.parseUrl('/login')
  }
}
