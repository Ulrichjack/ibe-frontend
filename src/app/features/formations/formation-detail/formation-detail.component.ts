import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormationService } from '../../../shared/services/formation.service';
import { FormationResponse } from '../data-access/formation.model';
import { CurrencyFcfaPipe } from '../../../shared/pipes/currency-fcfa.pipe';

import {
  LucideArrowLeft, LucideClock, LucideUsers,
  LucideCalendar, LucideAward, LucideCircleCheck,
  LucideBookOpen, LucideTarget, LucideBriefcase,
  LucideBanknote, LucideInfo
} from '@lucide/angular';
import { InscriptionModalComponent } from '../../messages/ui/inscription-modal/inscription-modal.component';
import { ContactModalComponent } from '../../messages/ui/contact-modal/contact-modal.component';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [
    CommonModule, CurrencyFcfaPipe,
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
  private seoService = inject(SeoService);

  formation = signal<FormationResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  showInscriptionModal = signal(false);
  showContactModal = signal(false);
  
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
          this.currentImage.set(res.data.photoPrincipale || 'assets/img/default-formation.webp');
          
          // INJECTION SEO DYNAMIQUE
          this.seoService.setPageSeo(
            `${res.data.nom}`,
            `Formation ${res.data.nom} certifiée MINEFOP à Yaoundé. ${res.data.duree}, kit inclus, stage pratique. ${res.data.placesRestantesAffichees} places disponibles.`,
            res.data.photoPrincipale
          );
        } else {
          this.errorMessage.set("Formation introuvable.");
        }
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'instant' });
      },
      error: () => {
        this.errorMessage.set("Erreur lors du chargement des détails.");
        this.isLoading.set(false);
      }
    });
  }

  setCurrentImage(url: string) {
    this.currentImage.set(url);
  }

  setActiveTab(tab: 'programme' | 'objectifs' | 'materiel') {
    this.activeTab.set(tab);
  }

  getTauxRemplissage(): number {
    const form = this.formation();
    if (!form || !form.nombrePlaces || form.nombrePlaces === 0) return 0;
    const placesPrises = form.nombrePlaces - form.placesRestantesAffichees;
    return Math.round((placesPrises / form.nombrePlaces) * 100);
  }

  goBack() {
    this.location.back();
  }

  openInscriptionModal() {
    this.showInscriptionModal.set(true);
  }

  openContactModal() {
    this.showContactModal.set(true);
  }
}