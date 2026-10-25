import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
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
import { CloudinaryOptimizePipe } from '../../../../shared/pipes/cloudinary-optimize.pipe';

@Component({
  selector: 'app-formations-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, CurrencyFcfaPipe,
    LucideSearch, LucidePlus, LucidePencil,
    LucideTrash2,CloudinaryOptimizePipe
  ],
  templateUrl: './formations-admin.component.html'
})
export class FormationsAdminComponent implements OnInit {
  private formationService = inject(FormationService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  formations = signal<FormationResponse[]>([]);
  isLoading = signal(true);
  featuredFormations = signal<FormationResponse[]>([]);
  isLoadingFeatured = signal(true);
  featuredLoadFailed = signal(false);
  savingFeaturedId = signal<number | null>(null);
  readonly featuredPositions = [1, 2, 3, 4, 5, 6];

  searchQuery = signal('');
  statusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL'); // Nouveau filtre

  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 20;

  ngOnInit() {
    this.loadFormations(0);
    this.loadFeaturedFormations();
  }

  loadFeaturedFormations() {
    this.isLoadingFeatured.set(true);
    this.featuredLoadFailed.set(false);
    this.formationService.getFormationsMisesEnAvant().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.featuredFormations.set(res.data);
        } else {
          this.featuredLoadFailed.set(true);
        }
        this.isLoadingFeatured.set(false);
      },
      error: () => {
        this.featuredLoadFailed.set(true);
        this.isLoadingFeatured.set(false);
        this.toastService.error("Erreur lors du chargement de la sélection de l'accueil.");
      }
    });
  }

  isFeaturedPositionTaken(position: number, formationId: number): boolean {
    return this.featuredFormations().some(formation =>
      formation.ordreAffichage === position && formation.id !== formationId);
  }

  setFeaturedPosition(formation: FormationResponse, event: Event) {
    const select = event.target as HTMLSelectElement;
    const position = select.value === '' ? null : Number(select.value);
    // Le choix reste celui enregistré tant que l'API n'a pas confirmé la modification.
    select.value = formation.miseEnAvant ? String(formation.ordreAffichage) : '';
    if (this.savingFeaturedId() !== null) return;
    this.savingFeaturedId.set(formation.id);
    this.formationService.updateFeaturedPosition(formation.id, position).subscribe({
      next: (res) => {
        this.savingFeaturedId.set(null);
        if (res.success && res.data) {
          const updated = res.data;
          this.formations.update(formations => formations.map(item => item.id === updated.id ? updated : item));
          this.toastService.success(position === null ? "Formation retirée de l'accueil." : "Sélection de l'accueil mise à jour.");
        }
        this.loadFeaturedFormations();
      },
      error: (err) => {
        this.savingFeaturedId.set(null);
        this.toastService.error(err.error?.message || "Impossible de modifier la sélection de l'accueil.");
        this.loadFormations(this.currentPage());
        this.loadFeaturedFormations();
      }
    });
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
        this.loadFeaturedFormations();
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
          this.loadFeaturedFormations();
        },
        error: () => this.toastService.error("Erreur lors de la suppression.")
      });
    }
  }

  getPagesArray(): number[] { return Array.from({ length: this.totalPages() }, (_, i) => i); }
}
