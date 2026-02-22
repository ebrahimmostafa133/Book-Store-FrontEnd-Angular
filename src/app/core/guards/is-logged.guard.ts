import type {CanActivateFn} from '@angular/router'
import {isPlatformBrowser} from '@angular/common'
import {inject, PLATFORM_ID} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'

export const isLoggedGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)
  const platformId = inject(PLATFORM_ID)

  if (!isPlatformBrowser(platformId)) {
    return true
  }

  if (!authService.decodedToken) { return true }
  if (authService.userRole === 'admin') { return router.parseUrl('/admin/dashboard') }
  return router.parseUrl('/home')
}
