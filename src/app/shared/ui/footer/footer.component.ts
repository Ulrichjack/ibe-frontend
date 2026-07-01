import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPin, LucidePhone, LucideMail } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideMapPin, LucidePhone, LucideMail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
