import type {OnInit} from '@angular/core'
import type {Author} from '../../core/interfaces/author.interface'
import {Component, inject, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {AuthorsService} from '../../core/services/authors.service'

@Component({
  selector: 'app-authors',
  imports: [RouterLink],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
})
export class Authors implements OnInit {
  private readonly authorsService = inject(AuthorsService)
  authors = signal<Author[]>([])
  isLoading = signal(true)

  ngOnInit(): void {
    this.authorsService.getAllAuthors().subscribe({
      next: (res) => {
        this.authors.set(res.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching authors', err)
        this.isLoading.set(false)
      },
    })
  }
}
