import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { AllegatoPUTRequest } from 'src/app/interfaces/api/allegato/allegato-request-interface';
import { AllegatoTipologiaResponse } from 'src/app/interfaces/api/allegato/allegato-response-interface';
import { Allegato } from 'src/app/interfaces/primitive/allegato-interface';
import { Tipologia } from 'src/app/interfaces/primitive/tipologia-interface';

import { Directory, Filesystem, Encoding } from '@capacitor/filesystem'
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class AllegatoApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService, private platform: Platform) {
    this.url = this.ApiService.url;
  }


  // Modifica nome e/o nota di un allegato relativo ad una tesi.
  modificaAllegatoTesi(id: number, nome: string, idTipologia: number, nota: string): Observable<Allegato> {
    const url = this.url + "/tesi/allegati";
    const req: AllegatoPUTRequest = {
      id,
      nome,
      idTipologia,
      nota
    }
    return this.http.put<Allegato>(url, req);
  }

  // Elimina un allegato relativo ad una tesi.
  eliminaAllegatoTesi(id: number): Observable<any> {
    const url = this.url + `/tesi/allegati/${id}`
    return this.http.delete(url);
  }

  // Modifica nome e/o nota di un allegato relativo ad un tirocinio.
  modificaAllegatoTirocinio(id: number, nome: string, idTipologia: number, nota: string): Observable<any> {
    const url = this.url + "/tirocinio/allegati";
    const req: AllegatoPUTRequest = {
      id,
      nome,
      idTipologia,
      nota
    }
    return this.http.put(url, req);
  }

  // Elimina un allegato relativo ad un tirocinio.
  eliminaAllegatoTirocinio(id: number): Observable<any> {
    const url = this.url + `/tirocinio/allegati/${id}`
    return this.http.delete(url);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad una tesi.
  getTipologieAllegatiTesi(): Observable<Tipologia[]> {
    const url = this.url + "/tesi/allegati/tipologie";
    return this.http.get<Tipologia[]>(url);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad un tirocinio.
  getTipologieAllegatiTirocinio(): Observable<Tipologia[]> {
    const url = this.url + "/tirocinio/allegati/tipologie";
    return this.http.get<Tipologia[]>(url);
  }

  // Restituisce le informazioni di un allegato relativo ad una tesi.
  getAllegatoTesi(id: number): Observable<Allegato> {
    const url = this.url + `/tesi/allegati/${id}`;
    return this.http.get<Allegato>(url);
  }

  // Restituisce le informazioni di un allegato relativo ad un tirocinio.
  getAllegatoTirocinio(id: number): Observable<Allegato> {
    const url = this.url + `/tirocinio/allegati/${id}`;
    return this.http.get<Allegato>(url);
  }

  // Scarica il file relativo ad un allegato della tesi.
  scaricaAllegatoTesi(id: number): Observable<{ filename: string, data: Blob }> {
    const url = this.url + `/tesi/allegati/scarica/${id}`;
  
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        let filename = `file_${id}`;
  
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=(['"]?)([^'";\n]+)\1/.exec(contentDisposition);
          if (matches && matches[2]) {
            filename = matches[2];
          } 
        } 
        return { filename, data: response.body as Blob };
      })
    );
  }
  
  

  // Scarica il file relativo ad un allegato del tirocinio.
  scaricaAllegatoTirocinio(id: number): Observable<{ filename: string, data: Blob }> {
    const url = this.url + `/tirocinio/allegati/scarica/${id}`;

    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        let filename = `file_${id}`;
  
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=(['"]?)([^'";\n]+)\1/.exec(contentDisposition);
          if (matches && matches[2]) {
            filename = matches[2];
          } else { }
        } else { }
  
        return { filename, data: response.body as Blob };
      })
    );
  }
  
}
