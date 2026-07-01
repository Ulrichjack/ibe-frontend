import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormationService } from '../../../shared/services/formation.service';
import { FormationResponse } from '../data-access/formation.model';
import { CurrencyFcfaPipe } from '../../../shared/pipes/currency-fcfa.pipe';

import {
  LucideArrowLeft, LucideClock, LucideUsers,
  LucideCalendar, LucideAward, LucideCircleCheck,
  LucideBookOpen, LucideTarget, LucideBriefcase
} from '@lucide/angular';
import { InscriptionModalComponent } from '../../messages/ui/inscription-modal/inscription-modal.component';
import { ContactModalComponent } from '../../messages/ui/contact-modal/contact-modal.component';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [
    CommonModule,  CurrencyFcfaPipe,
    LucideArrowLeft, LucideClock, LucideUsers,
    LucideCalendar, LucideAward, LucideCircleCheck,
    LucideBookOpen, LucideTarget, LucideBriefcase, 
    InscriptionModalComponent, ContactModalComponent
  ],
  templateUrl: './formation-detail.component.html'
})
export class FormationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private formationService = inject(FormationService);
  private location = inject(Location);

  // État
  formation = signal<FormationResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  showInscriptionModal = signal(false);
  showContactModal = signal(false);
  // Gestion de l'UI
  activeTab = signal<'programme' | 'objectifs' | 'materiel'>('programme');
  currentImage = signal<string>('');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadFormation(slug);
      }
    });
  }

  loadFormation(slug: string) {
    this.isLoading.set(true);
    this.formationService.getFormationBySlug(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.formation.set(res.data);
          this.currentImage.set(res.data.photoPrincipale || 'assets/img/default-formation.jpg');
        } else {
          this.errorMessage.set("Formation introuvable.");
        }
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.errorMessage.set("Erreur lors du chargement des détails.");
        this.isLoading.set(false);
      }
    });
  }

  // Change l'image principale quand on clique sur une miniature
  setCurrentImage(url: string) {
    this.currentImage.set(url);
  }

  // Change l'onglet actif
  setActiveTab(tab: 'programme' | 'objectifs' | 'materiel') {
    this.activeTab.set(tab);
  }

  // Calcul du taux de remplissage
  getTauxRemplissage(): number {
    const form = this.formation();
    if (!form || !form.nombrePlaces || form.nombrePlaces === 0) return 0;
    const placesPrises = form.nombrePlaces - form.placesRestantesAffichees;
    return Math.round((placesPrises / form.nombrePlaces) * 100);
  }

  goBack() {
    this.location.back();
  }

  // Ces méthodes ouvriront les modaux qu'on créera au prochain sprint
  openInscriptionModal() {
    this.showInscriptionModal.set(true);
  }

  openContactModal() {
    this.showContactModal.set(true);
  }
}
