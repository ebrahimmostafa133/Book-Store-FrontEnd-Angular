import type {Routes} from '@angular/router'
import {adminGuard} from './core/guards/admin.guard'
import {authGuard} from './core/guards/auth.guard'
import {isLoggedGuard} from './core/guards/is-logged.guard'
import {AuthLayout} from './core/layout/auth-layout/auth-layout'
import {UserLayout} from './core/layout/user-layout/user-layout'

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home)},
      {path: 'books', loadComponent: () => import('./features/books/books').then(m => m.Books)},
      {path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.Cart)},
      {path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)},
      {path: 'allorders', loadComponent: () => import('./features/allorders/allorders').then(m => m.Allorders)},
      {path: 'authors', loadComponent: () => import('./features/authors/brands').then(m => m.Brands)},
      {path: 'categories', loadComponent: () => import('./features/categories/categories').then(m => m.Categories)},
      {path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.Profile)},
      {path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist').then(m => m.Wishlist)},
      {path: 'details/:id', loadComponent: () => import('./features/details/details').then(m => m.Details)},
    ],
  },
  {
    path: '',
    component: UserLayout,
    canActivate: [isLoggedGuard],
    children: [
      {path: 'login', loadComponent: () => import('./core/auth/login/login').then(m => m.Login)},
      {path: 'register', loadComponent: () => import('./core/auth/register/register').then(m => m.Register)},
      {path: 'not-found', loadComponent: () => import('./features/notfound/notfound').then(m => m.Notfound)},
      {path: '**', redirectTo: 'not-found'},
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./core/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)},
      {path: 'books', loadComponent: () => import('./features/admin/manage-books/manage-books').then(m => m.ManageBooks)},
      {path: 'authors', loadComponent: () => import('./features/admin/manage-authors/manage-authors').then(m => m.ManageAuthors)},
      {path: 'categories', loadComponent: () => import('./features/admin/manage-categories/manage-categories').then(m => m.ManageCategories)},
      {path: 'orders', loadComponent: () => import('./features/admin/manage-orders/manage-orders').then(m => m.ManageOrders)},
    ],
  },
]
