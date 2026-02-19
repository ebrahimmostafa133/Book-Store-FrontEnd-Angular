import type {CanActivateFn} from '@angular/router'
import {inject} from '@angular/core'
import {Router} from '@angular/router'
// import AuthService from '../services/auth.service'
export const adminGuard: CanActivateFn = (_route, _state) => {
//   const authService = inject(AuthService)
//   const router = inject(Router)

  return true
}
