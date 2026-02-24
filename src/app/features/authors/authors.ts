import type {OnInit} from '@angular/core'
import type {Author} from '../../core/interfaces/author.interface'
import {isPlatformBrowser} from '@angular/common'
import {Component, inject, PLATFORM_ID, signal} from '@angular/core'
import {RouterLink} from '@angular/router'
import {NgxPaginationModule} from 'ngx-pagination'
import {AuthorsService} from '../../core/services/authors.service'

@Component({
  selector: 'app-authors',
  imports: [RouterLink, NgxPaginationModule],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
})
export class Authors implements OnInit {
  private readonly authorsService = inject(AuthorsService)
  private readonly platformId = inject(PLATFORM_ID)
  authors = signal<Author[]>([])
  currentPage = signal(1)
  itemsPerPage = 2
  totalPages = signal(1)
  totalItems = signal(0)
  isLoading = signal(true)

  ngOnInit(): void {
    this.loadAuthors()
  }

  loadAuthors(): void {
    this.isLoading.set(true)
    this.authorsService.getAllAuthors(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.authors.set(res.data)
        if (res.metadata?.numberOfPages) {
          this.totalPages.set(res.metadata.numberOfPages)
        } else if (res.paginationResult?.numberOfPages) {
          this.totalPages.set(res.paginationResult.numberOfPages)
        } else {
          const isFullPage = res.data.length === this.itemsPerPage
          this.totalPages.set(isFullPage ? this.currentPage() + 1 : this.currentPage())
        }
        const totalItemsCalc = res.metadata?.totalItems ?? res.paginationResult?.totalItems ?? res.totalItems
        const total = totalItemsCalc || (this.totalPages() * this.itemsPerPage)
        this.totalItems.set(total)

        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error fetching authors', err)
        this.isLoading.set(false)
      },
    })
  }

  goToPage(page: number): void {
    this.currentPage.set(page)
    this.loadAuthors()
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }
}
