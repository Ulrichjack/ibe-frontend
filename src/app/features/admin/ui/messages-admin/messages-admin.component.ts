import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../../shared/services/message.service';
import { ToastService } from '../../../../core/services/toast.service';
import { 
  LucideSearch, LucideMail, LucideMailOpen, 
  LucideCheckCircle2, LucideArchive, LucideMessageCircle,
  LucidePhone, LucideMapPin, LucideGraduationCap,
  LucideX
} from '@lucide/angular';
import { MessageListResponse } from '../../../messages/data-access/message.model';

@Component({
  selector: 'app-messages-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    LucideSearch,  LucideMailOpen, 
    LucideCheckCircle2, LucideArchive, LucideMessageCircle,
    LucidePhone,  LucideGraduationCap,LucideX
  ],
  templateUrl: './messages-admin.component.html'
})
export class MessagesAdminComponent implements OnInit {
  private messageService = inject(MessageService);
  private toastService = inject(ToastService);

  messages = signal<MessageListResponse[]>([]);
  selectedMessage = signal<MessageListResponse | null>(null);
  isLoading = signal(true);
  
  // Filtres
  searchQuery = signal('');
  statusFilter = signal<'ALL' | 'NON_LU' | 'LU' | 'TRAITE' | 'ARCHIVE'>('ALL');
  typeFilter = signal<'ALL' | 'CONTACT_GENERAL' | 'PRE_INSCRIPTION'>('ALL');

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 15;

  ngOnInit() {
    this.loadMessages(0);
  }

  loadMessages(page: number) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.messageService.getMessages(page, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          let data = res.data.content;
          
          // Filtres locaux (En attendant que le backend gère les filtres dans la requête)
          if (this.searchQuery()) {
            const q = this.searchQuery().toLowerCase();
            data = data.filter(m => m.nom.toLowerCase().includes(q) || m.telephone.includes(q));
          }
          if (this.statusFilter() !== 'ALL') {
            data = data.filter(m => m.statut === this.statusFilter());
          }
          if (this.typeFilter() !== 'ALL') {
            data = data.filter(m => m.type === this.typeFilter());
          }

          this.messages.set(data);
          this.totalPages.set(res.data.totalPages);
          this.totalElements.set(res.data.totalElements);
          
          // Si on a des messages et qu'aucun n'est sélectionné, on sélectionne le premier
          if (data.length > 0 && !this.selectedMessage()) {
            this.selectMessage(data[0]);
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error("Erreur lors du chargement des messages.");
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    this.loadMessages(0);
  }

  selectMessage(msg: MessageListResponse) {
    this.selectedMessage.set(msg);
    
    // Si le message est NON_LU, on le marque comme LU automatiquement
    if (msg.statut === 'NON_LU') {
      this.messageService.marquerCommeLu(msg.id).subscribe({
        next: () => {
          // Met à jour le statut localement pour éviter de recharger toute la liste
          const updatedMessages = this.messages().map(m => 
            m.id === msg.id ? { ...m, statut: 'LU' as const } : m
          );
          this.messages.set(updatedMessages);
          this.selectedMessage.set({ ...msg, statut: 'LU' });
        }
      });
    }
  }

  changerStatut(id: number, nouveauStatut: 'TRAITE' | 'ARCHIVE') {
    const request$ = nouveauStatut === 'TRAITE' 
      ? this.messageService.marquerCommeTraite(id)
      : this.messageService.marquerCommeArchive(id);

    request$.subscribe({
      next: () => {
        this.toastService.success(`Message marqué comme ${nouveauStatut.toLowerCase()}.`);
        this.loadMessages(this.currentPage());
        if (this.selectedMessage()?.id === id) {
          this.selectedMessage.set(null); // Désélectionne
        }
      },
      error: () => this.toastService.error("Erreur lors de la mise à jour du statut.")
    });
  }

  openWhatsApp(telephone: string, nom: string) {
    const cleanPhone = telephone.replace(/\D/g, '');
    const num = cleanPhone.startsWith('237') ? cleanPhone : '237' + cleanPhone;
    const text = encodeURIComponent(`Bonjour ${nom}, je vous contacte de la part de l'Institut Beauty's Empire suite à votre message.`);
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  }

  getPagesArray(): number[] { return Array.from({ length: this.totalPages() }, (_, i) => i); }
}