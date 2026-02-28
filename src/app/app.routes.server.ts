import type {ServerRoute} from '@angular/ssr'
import {RenderMode} from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: 'authors/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categories/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'details/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
]
