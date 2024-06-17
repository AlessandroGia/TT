import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeTirocinioApiService } from 'src/app/api/home-tirocinio/home-tirocinio-api.service';
import { HomeTirocinioResponse } from 'src/app/interfaces/api/home-tirocinio/home-tirocinio-response-interface';

@Injectable({
  providedIn: 'root'
})
export class HomeTirocinioService {


  private initTirociniRes: HomeTirocinioResponse[] = []


  constructor(private homeTirocinioApiService: HomeTirocinioApiService) { }

  private tirocinioRes = new BehaviorSubject<HomeTirocinioResponse[]>(this.initTirociniRes);
  tirocinioRes$ = this.tirocinioRes.asObservable();

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
  public setTirocinioObj(tirociniRes: HomeTirocinioResponse[]): void {
    this.tirocinioRes.next(tirociniRes);
  }

  public async preparaTirocinioObj() {
    return new Promise<HomeTirocinioResponse[]>((resolve, reject) => {
      this.homeTirocinioApiService.getAllTirocini().subscribe({
        next: (res) => {
          this.tirocinioRes.next(res);
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
  public getTirocinioObj(): HomeTirocinioResponse[] {
    return this.tirocinioRes.getValue();
  }

  // Resetta l'oggetto dei tirocini
  public resetTirocinioObj(): void {
    this.tirocinioRes.next(this.initTirociniRes);
  }

  // Resetta i filtri
  public resetFilters(): void {
    this.filtroRuoloSelezionato.next("");
    this.filtroStatiSelezionati.next([]);
  }

  // Resetta tutto
  public resetAll(): void {
    this.resetTirocinioObj();
    this.resetFilters();
  }

}
