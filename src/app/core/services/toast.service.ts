import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;

  // On utilise un Signal pour stocker la liste des toasts actifs
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void { this.add('success', message); }
  error(message: string): void   { this.add('error', message); }
  warning(message: string): void { this.add('warning', message); }
  info(message: string): void    { this.add('info', message); }

  private add(type: ToastType, message: string): void {
    const id = ++this.counter;
    this.toasts.update(currentToasts => [...currentToasts, { id, type, message }]);

    // Auto-suppression après 4 secondes
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number): void {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}
