import type {ApplicationConfig} from '@angular/core'
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http'
import {provideBrowserGlobalErrorListeners} from '@angular/core'
import {provideClientHydration, withEventReplay} from '@angular/platform-browser'
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideRouter} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
import {provideToastr} from 'ngx-toastr'
import {routes} from './app.routes'
import {errorInterceptor} from './core/interceptors/error-interceptor'
import {headersInterceptor} from './core/interceptors/headers-interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, headersInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    CookieService,
  ],
}
