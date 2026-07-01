import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { ContactCreateRequest, PreInscriptionRequest, MessageResponse, MessageListResponse } from '../../features/messages/data-access/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/messages`;

  // PUBLIC
  soumettreContact(request: ContactCreateRequest): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(`${this.baseUrl}/contact`, request);
  }

  soumettrePreInscription(request: PreInscriptionRequest): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(`${this.baseUrl}/pre-inscription`, request);
  }

  // ADMIN
  getMessages(page = 0, size = 20): Observable<ApiResponse<PageResponse<MessageListResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<MessageListResponse>>>(this.baseUrl, { params });
  }

  marquerCommeLu(id: number): Observable<ApiResponse<MessageListResponse>> {
    return this.http.patch<ApiResponse<MessageListResponse>>(`${this.baseUrl}/${id}/lu`, {});

  }

  marquerCommeTraite(id: number): Observable<ApiResponse<MessageListResponse>> {
    return this.http.patch<ApiResponse<MessageListResponse>>(`${this.baseUrl}/${id}/traite`, {});

  }
  marquerCommeArchive(id: number): Observable<ApiResponse<MessageListResponse>> {
    return this.http.patch<ApiResponse<MessageListResponse>>(`${this.baseUrl}/${id}/archive`, {});

  }

  getNonLusCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/stats/non-lus`);
  }
}
