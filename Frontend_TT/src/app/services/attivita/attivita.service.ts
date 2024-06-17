import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AttivitaApiService } from 'src/app/api/attivita/attivita-api.service';
import { Attivita } from 'src/app/interfaces/primitive/attivita-interface';

@Injectable({
  providedIn: 'root'
})
export class AttivitaService {

  private initAttivita: Attivita = {
    id: -1,
    data: "",
    ore: 0,
    minuti: 0,
    orarioEntrata: "",
    orarioUscita: "",
    attivitaSvolta: "",
  }

  constructor(private attivitaApiService: AttivitaApiService) { }

  private attivita = new BehaviorSubject<Attivita>(this.initAttivita);
  attivita$ = this.attivita.asObservable();

  // Salva un'attività
  public setAttivita(attivita: Attivita): void {
    this.attivita.next(attivita);
  }

  // Aggiorna un'attività
  public async aggiornaAttivita(idAttivia: number) {
    return new Promise<Attivita>((resolve, reject) => {
      this.attivitaApiService.getAttivita(idAttivia).subscribe({
        next: (res) => {
          this.attivita.next(res);
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

  // Ritorna un'attività
  public getAttivita(): Attivita {
    return this.attivita.getValue();
  }

  // Resetta l'attività
  public resetAttivita(): void {
    this.attivita.next(this.initAttivita);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetAttivita();
  }

}
