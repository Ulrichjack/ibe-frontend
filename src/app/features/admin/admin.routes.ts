import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  // 1. Page de Login (Publique)
  {
    path: 'login',
    loadComponent: () => import('./ui/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: "Connexion Admin — IBE"
  },

  // 2. Le Layout Admin (Protégé par le Guard)
  {
    path: '',
    loadComponent: () => import('./ui/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard], // Protège le layout et TOUS ses enfants
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./ui/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: "Tableau de bord — IBE"
      },
      {
        path: 'formations/create',
        loadComponent: () => import('./ui/formation-create/formation-create.component').then(m => m.FormationCreateComponent),
        title: "Nouvelle Formation — IBE"
      },
      {
        path: 'formations/edit/:id',
        loadComponent: () => import('./ui/formation-create/formation-create.component').then(m => m.FormationCreateComponent),
        title: "Modifier Formation — IBE"
      },
      {
        path: 'formations',
        loadComponent: () => import('./ui/formations-admin/formations-admin.component').then(m => m.FormationsAdminComponent),
        title: "Gestion des Formations — IBE"
      },
      {
        path: 'messages',
        loadComponent: () => import('./ui/messages-admin/messages-admin.component').then(m => m.MessagesAdminComponent),
        title: "Boîte de Réception — IBE"
      },
      {
        path: 'newsletter',
        loadComponent: () => import('./ui/newsletter-admin/newsletter-admin.component').then(m => m.NewsletterAdminComponent),
        title: "Gestion de la Newsletter — IBE"
      },
      {
        path: 'temoignages',
        loadComponent: () => import('./ui/testimonials-admin/testimonials-admin.component').then(m => m.TestimonialsAdminComponent),
        title: "Témoignages — IBE"
      },
      {
        path: 'galerie',
        loadComponent: () => import('./ui/gallery-admin/gallery-admin.component').then(m => m.GalleryAdminComponent),
        title: "Galerie — IBE"
      }
    ]
  }
];
