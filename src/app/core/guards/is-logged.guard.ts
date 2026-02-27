import type {CanActivateFn} from '@angular/router'
import {inject} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'

export const isLoggedGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if (!authService.decodedToken) { return true }
  if (authService.userRole === 'admin') { return router.parseUrl('/admin/dashboard') }
  return router.parseUrl('/home')
}
