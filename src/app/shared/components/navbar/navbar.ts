import {Component, computed, inject} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router'
import {AuthService} from '../../../core/services/auth.service'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService)
  router = inject(Router)

  isLoggedIn = computed(() => this.authService.currentUser() !== null)
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin')
  isUser = computed(() => this.authService.currentUser()?.role === 'user')

  isAuthPage() {
    return this.router.url === '/login' || this.router.url === '/register'
  }

  logout() {
    this.authService.logout()
  }
}
