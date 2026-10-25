import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  isLoadingFormation = signal(false);
  categories = signal(['Esthétique', 'Coiffure', 'Make-up', 'Pack Beauté', 'Pack DQP',
    'DQP', 'Cosmétiques', 'Bien-être', 'Décoration', 'Gestion', 'Santé', 'Informatique', 'Industrie']);
  private gallerySelectionId = 0;

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
    duree: [''],
    prix: this.fb.control<number | null>(null, Validators.min(0)),
    fraisInscription: this.fb.control<number | null>(null, Validators.min(0)),
    nombrePlaces: this.fb.control<number | null>(null, Validators.min(1)),
    photoPrincipale: [''],
    photosGalerie: [[] as string[]], // Tableau d'URLs
    programme: [''],
    objectifs: [''],
    materielFourni: [''],
    joursFormation: [''],
    horaires: [''],
    frequence: [''],
    dateDemarrage: [''],
    dateFinInscription: [''],
    dateDebutPromo: [''],
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
    this.isLoadingFormation.set(true);
    this.formationService.getFormationById(id).subscribe({
      next: (res) => {
        this.isLoadingFormation.set(false);
        if (res.success && res.data) {
          const category = res.data.categorie;
          if (!this.categories().includes(category)) {
            this.categories.update(categories => [...categories, category]);
          }
          this.form.patchValue({ ...res.data, photosGalerie: res.data.photosGalerie ?? [] });
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
        this.isLoadingFormation.set(false);
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
  async onGalleryFilesSelected(event: Event): Promise<void> {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    if (files.some(file => file.size > 5 * 1024 * 1024)) {
      this.toastService.error("Certaines images dépassent 5 Mo.");
      return;
    }
    const saved = this.form.controls.photosGalerie.value ?? [];
    const capacity = Math.max(0, 10 - saved.length);
    if (files.length > capacity) this.toastService.warning(`Vous pouvez encore ajouter ${capacity} image(s).`);
    const selected = files.slice(0, capacity);
    const selectionId = ++this.gallerySelectionId;
    this.galleryFiles.set(selected);
    const previews = await Promise.all(selected.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
    if (selectionId === this.gallerySelectionId) this.galleryImagePreviews.set([...saved, ...previews]);
  }

  removeGalleryImage(index: number): void {
    const saved = [...(this.form.controls.photosGalerie.value ?? [])];
    if (index < saved.length) {
      saved.splice(index, 1);
      this.form.patchValue({ photosGalerie: saved });
    } else {
      this.galleryFiles.update(files => files.filter((_, i) => i !== index - saved.length));
    }
    this.galleryImagePreviews.update(previews => previews.filter((_, i) => i !== index));
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
    if (this.isLoadingFormation() || this.isSubmitting()) return;
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
        this.form.patchValue({ photosGalerie: [...(this.form.controls.photosGalerie.value ?? []), ...galleryUrls] });
        this.isGalleryUploading.set(false);
      }

      // 3. Envoi au Backend
      const payload = { ...this.form.value, duree: this.form.value.duree?.trim() || null } as any;
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
