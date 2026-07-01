import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { LucideCheck, LucideX, LucideTriangleAlert, LucideCircleAlert } from '@lucide/angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideCheck, LucideX, LucideTriangleAlert, LucideCircleAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  toastService = inject(ToastService);
}
