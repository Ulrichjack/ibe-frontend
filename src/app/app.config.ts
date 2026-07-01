import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withPreloading, NoPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideCloudinaryLoader } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { APP_LUCIDE_ICONS } from './core/config/lucide-icon';
import { provideLucideIcons } from '@lucide/angular';
import { authInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuration moderne pour votre application d'institut
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(NoPreloading)),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideCloudinaryLoader(`https://res.cloudinary.com/${environment.cloudinaryCloudName}`),

    provideLucideIcons(...APP_LUCIDE_ICONS)
  ]
};
