import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { FormationResponse, FormationCreateRequest } from '../../features/formations/data-access/formation.model';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/formations`;

  // PUBLIC
  getFormationsActives(page = 0, size = 12): Observable<ApiResponse<PageResponse<FormationResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<FormationResponse>>>(`${this.baseUrl}/actives`, { params });
  }

  getFormationBySlug(slug: string): Observable<ApiResponse<FormationResponse>> {
    return this.http.get<ApiResponse<FormationResponse>>(`${this.baseUrl}/slug/${slug}`);
  }

  rechercher(terme: string, page = 0, size = 12): Observable<ApiResponse<PageResponse<FormationResponse>>> {
    const params = new HttpParams().set('q', terme).set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<FormationResponse>>>(`${this.baseUrl}/search`, { params });
  }

  // ADMIN (L'intercepteur ajoutera le token plus tard)
  creerFormation(request: FormationCreateRequest): Observable<ApiResponse<FormationResponse>> {
    return this.http.post<ApiResponse<FormationResponse>>(this.baseUrl, request);
  }

  modifierFormation(id: number, request: FormationCreateRequest): Observable<ApiResponse<FormationResponse>> {
    return this.http.put<ApiResponse<FormationResponse>>(`${this.baseUrl}/${id}`, request);
  }

  desactiverFormation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }


  // Récupère TOUTES les formations (Actives et Inactives)
  getFormationsAdmin(page = 0, size = 20, search = '', status = 'ALL'): Observable<ApiResponse<PageResponse<FormationResponse>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('status', status);
      
    if (search) {
      params = params.set('q', search);
    }
    
    return this.http.get<ApiResponse<PageResponse<FormationResponse>>>(`${this.baseUrl}/admin`, { params });
  }

  // Réactiver une formation
  activerFormation(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/activer`, {});
  }


  getFormationById(id: number): Observable<ApiResponse<FormationResponse>> {
    return this.http.get<ApiResponse<FormationResponse>>(`${this.baseUrl}/${id}`);
  }


}
