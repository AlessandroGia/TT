import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { ElencoAttivitaResponse } from 'src/app/interfaces/api/elenco-attivita/elenco-attivita-response-interface';

@Injectable({
  providedIn: 'root'
})
export class ElencoAttivitaApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url + "/tirocinio/attivita";
  }

  // Restituisce tutte le attività relative ad un determinato tirocinio 
  getAttivita(idTirocinio: number): Observable<ElencoAttivitaResponse> {
    const url = this.url + `/elenco/${idTirocinio}`;
    return this.http.get<ElencoAttivitaResponse>(url);
  }

}
