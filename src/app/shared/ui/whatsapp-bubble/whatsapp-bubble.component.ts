import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-whatsapp-bubble',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-bubble.component.html'
})
export class WhatsAppBubbleComponent {
  waLink = computed(() => {
    const phone = environment.whatsappNumber;
    const message = encodeURIComponent(environment.whatsappMessage);
    return `https://wa.me/${phone}?text=${message}`;
  });
}
