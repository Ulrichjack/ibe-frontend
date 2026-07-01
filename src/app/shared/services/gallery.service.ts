import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { GalleryImageResponse } from '../models/gallery.model';


@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/gallery`;

  getImagesPubliques(page = 0, size = 6): Observable<ApiResponse<PageResponse<GalleryImageResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<GalleryImageResponse>>>(this.baseUrl, { params });
  }

  getToutesImages(page :number, size:number): Observable<ApiResponse<PageResponse<GalleryImageResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<GalleryImageResponse>>>(this.baseUrl, { params });
  }

  ajouterImage(formData: FormData): Observable<ApiResponse<GalleryImageResponse>> {
    return this.http.post<ApiResponse<GalleryImageResponse>>(`${this.baseUrl}/upload`, formData);
  }

  supprimerImage(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

}
