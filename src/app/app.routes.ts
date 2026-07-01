import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: "Institut Beauty's Empire — Accueil"
  },
  {
    path: 'formations',
    loadComponent: () => import('./features/formations/formation-list/formation-list.component').then(m => m.FormationListComponent),
    title: "Nos Formations — IBE"
  },
  {
    path: 'formations/:slug',
    loadComponent: () => import('./features/formations/formation-detail/formation-detail.component').then(m => m.FormationDetailComponent)
  },
  {
    path: 'galerie',
    loadComponent: () => import('./features/gallery/gallery-page/gallery-page.component').then(m => m.GalleryPageComponent),
    title: "Notre Galerie — IBE"
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: "À Propos — IBE"
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent),
    title: "FAQ — IBE"
  },
  {
    path: 'localisation',
    loadComponent: () => import('./features/location/location.component').then(m => m.LocationComponent),
    title: "Localisation — IBE"
  },

  // --- ESPACE ADMIN ---
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // --- PAGE 404 ---
  {
    path: '**',
    loadComponent: () => import('./shared/ui/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: "Page introuvable — IBE"
  }
];
