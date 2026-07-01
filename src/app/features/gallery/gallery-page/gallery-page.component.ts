import { Component, OnInit, signal, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImageResponse } from '../../../shared/models/gallery.model';
import { LucideX, LucideChevronLeft, LucideChevronRight, LucideImage } from '@lucide/angular';
import { GalleryService } from '../../../shared/services/gallery.service';
import { SeoService } from '../../../core/services/seo.service';
import { CloudinaryOptimizePipe } from '../../../shared/pipes/cloudinary-optimize.pipe';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [
    CommonModule, LucideX, 
    LucideChevronLeft, LucideChevronRight, LucideImage, CloudinaryOptimizePipe
  ],
  templateUrl: './gallery-page.component.html'
})
export class GalleryPageComponent implements OnInit {
  private galleryService = inject(GalleryService);
  private seoService = inject(SeoService);

  images = signal<GalleryImageResponse[]>([]);
  isLoading = signal(true);
  activeCategory = signal<string>('');
  
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 12;

  isLightboxOpen = signal(false);
  currentImageIndex = signal(0);

  categories = [
    { id: '', label: 'Toutes les photos' },
    { id: 'FORMATION', label: 'Formations' },
    { id: 'EVENEMENT', label: 'Événements' },
    { id: 'INSTITUT', label: 'L\'Institut' }
  ];

  ngOnInit() {
    this.seoService.setPageSeo(
      "Galerie des Réalisations",
      "Découvrez les réalisations de nos étudiantes en esthétique, coiffure et make-up. Portfolio de l'Institut Beauty's Empire (IBE) à Yaoundé."
    );
    this.loadImages(0);
  }

  loadImages(page: number) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.galleryService.getImagesPubliques(page, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.images.set(res.data.content);
          this.totalPages.set(res.data.totalPages);
        }
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => this.isLoading.set(false)
    });
  }

  setCategory(catId: string) {
    this.activeCategory.set(catId);
  }

  filteredImages = computed(() => {
    const cat = this.activeCategory();
    const imgs = this.images();
    if (!cat) return imgs;
    return imgs.filter(img => img.categorie === cat);
  });

  openLightbox(index: number) {
    this.currentImageIndex.set(index);
    this.isLightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.currentImageIndex() < this.filteredImages().length - 1) {
      this.currentImageIndex.update(i => i + 1);
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.update(i => i - 1);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isLightboxOpen()) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.nextImage(event);
    if (event.key === 'ArrowLeft') this.prevImage(event);
  }
}