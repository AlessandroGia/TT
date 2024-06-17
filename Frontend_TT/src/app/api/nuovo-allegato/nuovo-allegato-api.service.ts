import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { NuovoAllegatoTesiPOSTRequest, NuovoAllegatoTirocinioPOSTRequest } from 'src/app/interfaces/api/nuovo-allegato/nuovo-allegato-request-interface';
import { NuovoAllegatoPercorsoResponse, NuovoAllegatoTipologiaResponse } from 'src/app/interfaces/api/nuovo-allegato/nuovo-allegato-response-interface';

@Injectable({
  providedIn: 'root'
})
export class NuovoAllegatoApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url;
  }

  // Aggiunge un nuovo allegato alla tesi.
  aggiungiAllegatoTesi(idTesi: number, nome: string, idTipologia: number, nota: string, file: File): Observable<any> {
    const url = this.url + "/tesi/allegati";
    const formData: FormData = new FormData();

    formData.append('idTesi', idTesi.toString());
    formData.append('nome', nome);
    formData.append('idTipologia', idTipologia.toString());
    formData.append('nota', nota);
    formData.append('file', file);

    return this.http.post(url, formData);
}
  
  // Aggiunge un nuovo allegato al tirocinio.
  aggiungiAllegatoTirocinio(idTirocinio: number, nome: string, idTipologia: number, nota: string, file: File): Observable<any> {
    const url = this.url + "/tirocinio/allegati";
    const formData: FormData = new FormData();

    formData.append('idTirocinio', idTirocinio.toString());
    formData.append('nome', nome);
    formData.append('idTipologia', idTipologia.toString());
    formData.append('nota', nota);
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad una tesi.
  getTipologieAllegatiTesi(): Observable<NuovoAllegatoTipologiaResponse[]> {
    const url = this.url + "/tesi/allegati/tipologie";
    return this.http.get<NuovoAllegatoTipologiaResponse[]>(url);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad un tirocinio.
  getTipologieAllegatiTirocinio(): Observable<NuovoAllegatoTipologiaResponse[]> {
    const url = this.url + "/tirocinio/allegati/tipologie";
    return this.http.get<NuovoAllegatoTipologiaResponse[]>(url);
  }

}
