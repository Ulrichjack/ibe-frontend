import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormationService } from '../../../../shared/services/formation.service';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { ToastService } from '../../../../core/services/toast.service';
import { 
  LucideArrowLeft, LucideSave, LucideImage, 
  LucideClock, LucideUsers, LucideArrowRight,
  LucideUploadCloud, LucideX,
  LucideCheckCircle2,
} from '@lucide/angular';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-formation-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, CurrencyFcfaPipe,
    LucideArrowLeft, LucideSave, LucideImage, LucideClock, 
    LucideUsers, LucideArrowRight, LucideUploadCloud, LucideX,LucideCheckCircle2
  ],
  templateUrl: './formation-create.component.html'
})
export class FormationCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formationService = inject(FormationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isEditMode = signal(false);
  formationId = signal<number | null>(null);
  isSubmitting = signal(false);

  // Gestion des fichiers (Cloudinary)
  selectedFile = signal<File | null>(null);
  isImageUploading = signal(false);
  
  galleryFiles = signal<File[]>([]);
  galleryImagePreviews = signal<string[]>([]);
  isGalleryUploading = signal(false);

  // Le formulaire complet
  form = this.fb.group({
    nom: ['', Validators.required],
    categorie: ['', Validators.required],
    description: ['', Validators.required],
    duree: ['', Validators.required],
    prix: [0, [Validators.required, Validators.min(0)]],
    fraisInscription: [15000, Validators.required],
    nombrePlaces: [20, Validators.required],
    photoPrincipale: [''],
    photosGalerie: [[] as string[]], // Tableau d'URLs
    programme: [''],
    objectifs: [''],
    materielFourni: [''],
    joursFormation: [''],
    horaires: [''],
    frequence: [''],
    dateDemarrage: [''],
    certificatDelivre: [true],
    nomCertificat: [''],
    socialProofActif: [false],
    nombreInscritsAffiche: [0],
    enPromotion: [false],
    pourcentageReduction: [0],
    dateFinPromo: ['']
  });

  previewData = signal<any>({});

  ngOnInit() {
    this.form.valueChanges.subscribe(val => {
      this.previewData.set(val);
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.formationId.set(+id);
        this.loadFormation(+id);
      }
    });
  }

  loadFormation(id: number) {
    this.toastService.info("Chargement des données...");
    this.formationService.getFormationById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.form.patchValue(res.data);
          this.previewData.set(res.data);
          // Charger les images existantes de la galerie
          if (res.data.photosGalerie) {
            this.galleryImagePreviews.set(res.data.photosGalerie);
          }
        } else {
          this.toastService.error("Impossible de charger la formation.");
          this.router.navigate(['/admin/formations']);
        }
      },
      error: () => {
        this.toastService.error("Erreur lors du chargement des données.");
        this.router.navigate(['/admin/formations']);
      }
    });
  }

  // --- GESTION DE L'IMAGE PRINCIPALE ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error("L'image principale ne peut pas dépasser 5MB.");
        return;
      }
      this.selectedFile.set(file);
      
      // Créer un aperçu local
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ photoPrincipale: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  // --- GESTION DE LA GALERIE D'IMAGES ---
  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      const MAX_IMAGES = 10;
      
      const oversizedFiles = filesArray.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        this.toastService.error("Certaines images dépassent 5MB.");
        return;
      }

      if (filesArray.length > MAX_IMAGES) {
        this.toastService.warning(`Tu ne peux sélectionner que ${MAX_IMAGES} images maximum.`);
        this.galleryFiles.set(filesArray.slice(0, MAX_IMAGES));
      } else {
        this.galleryFiles.set(filesArray);
      }

      // Créer les aperçus locaux
      const previews: string[] = [];
      this.galleryFiles().forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          previews.push(reader.result as string);
          this.galleryImagePreviews.set([...previews]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number): void {
    const currentFiles = [...this.galleryFiles()];
    const currentPreviews = [...this.galleryImagePreviews()];
    
    currentFiles.splice(index, 1);
    currentPreviews.splice(index, 1);
    
    this.galleryFiles.set(currentFiles);
    this.galleryImagePreviews.set(currentPreviews);
    this.form.patchValue({ photosGalerie: currentPreviews });
  }

  // --- UPLOAD CLOUDINARY ---
  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinaryUploadPreset); // Ton preset Cloudinary

     const res = await fetch(`https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`Erreur Cloudinary: ${res.status}`);
    const data = await res.json();
    return data.secure_url;
  }

  // --- SOUMISSION DU FORMULAIRE ---
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.isSubmitting.set(true);

    try {
      // 1. Upload de l'image principale (si modifiée)
      if (this.selectedFile()) {
        this.isImageUploading.set(true);
        const imageUrl = await this.uploadToCloudinary(this.selectedFile()!);
        this.form.patchValue({ photoPrincipale: imageUrl });
        this.isImageUploading.set(false);
      }

      // 2. Upload de la galerie (si modifiée)
      if (this.galleryFiles().length > 0) {
        this.isGalleryUploading.set(true);
        const galleryUrls: string[] = [];
        for (const file of this.galleryFiles()) {
          const url = await this.uploadToCloudinary(file);
          galleryUrls.push(url);
        }
        this.form.patchValue({ photosGalerie: galleryUrls });
        this.isGalleryUploading.set(false);
      }

      // 3. Envoi au Backend
      const payload = this.form.value as any;
      const request$ = this.isEditMode()
        ? this.formationService.modifierFormation(this.formationId()!, payload)
        : this.formationService.creerFormation(payload);

      request$.subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success) {
            this.toastService.success(`Formation ${this.isEditMode() ? 'modifiée' : 'créée'} avec succès !`);
            this.router.navigate(['/admin/formations']);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.toastService.error(err.error?.message || "Une erreur est survenue.");
        }
      });

    } catch (err) {
      this.isSubmitting.set(false);
      this.isImageUploading.set(false);
      this.isGalleryUploading.set(false);
      this.toastService.error("Erreur lors de l'upload des images vers Cloudinary.");
    }
  }
}