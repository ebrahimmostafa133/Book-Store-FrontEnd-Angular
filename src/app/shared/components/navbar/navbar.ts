import {Component, inject} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router'
import {AuthService} from '../../../core/services/auth.service'
import {CartService} from '../../../core/services/cart.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService)
  cartService = inject(CartService)
  private router = inject(Router)
  cartCount = this.cartService.cartCount

  isMenuOpen = false
  isDropdownOpen = false

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      }
    }

    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe()
    }
  }

  public toggleTheme(): void {
    if (typeof document === 'undefined') { return }
    const root = document.documentElement
    const isLight = root.classList.contains('light')
    if (isLight) {
      root.classList.remove('light')
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark')
    }
  }

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
