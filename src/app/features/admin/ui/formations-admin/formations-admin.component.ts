import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Ajout du Router

import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { ToastService } from '../../../../core/services/toast.service';
import {
  LucideSearch, LucidePlus, LucidePencil,
  LucideTrash2
} from '@lucide/angular';
import { FormationService } from '../../../../shared/services/formation.service';
import { FormationResponse } from '../../../formations/data-access/formation.model';

@Component({
  selector: 'app-formations-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CurrencyFcfaPipe,
    LucideSearch, LucidePlus, LucidePencil,
    LucideTrash2
  ],
  templateUrl: './formations-admin.component.html'
})
export class FormationsAdminComponent implements OnInit {
  private formationService = inject(FormationService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  formations = signal<FormationResponse[]>([]);
  isLoading = signal(true);

  searchQuery = signal('');
  statusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL'); // Nouveau filtre

  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 20;

  ngOnInit() {
    this.loadFormations(0);
  }

  loadFormations(page: number) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    // On envoie la recherche et le statut directement au backend !
    this.formationService.getFormationsAdmin(page, this.pageSize, this.searchQuery(), this.statusFilter()).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.formations.set(res.data.content);
          this.totalPages.set(res.data.totalPages);
          this.totalElements.set(res.data.totalElements);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error("Erreur lors du chargement des formations.");
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(formation: FormationResponse) {
    // Si elle est active, on la désactive. Sinon, on l'active.
    const action$ = formation.active 
      ? this.formationService.desactiverFormation(formation.id)
      : this.formationService.activerFormation(formation.id);

    action$.subscribe({
      next: () => {
        this.toastService.success(`Statut mis à jour avec succès.`);
        this.loadFormations(this.currentPage()); // Recharge la liste
      },
      error: () => this.toastService.error("Erreur lors de la mise à jour.")
    });
  }

  onSearch() { this.loadFormations(0); }

  // Navigation vers la création/modification
  createFormation() {
    this.router.navigate(['/admin/formations/create']);
  }

  editFormation(id: number) {
    this.router.navigate(['/admin/formations/edit', id]);
  }

  

  deleteFormation(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.formationService.desactiverFormation(id).subscribe({
        next: () => {
          this.toastService.success("Formation supprimée.");
          this.loadFormations(this.currentPage());
        },
        error: () => this.toastService.error("Erreur lors de la suppression.")
      });
    }
  }

  getPagesArray(): number[] { return Array.from({ length: this.totalPages() }, (_, i) => i); }
}
