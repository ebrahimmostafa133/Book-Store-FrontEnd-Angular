import type {ApplicationConfig} from '@angular/core'
import {provideBrowserGlobalErrorListeners} from '@angular/core'
import {provideClientHydration, withEventReplay} from '@angular/platform-browser'

import {provideRouter} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
import {routes} from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    CookieService,
  ],
}
