import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideMapPin, LucidePhone,
  LucideClock, LucideNavigation
} from '@lucide/angular';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, LucideMapPin, LucidePhone, LucideClock, LucideNavigation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setPageSeo(
      "Nos Campus (Tsinga & Nkoabang)",
      "Retrouvez nos deux campus IBE à Yaoundé : Campus Tsinga (Entrée PMI) et Campus Nkoabang (Carrefour 10ème Arrêt). Horaires, téléphone, itinéraire."
    );
    this.seoService.setLocalBusinessSchema();
  }
}