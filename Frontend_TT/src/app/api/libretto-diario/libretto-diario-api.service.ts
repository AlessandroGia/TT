import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { LibrettoDiarioPOSTRequest } from 'src/app/interfaces/api/libretto-diario/libretto-diario-request-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';

@Injectable({
  providedIn: 'root'
})
export class LibrettoDiarioApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService) {
    this.url = this.ApiService.url;
  }

  // Genera il libretto diario relativo al tirocinio e le relative attività.
  generaLibrettoDiario(idTirocinio: number, dataProgForm: string, tutorUniv: string, dataInizio: string, dataFine: string, annotazioni: string): Observable<{ filename: string, data: Blob }> {
    const url = this.url + "/tirocinio/generalibd";
    const req: LibrettoDiarioPOSTRequest = {
      idTirocinio,
      dataProgForm,
      tutorUniv,
      dataInizio,
      dataFine,
      annotazioni
    }

    return this.http.post(url, req, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        const filename = matches != null && matches[1] ? matches[1] : `file`;
        return { filename, data: response.body as Blob };
      })
    );
  }


  // Restituisce tutti gli utenti con ruolo “DOCENTE”.
  getDocenti(): Observable<Utente[]> {
    const url = this.url + "/utente/docenti";
    return this.http.get<Utente[]>(url);
  }
}
