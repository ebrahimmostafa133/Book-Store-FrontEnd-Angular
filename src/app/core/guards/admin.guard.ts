import type {CanActivateFn} from '@angular/router'
import {inject} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if (!authService.decodedToken) { return router.parseUrl('/login') }
  if (authService.userRole === 'admin') { return true }
  return router.parseUrl('/home')
}
