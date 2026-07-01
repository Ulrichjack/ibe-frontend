import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FormationService } from '../../../shared/services/formation.service';
import { FormationResponse } from '../data-access/formation.model';
import { CurrencyFcfaPipe } from '../../../shared/pipes/currency-fcfa.pipe';

import {
  LucideSearch, LucideX, LucideClock,
  LucideUsers, LucideArrowRight, LucideChevronLeft, LucideChevronRight
} from '@lucide/angular';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-formation-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, CurrencyFcfaPipe,
    LucideSearch, LucideX, LucideClock, LucideUsers,
    LucideArrowRight, LucideChevronLeft, LucideChevronRight
  ],
  templateUrl: './formation-list.component.html'
})
export class FormationListComponent implements OnInit {
  private formationService = inject(FormationService);
  private destroyRef = inject(DestroyRef);
  private seoService = inject(SeoService);

  formations = signal<FormationResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  searchQuery = signal('');
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 9;

  constructor() {
    toObservable(this.searchQuery).pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => {
      if (query.length >= 2 || query.length === 0) {
        this.loadFormations(0);
      }
    });
  }

  ngOnInit() {
    this.seoService.setPageSeo(
      "Nos Formations Beauté Certifiées",
      "23 formations professionnelles certifiées MINEFOP : esthétique, coiffure, make-up, DQP. Kit professionnel inclus et stage pratique garanti à Yaoundé."
    );
    this.loadFormations(0);
  }

  loadFormations(page: number) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.currentPage.set(page);

    const query = this.searchQuery().trim();

    const request$ = query
      ? this.formationService.rechercher(query, page, this.pageSize)
      : this.formationService.getFormationsActives(page, this.pageSize);

    request$.subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.formations.set(res.data.content);
          this.totalPages.set(res.data.totalPages);
          this.totalElements.set(res.data.totalElements);
        } else {
          this.formations.set([]);
        }
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.errorMessage.set("Impossible de charger les formations. Vérifiez votre connexion.");
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    this.loadFormations(0);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.loadFormations(0);
  }

  getTauxRemplissage(formation: FormationResponse): number {
    if (!formation.nombrePlaces || formation.nombrePlaces === 0) return 0;
    const placesPrises = formation.nombrePlaces - formation.placesRestantesAffichees;
    return Math.round((placesPrises / formation.nombrePlaces) * 100);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}