import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryService } from '../../../../shared/services/gallery.service';
import { GalleryImageResponse } from '../../../../shared/models/gallery.model';
import { ToastService } from '../../../../core/services/toast.service';
import { LucideCloudUpload, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-gallery-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideTrash2, LucideCloudUpload],
  templateUrl: './gallery-admin.component.html'
})
export class GalleryAdminComponent implements OnInit {
  private galleryService = inject(GalleryService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  images = signal<GalleryImageResponse[]>([]);
  isLoading = signal(true);
  isUploading = signal(false);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    titre: ['', Validators.required],
    categorie: ['EVENEMENT', Validators.required]
  });

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading.set(true);
    // Note: Il faut ajouter getToutesImages() dans ton GalleryService
    this.galleryService.getToutesImages(0, 50).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.images.set(res.data.content);
        }
        this.isLoading.set(false);
      }
    });
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

  onSubmit() {
    if (this.form.invalid || !this.selectedFile()) {
      this.form.markAllAsTouched(); // Force l'affichage des messages d'erreur rouges
      
      if (!this.selectedFile()) {
        this.toastService.warning("Veuillez sélectionner une image à uploader.");
      }
      return;
    }

    this.isUploading.set(true);

    // On crée un FormData pour envoyer le fichier ET les textes au backend
    const formData = new FormData();
    formData.append('file', this.selectedFile()!);
    formData.append('titre', this.form.value.titre!);
    formData.append('categorie', this.form.value.categorie!);
    formData.append('isPublic', 'true');

    this.galleryService.ajouterImage(formData).subscribe({
      next: () => {
        this.toastService.success("Image ajoutée !");
        this.form.reset({ categorie: 'EVENEMENT' });
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.loadImages();
        this.isUploading.set(false);
      },
      error: () => {
        this.toastService.error("Erreur lors de l'ajout.");
        this.isUploading.set(false);
      }
    });
  }

  deleteImage(id: number) {
    if (confirm("Supprimer cette image ?")) {
      this.galleryService.supprimerImage(id).subscribe({
        next: () => {
          this.toastService.success("Image supprimée.");
          this.loadImages();
        }
      });
    }
  }
}