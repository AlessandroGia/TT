import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { HomeTesiStatoPUTRequest } from 'src/app/interfaces/api/home-tesi/home-tesi-request-interface';
import { HomeTesiResponse } from 'src/app/interfaces/api/home-tesi/home-tesi-response-interface';

@Injectable({
  providedIn: 'root'
})
export class HomeTesiApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url + "/tesi"
  }

  // Restituisce tutte le tesi associate all’utente, come relatore, correlatore e/o studente.
  getAllTesi(): Observable<HomeTesiResponse[]> {
    const url = this.url + "/home";
    return this.http.get<HomeTesiResponse[]>(url);
  }

  // Modifica lo stato di una determinata tesi in quello desiderato (ad esempio, se il relatore approva una tesi, questa riceverà lo stato “IN_CORSO”, oppure se viene conclusa riceve lo stato “CONCLUSA”).
  modificaStatoTesi(id: number, statoTesi: string): Observable<any> {
    const url = this.url + "/stato";
    const req: HomeTesiStatoPUTRequest = {
      id,
      statoTesi
    }
    return this.http.put(url, req);
  }

  // Elimina una tesi nel momento in cui il relatore decide di non approvarla.
  cancellaTesi(id: number): Observable<any> {
    const url = this.url + `/${id}`
    return this.http.delete(url);
  }

}
