import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AllegatiApiService } from 'src/app/api/allegati/allegati-api.service';
import { Allegato } from 'src/app/interfaces/primitive/allegato-interface';

@Injectable({
  providedIn: 'root'
})
export class AllegatiTesiTirocinioService {
  private initAllegato: Allegato[] = []

  constructor(private allegatiApiService: AllegatiApiService) { }

  private allegatiTesi = new BehaviorSubject<Allegato[]>(this.initAllegato);
  allegatiTesi$ = this.allegatiTesi.asObservable();

  private allegatiTirocini = new BehaviorSubject<Allegato[]>(this.initAllegato);
  allegatiTirocini$ = this.allegatiTirocini.asObservable();

  // Salva gli allegati delle tesi
  public setTesiAllegati(tesiRes: Allegato[]): void {
    this.allegatiTesi.next(tesiRes);
  }

  // Salva gli allegati dei tirocini
  public setTirocinioAllegati(tirociniRes: Allegato[]): void {
    this.allegatiTirocini.next(tirociniRes);
  }

  // Aggiorna gli allegati della tesi per la visualizzazione nella pagina corrispondente
  public async preparaTesiAllegati(idTesi: number) {
    return new Promise<Allegato[]>((resolve, reject) => {
      this.allegatiApiService.getAllegatiTesi(idTesi).subscribe({
        next: (res) => {
          this.allegatiTesi.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err)
        }
      });
    });
  }

  // Aggiorna gli allegati dei tirocini per la visualizzazione nella pagina corrispondente
  public async preparaTirocinioAllegati(idTirocinio: number) {
    return new Promise<Allegato[]>((resolve, reject) => {
      this.allegatiApiService.getAllegatiTirocinio(idTirocinio).subscribe({
        next: (res) => {
          this.allegatiTirocini.next(res);
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

  // Controlla se gli allegati sono modificabili
  public checkAllegatiIsModificabile(stato: string): boolean {
    if (stato === "ARCHIVIATO" || stato === "COMPLETATO" || stato === "ARCHIVIATA" || stato === "CONCLUSA") 
      return false;
    return true;
  }

  // Ritorna gli allegati delle tesi
  public getTesiAllegati(): Allegato[] {
    return this.allegatiTesi.getValue();
  }

  // Ritorna gli allegati dei tirocini
  public getTirocinioAllegati(): Allegato[] {
    return this.allegatiTirocini.getValue();
  }

  // Resetta gli allegati delle tesi
  public resetAllegatiTesi() {
    this.allegatiTesi.next(this.initAllegato);
  }

  // Resetta gli allegati dei tirocini
  public resetAllegatiTirocinio() {
    this.allegatiTirocini.next(this.initAllegato);
  }

  // Resetta tutti gli allegati
  public resetAll() {
    this.resetAllegatiTesi();
    this.resetAllegatiTirocinio();
  }
}
