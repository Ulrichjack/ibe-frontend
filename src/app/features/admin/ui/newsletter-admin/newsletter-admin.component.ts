import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterService } from '../../../../shared/services/newsletter.service';
import { NewsletterResponse } from '../../../../shared/models/newsletter.model';
import { ToastService } from '../../../../core/services/toast.service';
import { LucideUsers, LucideMessageCircle,  LucideCircleCheck } from '@lucide/angular';

@Component({
  selector: 'app-newsletter-admin',
  standalone: true,
  imports: [CommonModule, LucideMessageCircle, LucideCircleCheck],
  templateUrl: './newsletter-admin.component.html'
})
export class NewsletterAdminComponent implements OnInit {
  private newsletterService = inject(NewsletterService);
  private toastService = inject(ToastService);

  abonnes = signal<NewsletterResponse[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadAbonnes();
  }

  loadAbonnes() {
    this.isLoading.set(true);
    // Note: Il faut ajouter getAbonnes() dans ton NewsletterService
    this.newsletterService.getAbonnes(0, 50).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.abonnes.set(res.data.content);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  marquerContacte(id: number) {
    // Note: Il faut ajouter marquerContacte() dans ton NewsletterService
    this.newsletterService.marquerContacte(id).subscribe({
      next: () => {
        this.toastService.success("Abonné marqué comme contacté.");
        this.loadAbonnes();
      }
    });
  }

  openWhatsApp(link: string | undefined, phone: string) {
    if (link) {
      window.open(link, '_blank');
    } else {
      // Fallback si le lien n'est pas fourni
      const cleanPhone = phone.replace(/\D/g, '');
      const num = cleanPhone.startsWith('237') ? cleanPhone : '237' + cleanPhone;
      window.open(`https://wa.me/${num}`, '_blank');
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}