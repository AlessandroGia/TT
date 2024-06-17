import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { TesiCorrelatoriPUTRequest, TesiDataDiscussionePUTRequest, TesiStatoPUTRequest, TesiTitoloPUTRequest } from 'src/app/interfaces/api/tesi/tesi-request-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';
import { Tesi } from 'src/app/interfaces/primitive/tesi-interface';
import { TesiResponse } from 'src/app/interfaces/api/tesi/tesi-response-interface';

@Injectable({
  providedIn: 'root'
})
export class TesiApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url;
  }

  // Modifica il titolo di una determinata tesi.
  modificaTitoloTesi(id: number, titolo: string): Observable<any> {
    const url = this.url + "/tesi/titolo";
    const req: TesiTitoloPUTRequest = {
      id,
      titolo
    }
    return this.http.put(url, req);
  }

  // Modifica i correlatori di una determinata tesi.
  modificaCorrelatoriTesi(id: number, idCorrelatori: number[]): Observable<any> {
    const url = this.url + "/tesi/correlatori";
    const req: TesiCorrelatoriPUTRequest = {
      id,
      idCorrelatori
    }
    return this.http.put(url, req);
  }

  // Restituisce gli utenti con ruolo INTERNI
  getInterni(): Observable<Utente[]> {
    const url = this.url + "/utente/interni";
    return this.http.get<Utente[]>(url);
  }

  // Restituisce gli utenti dalla ricerca
  getRicerca(ricerca: string): Observable<Utente[]> {
    const url = this.url + `/utente/ricerca/${ricerca}`;
    return this.http.get<Utente[]>(url);
  }

  // Modifica la data discussione di una determianta tesi.
  cambiaDataDiscussioneTesi(id: number, dataDiscussione: string): Observable<any> {
    const url = this.url + "/tesi/data";
    const req: TesiDataDiscussionePUTRequest = {
      id,
      dataDiscussione
    }
    return this.http.put(url, req);
  }

  // Cambia lo stato della tesi
  cambiaStatoTesi(id: number, statoTesi: string): Observable<any> {
    const url = this.url + "/tesi/stato";
    const req: TesiStatoPUTRequest = {
      id,
      statoTesi
    }
    return this.http.put(url, req);
  }

  // Restituisce la tesi in base all'id
  getTesi(id: number): Observable<TesiResponse> {
    const url = this.url + `/tesi/${id}`;
    return this.http.get<TesiResponse>(url);
  }

}
