import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { Allegato } from 'src/app/interfaces/primitive/allegato-interface';

@Injectable({
  providedIn: 'root'
})
export class AllegatiApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url;
  }

  // Restituisce tutti gli allegati associati ad una determinata tesi.
  getAllegatiTesi(idTesi: number): Observable<Allegato[]> {
    const url = this.url + `/tesi/allegati/elenco/${idTesi}`;
    return this.http.get<Allegato[]>(url);
  }

  // Restituisce tutti gli allegati associati ad un determinato tirocinio.
  getAllegatiTirocinio(idTirocinio: number): Observable<Allegato[]> {
    const url = this.url + `/tirocinio/allegati/elenco/${idTirocinio}`;
    return this.http.get<Allegato[]>(url);
  }

}
