import type {OnInit} from '@angular/core'
import {Component, inject, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
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
  protected readonly title = signal('BookStore-FrontEnd')
  private flowbiteService = inject(FlowbiteService)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      flowbite.initFlowbite()
    })
  }
}
