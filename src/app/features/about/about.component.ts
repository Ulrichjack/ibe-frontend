import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAward, LucideTrendingUp, LucideCircleCheck } from '@lucide/angular';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAward, LucideCircleCheck, LucideTrendingUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setPageSeo(
      "À Propos",
      "Découvrez l’INSTITUT BEAUTY’S EMPIRE - IBE à Yaoundé, dirigé par Pavel Lutherking : formations professionnelles en beauté, informatique, élevage, gestion et autres filières."
    );
  }
}