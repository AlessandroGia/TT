import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TirocinioApiService } from 'src/app/api/tirocinio/tirocinio-api.service';
import { TirocinioResponse } from 'src/app/interfaces/api/tirocinio/tirocinio-response-interface';

@Injectable({
  providedIn: 'root'
})
export class TirocinioService {


  private initTirocinio: TirocinioResponse = {
    tirocinio: {
      id: -1,
      laboratorio: "",
      nomeCDS: "",
      tutor: "",
      studente: "",
      oreSvolte: 0,
      minutiSvolti: 0,
      durata: 0,
      cfu: 0,
      statoTirocinio: "",
      collaboratori: []
    },
    ruoloUtente: ""
  };

  constructor(private tirocinioApiService: TirocinioApiService) { }

  private tirocinio = new BehaviorSubject<TirocinioResponse>(this.initTirocinio);
  tirocinio$ = this.tirocinio.asObservable();

  // Salva l'oggetto del tirocinio
  public setTirocinio(tesi: TirocinioResponse): void {
    this.tirocinio.next(tesi);
  }

  public async aggiornaTirocinio(id: number) {
    return new Promise<TirocinioResponse>((resolve, reject) => {
      this.tirocinioApiService.getTirocinio(id).subscribe({
        next: (res) => {
          this.tirocinio.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err)
        }
      });
    });
  }

  // Controlla la validità del ruolo
  public checkValiditaRuolo(ruoloUtente: string): boolean {
    if (ruoloUtente === undefined || ruoloUtente === null || ruoloUtente === "")
      return false;
    return true
  }

  // Controlla se il tirocinio è modificabile
  public checkTirocinioIsModificabile(stato: string, ruoloUtente: string): boolean {
    if (stato === "COMPLETATO" || stato=== "ARCHIVIATO" || ruoloUtente !== "STUDENTE") 
      return false;
    return true;
  }


  // Ritorna l'oggetto del tirocinio
  public getTirocinio(): TirocinioResponse {
    return this.tirocinio.getValue();
  }
  
  // Resetta l'oggetto del tirocinio
  public resetTirocinio(): void {
    this.tirocinio.next(this.initTirocinio);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetTirocinio();
  }
  
}
