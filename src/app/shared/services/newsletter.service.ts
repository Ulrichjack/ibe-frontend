import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { NewsletterResponse, NewsletterSubscribeRequest } from '../models/newsletter.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/newsletter`;

  subscribe(request: NewsletterSubscribeRequest): Observable<ApiResponse<NewsletterResponse>> {
    return this.http.post<ApiResponse<NewsletterResponse>>(`${this.baseUrl}/subscribe`, request);
  }

  getAbonnes(page: number, size: number): Observable<ApiResponse<PageResponse<NewsletterResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<NewsletterResponse>>>(this.baseUrl, { params });
}

  marquerContacte(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/contacte`, {});
  }

}
