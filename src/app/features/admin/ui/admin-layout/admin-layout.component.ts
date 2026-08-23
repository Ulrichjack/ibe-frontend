import { Component, signal, inject, OnInit } from '@angular/core'; // Ajout de OnInit
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from '../../../../shared/services/message.service'; // Ajout du service
import { 
  LucideLayoutDashboard, LucideGraduationCap, LucideMessageSquare, 
  LucideImage, LucideStar, LucideLogOut, LucideMenu, LucideX, LucideUsers
} from '@lucide/angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    LucideLayoutDashboard, LucideGraduationCap, LucideMessageSquare, 
    LucideImage, LucideStar, LucideLogOut, LucideMenu, LucideX, LucideUsers
  ],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit { // Implémente OnInit
  private authService = inject(AuthService);
  public messageService = inject(MessageService); // Injection
  private router = inject(Router);

  isSidebarOpen = signal(false);

  ngOnInit() {
    // Charge le nombre de messages non lus au démarrage
    this.messageService.getNonLusCount().subscribe();
  }

  toggleSidebar() { this.isSidebarOpen.update(v => !v); }
  closeSidebar() { this.isSidebarOpen.set(false); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}