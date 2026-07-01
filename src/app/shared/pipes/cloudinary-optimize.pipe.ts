import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryOptimize',
  standalone: true
})
export class CloudinaryOptimizePipe implements PipeTransform {
  
  /**
   * Transforme une URL Cloudinary brute en URL optimisée
   * @param url L'URL d'origine
   * @param width La largeur désirée en pixels (ex: 400 pour une carte, 800 pour un détail)
   */
  transform(url: string | undefined | null, width: number = 800): string {
    if (!url) return 'assets/img/default-formation.webp';
    
    // Si c'est bien une image Cloudinary et qu'elle n'est pas déjà optimisée
    if (url.includes('cloudinary.com') && !url.includes('/upload/f_auto')) {
      // On injecte f_auto (format auto WebP), q_auto (qualité auto), et w_ (largeur)
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
    
    return url;
  }
}