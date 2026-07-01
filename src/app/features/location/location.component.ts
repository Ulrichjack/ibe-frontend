import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideMapPin, LucidePhone,
  LucideClock, LucideNavigation
} from '@lucide/angular';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, LucideMapPin, LucidePhone, LucideClock, LucideNavigation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location.component.html'
})
export class LocationComponent {}
