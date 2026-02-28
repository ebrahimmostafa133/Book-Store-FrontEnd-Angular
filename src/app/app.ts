import type {OnInit} from '@angular/core'
import {Component, inject, signal} from '@angular/core'
import {Router, RouterOutlet} from '@angular/router'
import {FlowbiteService} from './core/services/flowbite.service'
import {Footer} from './shared/components/footer/footer'
import {Navbar} from './shared/components/navbar/navbar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('BookStore')
  private flowbiteService = inject(FlowbiteService)
  private router = inject(Router)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      flowbite.initFlowbite()
    })
  }

  isAdminRoute(): boolean {
    return this.router.url.includes('/admin')
  }
}
