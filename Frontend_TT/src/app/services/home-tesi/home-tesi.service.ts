import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeTesiApiService } from 'src/app/api/home-tesi/home-tesi-api.service';
import { HomeTesiResponse } from 'src/app/interfaces/api/home-tesi/home-tesi-response-interface';

@Injectable({
  providedIn: 'root'
})
export class HomeTesiService {

  private initTesiRes: HomeTesiResponse[] = [];

  constructor(private homeTesiApiService: HomeTesiApiService) { }

  private tesiRes = new BehaviorSubject<HomeTesiResponse[]>(this.initTesiRes);
  tesiRes$ = this.tesiRes.asObservable();

  private filtroRuoloSelezionato = new BehaviorSubject<string>("");
  filtroRuoloSelezionato$ = this.filtroRuoloSelezionato.asObservable();

  private filtroStatiSelezionati = new BehaviorSubject<string[]>([]);
  filtroStatiSelezionati$ = this.filtroStatiSelezionati;

  // Salva il ruolo selezionato
  public setFiltroRuoloSelezionato(ruolo: string): void {
    this.filtroRuoloSelezionato.next(ruolo);
  }

  // Salva i stati selzionati
  public setFiltroStatiSelezionati(stati: string[]): void {
    this.filtroStatiSelezionati.next([...stati]);
  }

  // Salva l'oggetto del tirocinio
  public setTesiObj(tesiRes: HomeTesiResponse[]): void {
    this.tesiRes.next(tesiRes);
  }

  public async preparaTesiObj() {
    return new Promise<HomeTesiResponse[]>((resolve, reject) => {
      this.homeTesiApiService.getAllTesi().subscribe({
        next: (res) => {
          this.tesiRes.next(res);
          resolve(res);
        },
        error: (err) => {
          reject(err)
        }
      });
    });
  }

  // Ritorna il ruolo selezionato
  public getFiltroRuoloSelezionato(): string {
    return this.filtroRuoloSelezionato.getValue();
  }

  //Ritorna i stati selezionati
  public getFiltroStatiSelezionati(): string[] {
    return this.filtroStatiSelezionati.getValue();
  }

  // Ritorna l'oggetto del tirocinio
  public getTesiObj(): HomeTesiResponse[] {
    return this.tesiRes.getValue();
  }

  // Resetta l'oggetto delle tesi
  public resetTesiObj(): void {
    this.tesiRes.next(this.initTesiRes);
  }


  // Resetta i filtri
  public resetFiltri(): void {
    this.filtroRuoloSelezionato.next("");
    this.filtroStatiSelezionati.next([]);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetTesiObj();
    this.resetFiltri();
  }


}
