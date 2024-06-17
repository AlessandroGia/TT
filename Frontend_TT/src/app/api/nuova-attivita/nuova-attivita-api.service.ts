import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { NuovaAttivitaPOSTRequest } from 'src/app/interfaces/api/nuova-attivita/nuova-attivita-request-interface';

@Injectable({
  providedIn: 'root'
})
export class NuovaAttivitaApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url + "/tirocinio/attivita";
  }

  // Crea una nuova attività e la aggiunge al DB.
  creaAttivita(idTirocinio: number, data: string, orarioEntrata: string, orarioUscita: string, ore: number, minuti: number, attivitaSvolta: string): Observable<any> {
    const req: NuovaAttivitaPOSTRequest = {  
      idTirocinio,
      data,
      orarioEntrata,
      orarioUscita,
      ore,
      minuti,
      attivitaSvolta
    }
    return this.http.post(this.url, req);
  }

}
