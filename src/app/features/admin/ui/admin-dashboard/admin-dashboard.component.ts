import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Ajout du HttpClient
import { environment } from '../../../../../environments/environment';

import { ApiResponse } from '../../../../shared/models/api-response.model';
import {
  LucideMail, LucideUsers, LucideGraduationCap,
  LucideTrendingUp, LucideArrowRight, LucideMessageSquare
} from '@lucide/angular';
import { MessageService } from '../../../../shared/services/message.service';
import { MessageListResponse } from '../../../messages/data-access/message.model';

// On crée l'interface pour typer la réponse de ton nouveau endpoint
interface DashboardStats {
  messagesNonLus: number;
  formationsActives: number;
  abonnesNewsletter: number;
  totalTemoignages: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    LucideMail, LucideUsers, LucideGraduationCap,
    LucideTrendingUp, LucideArrowRight, LucideMessageSquare
  ],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private messageService = inject(MessageService);
  private http = inject(HttpClient); // Injecté pour appeler la nouvelle route

  // Signaux d'état
  recentMessages = signal<MessageListResponse[]>([]);
  stats = signal<DashboardStats | null>(null); // Signal pour les vraies stats
  isLoading = signal(true);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);

    // 1. Charger les messages récents
    this.messageService.getMessages(0, 5).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.recentMessages.set(res.data.content);
        }
      }
    });

    // 2. Charger les VRAIES statistiques depuis ton nouveau contrôleur
    this.http.get<ApiResponse<DashboardStats>>(`${environment.apiUrl}/admin/stats/overview`).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Erreur stats", err);
        this.isLoading.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
