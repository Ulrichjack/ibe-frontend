import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // On stocke le token (Base64) dans un Signal.
  // En production, on pourrait le mettre dans le sessionStorage, mais en mémoire c'est plus sécurisé.
  private readonly _token = signal<string | null>(sessionStorage.getItem('ibe_admin_token'));

  readonly isLoggedIn = computed(() => this._token() !== null);

  login(username: string, password: string): Observable<boolean> {
    // Encodage Basic Auth (Base64)
    const credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization: `Basic ${credentials}` });

    // On fait un appel sur une route admin (ex: stats) pour vérifier si les identifiants sont bons
    return this.http.get(`${environment.apiUrl}/messages/stats/non-lus`, { headers }).pipe(
      tap(() => {
        this._token.set(credentials);
        sessionStorage.setItem('ibe_admin_token', credentials); // Persistance pendant la session
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this._token.set(null);
    sessionStorage.removeItem('ibe_admin_token');
  }

  getToken(): string | null {
    return this._token();
  }
}
