import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TesiApiService } from 'src/app/api/tesi/tesi-api.service';
import { TesiResponse } from 'src/app/interfaces/api/tesi/tesi-response-interface';

@Injectable({
  providedIn: 'root'
})
export class TesiService {

  private initTesi: TesiResponse = {
    tesi: {
      id: -1,
      titolo: "",
      insegnamento: "",
      nomeCDS: "",
      dataDiscussione: "",
      relatore: "",
      studente: "",
      statoTesi: "",
      correlatori: []
    },
    ruoloUtente: ""
  };

  constructor(private tesiApiService: TesiApiService) { }

  private tesi = new BehaviorSubject<TesiResponse>(this.initTesi);
  tesi$ = this.tesi.asObservable();

  // Salva la tesi
  public setTesi(tesi: TesiResponse): void {
    this.tesi.next(tesi);
  }

  public async aggiornaTesi(id: number) {
    return new Promise<TesiResponse>((resolve, reject) => {
      this.tesiApiService.getTesi(id).subscribe({
        next: (res) => {
          this.tesi.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err);
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

  // Controlla se la tesi è modificabile
  public checkTesiIsModificabile(stato: string, ruoloUtente: string): boolean {
    if (stato === "CONCLUSA" || stato=== "ARCHIVIATA" || ruoloUtente !== "STUDENTE") 
      return false;
    return true;
  }

  // Ritorna la tesi
  public getTesi(): TesiResponse {
    return this.tesi.getValue();
  }

  // Resetta la tesi
  public resetTesi(): void {
    this.tesi.next(this.initTesi);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetTesi();
  }

}
