import { Component, OnInit, signal, inject, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormationService } from '../../shared/services/formation.service';
import { FormationResponse } from '../formations/data-access/formation.model';

import { CurrencyFcfaPipe } from '../../shared/pipes/currency-fcfa.pipe';

import {
   LucideArrowRight, LucideClock,
  LucideUsers, LucideAward, LucideSparkles,
  LucideGraduationCap, LucideBriefcase, LucideHeartHandshake,
  LucideMapPin, LucidePhone, LucideStar,
  LucideCheck,
  LucideX
} from '@lucide/angular';
import { TestimonialService } from '../../shared/services/testimonial.service';
import { TestimonialResponse } from '../testimonial/data-access/testimonial.model';
import { GalleryImageResponse } from '../../shared/models/gallery.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../shared/services/newsletter.service';
import { ContactModalComponent } from '../messages/ui/contact-modal/contact-modal.component';
import { GalleryService } from '../../shared/services/gallery.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink, CurrencyFcfaPipe,
     LucideArrowRight, LucideClock,
    LucideUsers, LucideAward, LucideSparkles,
    LucideGraduationCap, LucideBriefcase, LucideHeartHandshake,
    LucideMapPin, LucidePhone, LucideStar,
     ReactiveFormsModule,LucideCheck,LucideX,ContactModalComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private formationService = inject(FormationService);
  private testimonialService = inject(TestimonialService);
  private galleryService = inject(GalleryService);
  private newsletterService = inject(NewsletterService);
  private fb = inject(FormBuilder);

  // Signals pour gérer l'état
  popularFormations = signal<FormationResponse[]>([]);
  testimonials = signal<TestimonialResponse[]>([]);
  galleryImages = signal<GalleryImageResponse[]>([]);

  isLoadingFormations = signal(true);
  isLoadingTestimonials = signal(true);
  isLoadingGallery = signal(true);
  showContactModal = signal(false);

  // Formulaire Newsletter (Accepte les numéros internationaux)
  newsletterForm = this.fb.group({
    telephone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]]
  });

  isSubmittingNewsletter = signal(false);
  newsletterSuccess = signal('');
  newsletterError = signal('');

  // Partenaires en dur (car ce sont des logos fixes)
  partenaires = [
    { nom: "MINEFOP", logo: "assets/img/Minefop.jpg" },
    { nom: "IIFPI", logo: "assets/img/IIFPI.jpg" },
    { nom: "Beauty's Company", logo: "assets/img/teb.jpg" },
    { nom: "ED GLAM'S", logo: "assets/img/ed.jpg" },
    { nom: "KENFORT", logo: "assets/img/Beaty&Nails.jpg" }
  ];

  @ViewChildren('statNumber') statElements!: QueryList<ElementRef>;
  stats = [
    { label: "Étudiantes formées", value: 1500, suffix: "+" },
    { label: "Formations certifiées", value: 23, suffix: "" },
    { label: "Années d'expérience", value: 5, suffix: "+" },
    { label: "Taux de réussite", value: 98, suffix: "%" }
  ];

  ngOnInit() {
    this.loadPopularFormations();
    this.loadTestimonials();
    this.loadGallery();
  }

  ngAfterViewInit() {
    this.initStatsAnimation();
  }

  loadPopularFormations() {
    this.formationService.getFormationsActives(0, 3).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.popularFormations.set(res.data.content);
        }
        this.isLoadingFormations.set(false);
      },
      error: () => this.isLoadingFormations.set(false)
    });
  }

  loadTestimonials() {
    this.testimonialService.getPublies(0, 3).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.testimonials.set(res.data.content);
        }
        this.isLoadingTestimonials.set(false);
      },
      error: () => this.isLoadingTestimonials.set(false)
    });
  }

  loadGallery() {
    this.galleryService.getImagesPubliques(0, 6).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.galleryImages.set(res.data.content);
        }
        this.isLoadingGallery.set(false);
      },
      error: () => this.isLoadingGallery.set(false)
    });
  }

  // Animation fluide des compteurs (Recompte à chaque scroll)
  private initStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          const finalValue = parseInt(target.getAttribute('data-value') || '0', 10);
          this.animateValue(target, 0, finalValue, 2000);
        } else {
          // Remet à zéro quand on quitte l'écran pour que ça recompte en revenant
          target.innerHTML = '0';
        }
      });
    }, { threshold: 0.5 });

    this.statElements.forEach(el => observer.observe(el.nativeElement));
  }

  private animateValue(obj: HTMLElement, start: number, end: number, duration: number) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      obj.innerHTML = Math.floor(easeOut * (end - start) + start).toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  submitNewsletter() {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    this.isSubmittingNewsletter.set(true);
    this.newsletterSuccess.set('');
    this.newsletterError.set('');

    this.newsletterService.subscribe({ telephone: this.newsletterForm.value.telephone! }).subscribe({
      next: (res) => {
        this.isSubmittingNewsletter.set(false);
        if (res.success && res.data) {
          this.newsletterSuccess.set('Inscription réussie ! Ouverture de WhatsApp...');
          this.newsletterForm.reset();

          // Ouvre le lien WhatsApp généré par le backend dans un nouvel onglet
          if (res.data.whatsappCatalogueLink) {
            setTimeout(() => {
              window.open(res.data!.whatsappCatalogueLink, '_blank');
            }, 1500);
          }
        }
      },
      error: (err) => {
        this.isSubmittingNewsletter.set(false);
        this.newsletterError.set(err.error?.message || 'Erreur lors de l\'inscription.');
      }
    });
  }

  openContactModal() {
    this.showContactModal.set(true);
  }


}
