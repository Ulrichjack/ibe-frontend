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
      "Découvrez l'histoire de l'Institut Beauty's Empire (IBE), dirigé par Pavel Lutherking à Yaoundé. Certifié MINEFOP, 5+ ans d'excellence en formation beauté professionnelle."
    );
  }
}