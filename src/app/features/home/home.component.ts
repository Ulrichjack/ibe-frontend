import { Component, OnInit, signal, inject, ElementRef, ViewChildren, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormationService } from '../../shared/services/formation.service';
import { FormationResponse } from '../formations/data-access/formation.model';

import {
 
  LucideUsers, LucideAward, 
  LucideBriefcase,
  LucideMapPin, LucidePhone, LucideStar,
  LucideCheck,
  LucideX,
  LucideBanknote,
  LucideChevronLeft, LucideChevronRight, LucideArrowRight,LucideClock
} from '@lucide/angular';
import { TestimonialService } from '../../shared/services/testimonial.service';
import { TestimonialResponse } from '../testimonial/data-access/testimonial.model';
import { GalleryImageResponse } from '../../shared/models/gallery.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../shared/services/newsletter.service';
import { ContactModalComponent } from '../messages/ui/contact-modal/contact-modal.component';
import { GalleryService } from '../../shared/services/gallery.service';
import { SeoService } from '../../core/services/seo.service';
import { CloudinaryOptimizePipe } from '../../shared/pipes/cloudinary-optimize.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink, CloudinaryOptimizePipe,
    LucideUsers, LucideAward, LucideBriefcase,
    LucideMapPin, LucidePhone, LucideStar,
    ReactiveFormsModule, LucideCheck, LucideX, ContactModalComponent, LucideBanknote,
    LucideChevronLeft, LucideChevronRight,LucideArrowRight, LucideClock
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private formationService = inject(FormationService);
  private testimonialService = inject(TestimonialService);
  private galleryService = inject(GalleryService);
  private newsletterService = inject(NewsletterService);
  private fb = inject(FormBuilder);
  private seoService = inject(SeoService);

  popularFormations = signal<FormationResponse[]>([]);
  testimonials = signal<TestimonialResponse[]>([]);
  galleryImages = signal<GalleryImageResponse[]>([]);

  selectedTestimonial = signal<TestimonialResponse | null>(null);
  isLoadingFormations = signal(true);
  isLoadingTestimonials = signal(true);
  isLoadingGallery = signal(true);
  showContactModal = signal(false);

  // Références pour les carrousels
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @ViewChild('partnersContainer') partnersContainer!: ElementRef;

  newsletterForm = this.fb.group({
    telephone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]]
  });

  isSubmittingNewsletter = signal(false);
  newsletterSuccess = signal('');
  newsletterError = signal('');

  partenaires = [
    { nom: "MINEFOP", logo: "assets/img/Minefop.webp" },
    { nom: "IIFPI", logo: "assets/img/IIFPI.webp" },
    { nom: "Beauty's Company", logo: "assets/img/teb.webp" },
    { nom: "ED GLAM'S", logo: "assets/img/ed.webp" },
    { nom: "KENFORT", logo: "assets/img/Beaty_Nails.webp" }
  ];

  @ViewChildren('statNumber') statElements!: QueryList<ElementRef>;
  stats = [
    { label: "Étudiantes formées", value: 1500, suffix: "+" },
    { label: "Formations certifiées", value: 23, suffix: "" },
    { label: "Années d'expérience", value: 5, suffix: "+" },
    { label: "Taux de réussite", value: 98, suffix: "%" }
  ];

  ngOnInit() {
    this.seoService.setPageSeo("Institut Beauty's Empire — Accueil", "Formations professionnelles en beauté à Yaoundé.");
    this.seoService.setOrganizationSchema();

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
    this.testimonialService.getPublies(0, 5).subscribe({
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
    this.galleryService.getImagesPubliques(0, 7).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.galleryImages.set(res.data.content);
        }
        this.isLoadingGallery.set(false);
      },
      error: () => this.isLoadingGallery.set(false)
    });
  }

  openFullReview(testi: TestimonialResponse) {
    this.selectedTestimonial.set(testi);
    document.body.style.overflow = 'hidden';
  }

  closeFullReview() {
    this.selectedTestimonial.set(null);
    document.body.style.overflow = 'auto';
  }

  // --- NAVIGATION DES CARROUSELS ---
  scrollCarousel(direction: 'left' | 'right') {
    if (this.carouselContainer) {
      const container = this.carouselContainer.nativeElement;
      const scrollAmount = 374; // Largeur d'une carte avis + gap
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  scrollPartners(direction: 'left' | 'right') {
    if (this.partnersContainer) {
      const container = this.partnersContainer.nativeElement;
      const scrollAmount = 224; // Largeur d'une carte partenaire + gap
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  private initStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          const finalValue = parseInt(target.getAttribute('data-value') || '0', 10);
          this.animateValue(target, 0, finalValue, 2000);
        } else {
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

  // Ajoute cette méthode dans la classe HomeComponent
  optimizeImage(url: string | undefined): string {
    if (!url) return 'assets/img/default-formation.webp';
    // Si c'est une URL Cloudinary non optimisée, on injecte les paramètres de compression
    if (url.includes('cloudinary.com') && !url.includes('f_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
    }
    return url;
  }
}