import type {CanActivateFn} from '@angular/router'
import {isPlatformBrowser} from '@angular/common'
import {inject, PLATFORM_ID} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)
  const platformId = inject(PLATFORM_ID)

  if (!isPlatformBrowser(platformId)) {
    return true
  }

  if (!authService.decodedToken) { return router.parseUrl('/login') }
  if (authService.userRole === 'admin') { return true }
  return router.parseUrl('/home')
}
