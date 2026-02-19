import type {OnInit} from '@angular/core'
import {Component} from '@angular/core'
import {initFlowbite} from 'flowbite'

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  ngOnInit() {
    initFlowbite()
  }
}
