import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { NuovaTesiPOSTRequest } from 'src/app/interfaces/api/nuova-tesi/nuova-tesi-request-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';

@Injectable({
  providedIn: 'root'
})
export class NuovaTesiApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url;
  }

  // Crea una nuova tesi
  creaNuovaTesi(titolo: string, insegnamento: string, nomeCDS: string, idRelatore: number, idCorrelatori: number[]): Observable<any> {
    const url = this.url + "/tesi";
    const req: NuovaTesiPOSTRequest = {
      titolo,
      insegnamento,
      nomeCDS,
      idRelatore,
      idCorrelatori
    };
    return this.http.post(url, req);
  }

  // Restituisce gli utenti con ruolo "DOCENTE"
  getDocenti(): Observable<Utente[]> {
    const url = this.url + "/utente/docenti";
    return this.http.get<Utente[]>(url);
  }

  // Restituisce gli utenti con ruolo "STUDENTE"
  getInterni(): Observable<Utente[]> {
    const url = this.url + "/utente/interni";
    return this.http.get<Utente[]>(url);
  }

  // Restituisce il risultato della query di ricerca
  cercaUtente(query: string): Observable<Utente[]> {
    const url = this.url + `/utente/ricerca/${query}`;
    return this.http.get<Utente[]>(url);
  }
}
