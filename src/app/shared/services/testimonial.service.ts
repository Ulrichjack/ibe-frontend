import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TestimonialCreateRequest, TestimonialResponse } from '../../features/testimonial/data-access/testimonial.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';


@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/testimonials`;

  getPublies(page = 0, size = 10): Observable<ApiResponse<PageResponse<TestimonialResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<TestimonialResponse>>>(this.baseUrl, { params });
  }

  getTous(page = 0, size = 20): Observable<ApiResponse<PageResponse<TestimonialResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<TestimonialResponse>>>(`${this.baseUrl}/admin`, { params });
  }

  creer(data: any): Observable<ApiResponse<TestimonialResponse>> {
    return this.http.post<ApiResponse<TestimonialResponse>>(this.baseUrl, data); // Pas de /admin ici !
  }

  togglePublication(id: number): Observable<ApiResponse<TestimonialResponse>> {
    return this.http.patch<ApiResponse<TestimonialResponse>>(`${this.baseUrl}/${id}/publier`, {});
  }

  supprimer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

}