import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { AttivitaPUTRequest } from 'src/app/interfaces/api/attivita/attivita-request-interface';

@Injectable({
  providedIn: 'root'
})
export class AttivitaApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url + "/tirocinio/attivita";
  }

  // Modifica la nota “Attività svolta” di una determinata attività.
  modificaAttivita(id: number, attivitaSvolta: string): Observable<any> {
    const req: AttivitaPUTRequest = {
      id,
      attivitaSvolta
    }
    return this.http.put(this.url, req);
  }

  // Elimina una determinata attività.
  cancellaAttivita(id: number): Observable<any> {
    const url = this.url + `/${id}`
    return this.http.delete(url);
  }

  // Restituisce l'attività relativa ad un determinato id
  getAttivita(idAttivita: number): Observable<any> {
    const url = this.url + `/${idAttivita}`;
    return this.http.get(url);
  }
  
}
