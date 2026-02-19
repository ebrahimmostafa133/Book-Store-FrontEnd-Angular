import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Footer} from '../../../shared/components/footer/footer'
import {Navbar} from '../../../shared/components/navbar/navbar'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

}
