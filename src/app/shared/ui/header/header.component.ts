import { Component, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMenu, LucideX } from '@lucide/angular';
import { ContactModalComponent } from '../../../features/messages/ui/contact-modal/contact-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, 
    LucideMenu, LucideX,
    ContactModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  isScrolled = signal(false);
  showContactModal = signal(false);

  // Détecte le scroll pour ajouter l'effet "Luxe" (ombre et flou)
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openContactModal() {
    this.showContactModal.set(true);
  }
}
