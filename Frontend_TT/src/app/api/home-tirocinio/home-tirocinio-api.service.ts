import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { HomeTirocinioStatoPUTRequest } from 'src/app/interfaces/api/home-tirocinio/home-tirocinio-request-interface';
import { HomeTirocinioResponse } from 'src/app/interfaces/api/home-tirocinio/home-tirocinio-response-interface';

@Injectable({
  providedIn: 'root'
})
export class HomeTirocinioApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url + "/tirocinio"
  }

  // Restituisce tutti i tirocini associati all’utente, come tutor, colleboratore e/o studente.
  getAllTirocini(): Observable<HomeTirocinioResponse[]> {
    const url = this.url + "/home";
    return this.http.get<HomeTirocinioResponse[]>(url);
  }

  // Modifica lo stato di un determinato tirocinio in quello desiderato (ad esempio, se il tutor approva un tirocinio, questo riceverà lo stato “IN_CORSO”, oppure se viene concluso riceve lo stato "COMPLETATO").
  modificaStatoTirocinio( id: number, statoTirocinio: string): Observable<any> {
    const url = this.url + "/stato";
    const req: HomeTirocinioStatoPUTRequest = {
      id,
      statoTirocinio
    }
    return this.http.put(url, req);
  }

  // Elimina un tirocinio nel momento in cui il tutor decide di non approvarlo.
  cancellaTirocinio( id: number): Observable<any> {
    const url = this.url + `/${id}`
    return this.http.delete(url);
  }
}
