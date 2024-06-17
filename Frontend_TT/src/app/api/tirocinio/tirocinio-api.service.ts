import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { TirocinioCollaboratoriPUTRequest, TirocinioStatoPUTRequest } from 'src/app/interfaces/api/tirocinio/tirocinio-request-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';
import { TirocinioResponse, TirocinioCompletamentoResponse } from 'src/app/interfaces/api/tirocinio/tirocinio-response-interface';


@Injectable({
  providedIn: 'root'
})
export class TirocinioApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url 
  }

  // Modifica i collaboratori di un determinato tiroconio.
  modificaCollaboratoriTirocinio(id: number, idCollaboratori: number[]): Observable<any> {
    const url = this.url + "/tirocinio/collaboratori";
    const req: TirocinioCollaboratoriPUTRequest = {
      id,
      idCollaboratori
    }
    return this.http.put(url, req);
  }

  // Restituisce tutti gli utenti con ruolo “INTERNO”.
  getInterni(): Observable<Utente[]> {
    const url = this.ApiService.url + "/utente/interni";
    return this.http.get<Utente[]>(url);
  }

  // Effettua una ricerca per nome/cognome tra tutti gli utenti presenti in DB.
  ricercaUtenti(nomeCognome: string): Observable<Utente[]> {
    const url = this.ApiService.url + `/utente/ricerca/${nomeCognome}`;
    return this.http.get<Utente[]>(url);
  }

  // Cambia lo stato del tirocinio
  modificaStatoTirocinio(id: number, statoTirocinio: string): Observable<any> {
    const url = this.url + "/tirocinio/stato";
    const req: TirocinioStatoPUTRequest = {
      id,
      statoTirocinio
    }
    return this.http.put(url, req);
  }

  // Restituisce il completamento di un tirocinio
  getCompletamentoTirocinio(id: number): Observable<TirocinioCompletamentoResponse> {
    const url = this.url + `/tirocinio/completamento/${id}`;
    return this.http.get<TirocinioCompletamentoResponse>(url);
  }

  // Restituisce il singol tirocinio in base all'id
  getTirocinio(id: number): Observable<TirocinioResponse> {
    const url = this.url + `/tirocinio/${id}`;
    return this.http.get<TirocinioResponse>(url);
  }

}
