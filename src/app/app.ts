import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { WhatsAppBubbleComponent } from './shared/ui/whatsapp-bubble/whatsapp-bubble.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsAppBubbleComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private router = inject(Router);
  private seoService = inject(SeoService);

  // Ce signal vaut `true` si on est sur une page Admin
  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin'))
    ),
    { initialValue: window.location.pathname.startsWith('/admin') }
  );

  ngOnInit() {
    // Injecte le schéma de l'organisation sur tout le site dès le démarrage
    this.seoService.setOrganizationSchema();
  }
}