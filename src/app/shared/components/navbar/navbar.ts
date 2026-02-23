import {Component, inject} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router'
import {AuthService} from '../../../core/services/auth.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService)
  private router = inject(Router)

  isMenuOpen = false
  isDropdownOpen = false

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  closeMenus() {
    this.isMenuOpen = false
    this.isDropdownOpen = false
  }

  isLoggedIn() {
    return this.authService.isLoggedIn()
  }

  isAdmin() {
    return this.authService.userRole === 'admin'
  }

  isUser() {
    return this.authService.userRole === 'user'
  }

  logout() {
    this.authService.logout()
    this.closeMenus()
  }
}
