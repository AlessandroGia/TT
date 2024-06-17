import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AllegatiApiService } from 'src/app/api/allegati/allegati-api.service';
import { AllegatoApiService } from 'src/app/api/allegato/allegato-api.service';
import { Allegato } from 'src/app/interfaces/primitive/allegato-interface';

@Injectable({
  providedIn: 'root'
})
export class AllegatoService {

  private initAllegato = {
    id: -1,
    nome: '',
    nota: '',
    percorso: '',
    nomeTipologia: ''
  };

  constructor(private allegatoApiService: AllegatoApiService) { }

  private allegatoTesi = new BehaviorSubject<Allegato>(this.initAllegato);
  allegatoTesi$ = this.allegatoTesi.asObservable();

  private allegatoTirocinio = new BehaviorSubject<Allegato>(this.initAllegato);
  allegatoTirocinio$ = this.allegatoTirocinio.asObservable();

  // Salva l'allegato della tesi
  public setAllegato(allegato: Allegato): void {
    this.allegatoTesi.next(allegato);
  }

  // Salva l'allegato del tirocinio
  public setAllegatoTirocinio(allegato: Allegato): void {
    this.allegatoTirocinio.next(allegato);
  }

  // Aggiorna l'allegato per la tesi
  public async aggiornaAllegatoTesi(id: number) {
    return new Promise<Allegato>((resolve, reject) => {
      this.allegatoApiService.getAllegatoTesi(id).subscribe({
        next: (res) => {
          this.allegatoTesi.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  // Aggiorna l'allegato per il tirocinio
  public async aggiornaAllegatoTirocinio(id: number) {
    return new Promise<Allegato>((resolve, reject) => {
      this.allegatoApiService.getAllegatoTirocinio(id).subscribe({
        next: (res) => {
          this.allegatoTirocinio.next(res);
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

  // Controlla se gli allegati sono modificabili
  public checkAllegatiIsModificabile(stato: string): boolean {
    if (stato === "ARCHIVIATO" || stato === "COMPLETATO" || stato === "ARCHIVIATA" || stato === "CONCLUSA") 
      return false;
    return true;
  }


  // Restituisce l'allegato della tesi
  public getAllegatoTesi(): Allegato {
    return this.allegatoTesi.getValue();
  }

  // Restituisce l'allegato del tirocinio
  public getAllegatoTirocinio(): Allegato {
    return this.allegatoTirocinio.getValue();
  }

  // Resetta l'allegato della tesi
  public resetAllegatoTesi() {
    this.allegatoTesi.next(this.initAllegato);
  }

  // Resetta l'allegato del tirocinio
  public resetAllegatoTirocinio() {
    this.allegatoTirocinio.next(this.initAllegato);
  }

  // Resetta tutto
  public resetAll() {
    this.resetAllegatoTesi();
    this.resetAllegatoTirocinio();
  }

}
