import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { NuovoTirocinioPOSTRequest } from 'src/app/interfaces/api/nuovo-tirocinio/nuovo-tirocinio-request-interface';
import { Laboratorio } from 'src/app/interfaces/primitive/laboratorio-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';

@Injectable({
  providedIn: 'root'
})
export class NuovoTirocinioApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url 
  }

  // Crea un nuovo tirocinio
  creaNuovoTirocinio(idLaboratorio: number, idTutor: number, nomeCDS: string, cfu: number, durata: number, idCollaboratori: number[]): Observable<any> {
    const url = this.url + "/tirocinio";
    const req: NuovoTirocinioPOSTRequest = {
      idLaboratorio,
      idTutor,
      nomeCDS,
      cfu,
      durata,
      idCollaboratori
    };
    return this.http.post(url, req);
  }

  // Restituisce i laboratori
  getLaboratori(): Observable<Laboratorio[]> {
    const url = this.url + "/laboratorio";
    return this.http.get<Laboratorio[]>(url);
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
