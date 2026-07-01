import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../../shared/services/message.service';
import { FormationResponse } from '../../../formations/data-access/formation.model';
import { LucideX, LucideCircleCheck, LucideCircleAlert } from '@lucide/angular';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideX, LucideCircleCheck, LucideCircleAlert],
  templateUrl: './contact-modal.component.html'
})
export class ContactModalComponent implements OnInit {
  // Optionnel : si on l'ouvre depuis une formation, on pré-remplit le sujet
  @Input() formation?: FormationResponse; 
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
    email: ['', [Validators.email]],
    ville: [''],
    quartier: [''],
    sujet: [''],
    message: ['', [Validators.required, Validators.minLength(10)]] // Message obligatoire ici !
  });

  ngOnInit() {
    if (this.formation) {
      this.form.patchValue({
        sujet: `Question concernant : ${this.formation.nom}`
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = {
      ...this.form.value,
      formationId: this.formation?.id || null
    };

    this.messageService.soumettreContact(payload as any).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success && res.data) {
          this.successMessage.set('Message envoyé avec succès !');
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