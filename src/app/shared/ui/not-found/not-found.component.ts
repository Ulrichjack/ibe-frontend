import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideSearchX } from '@lucide/angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideSearchX],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div class="w-24 h-24 bg-ibe-100 rounded-full flex items-center justify-center text-ibe-500 mb-6">
        <svg lucideSearchX [size]="48"></svg>
      </div>
      <h1 class="text-6xl font-serif text-ibe-dark mb-4">404</h1>
      <h2 class="text-2xl text-ibe-600 mb-6">Page introuvable</h2>
      <p class="text-ibe-muted max-w-md mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
      <a routerLink="/" class="btn-primary">Retour à l'accueil</a>
    </div>
  `
})
export class NotFoundComponent {}