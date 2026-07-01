import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormationResponse } from '../../../formations/data-access/formation.model';
import { MessageService } from '../../../../shared/services/message.service';
import { LucideCircleAlert, LucideCircleCheck, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-inscription-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideX, LucideCircleCheck, LucideCircleAlert],
  templateUrl: './inscription-modal.component.html'
})
export class InscriptionModalComponent {
  @Input({ required: true }) formation!: FormationResponse;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  whatsappLink = signal('');

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    telephone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
    email: ['', [Validators.email]], // Optionnel
    ville: ['', Validators.required],
    quartier: [''],
    disponibilites: [''],
    message: ['']
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = {
      ...this.form.value,
      formationId: this.formation.id
    };

    this.messageService.soumettrePreInscription(payload as any).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success && res.data) {
          this.successMessage.set('Pré-inscription enregistrée avec succès !');
          this.whatsappLink.set(res.data.whatsappConfirmationLink);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue.');
      }
    });
  }

  openWhatsApp() {
    if (this.whatsappLink()) {
      window.open(this.whatsappLink(), '_blank');
      this.close.emit();
    }
  }
}
