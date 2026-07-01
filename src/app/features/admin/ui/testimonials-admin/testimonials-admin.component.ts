import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestimonialService } from '../../../../shared/services/testimonial.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LucideTrash2,  LucidePlus, LucideX, } from '@lucide/angular';
import { TestimonialResponse } from '../../../testimonial/data-access/testimonial.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-testimonials-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  LucideTrash2, LucidePlus, LucideX],
  templateUrl: './testimonials-admin.component.html'
})
export class TestimonialsAdminComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  testimonials = signal<TestimonialResponse[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSubmitting = signal(false);
  selectedFile = signal<File | null>(null);
  isUploadingImage = signal(false);
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    nomEtudiant: ['', Validators.required],
    formationSuivie: ['', Validators.required],
    temoignage: ['', Validators.required],
    note: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    photoUrl: [''],
    publie: [true]
  });

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.isLoading.set(true);
    // Note: Il faut ajouter getTous() dans ton TestimonialService (route /api/testimonials/admin)
    this.testimonialService.getTous(0, 50).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.testimonials.set(res.data.content);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  togglePublication(id: number) {
    // Note: Il faut ajouter togglePublication() dans ton TestimonialService
    this.testimonialService.togglePublication(id).subscribe({
      next: () => {
        this.toastService.success("Statut mis à jour.");
        this.loadTestimonials();
      }
    });
  }

  deleteTestimonial(id: number) {
    if (confirm("Supprimer ce témoignage ?")) {
      this.testimonialService.supprimer(id).subscribe({
        next: () => {
          this.toastService.success("Témoignage supprimé.");
          this.loadTestimonials();
        }
      });
    }
  }
onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

   async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinaryUploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`Erreur Cloudinary: ${res.status}`);
    const data = await res.json();
    return data.secure_url;
  }
  // Modifie onSubmit()
  async onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);

    try {
      let photoUrl = '';
      if (this.selectedFile()) {
        this.isUploadingImage.set(true);
        photoUrl = await this.uploadToCloudinary(this.selectedFile()!);
        this.isUploadingImage.set(false);
      }

      const payload = { ...this.form.value, photoUrl };

      this.testimonialService.creer(payload).subscribe({
        next: () => {
          this.toastService.success("Témoignage ajouté !");
          this.showModal.set(false);
          this.form.reset({ note: 5, publie: true });
          this.selectedFile.set(null);
          this.previewUrl.set(null);
          this.loadTestimonials();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error("Erreur lors de l'ajout.");
          this.isSubmitting.set(false);
        }
      });
    } catch (err) {
      this.toastService.error("Erreur d'upload de l'image.");
      this.isSubmitting.set(false);
      this.isUploadingImage.set(false);
    }
  }
}