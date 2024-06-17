import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElencoAttivitaApiService } from 'src/app/api/elenco-attivita/elenco-attivita-api.service';
import { ElencoAttivitaResponse } from 'src/app/interfaces/api/elenco-attivita/elenco-attivita-response-interface';
import { Attivita } from 'src/app/interfaces/primitive/attivita-interface';

@Injectable({
  providedIn: 'root'
})
export class ElencoAttivitaService {
  private initAttvitaRes: ElencoAttivitaResponse = {
    oreSvolte: 0,
    minutiSvolti: 0,
    durata: 0,
    elencoAttivita: []
  }

  constructor(private elencoAttivitaApiService: ElencoAttivitaApiService) { }

  private attivitaRes = new BehaviorSubject<ElencoAttivitaResponse>(this.initAttvitaRes);
  attivitaRes$ = this.attivitaRes.asObservable();

  // Salva le attività relative ad un determinato tirocinio
  public setAttivita(attivitaRes: ElencoAttivitaResponse): void {
    this.attivitaRes.next(attivitaRes);
  }

  // Aggiorna le attività relative ad un determinato tirocinio per la visualizzazione nella pagina corrispondente
  public async aggiornaAttivita(idTirocinio: number) {
    return new Promise<ElencoAttivitaResponse>((resolve, reject) => {
      this.elencoAttivitaApiService.getAttivita(idTirocinio).subscribe({
        next: (res) => {
          this.attivitaRes.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err)
        }
      });
    });
  }
  
  // Controlla la validità del ruolo
  public checkRuoloUtente(ruoloUtente: string): boolean {
    if (ruoloUtente === undefined || ruoloUtente === null || ruoloUtente === "")
      return false;
    return true;
  }

  // Controlla se si possono modificare le attività
  public checkIsModificabile(statoTirocinio: string, ruoloUtente: string): boolean {
    if (statoTirocinio === "COMPLETATO" || statoTirocinio === "ARCHIVIATO" || ruoloUtente !== "STUDENTE") {
      return false;
    } else {
      return true;
    }
  }

  // Ritorna le attività relative ad un determinato tirocinio
  public getAttivita(): ElencoAttivitaResponse {
    return this.attivitaRes.getValue();
  }

  // Resetta le attività
  public resetAttivita(): void {
    this.attivitaRes.next(this.initAttvitaRes);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetAttivita();
  }

}
